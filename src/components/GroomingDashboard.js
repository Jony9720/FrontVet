import React, { useEffect, useState } from 'react';
import { fetchServiciosDashboard, updateEstadoServicio } from '../services/serviciosService';
import { useNavigate } from 'react-router-dom';
import '../GroomingDashboard.css';

const GroomingDashboard = () => {
    const [servicios, setServicios] = useState([]);
    const [coloresJaulas, setColoresJaulas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadServicios = async () => {
            try {
                const data = await fetchServiciosDashboard();
                setServicios(data);

                // Obtener colores únicos de las jaulas
                const colores = [...new Set(data.map((servicio) => servicio.Jaula.color))];
                setColoresJaulas(colores);
            } catch (error) {
                console.error('Error al cargar servicios:', error);
            }
        };
        loadServicios();

        const interval = setInterval(() => {
            loadServicios();
        }, 5000); // Cambia 5000 (5 segundos) según lo que necesites

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    const handleEstadoChange = async (id, nuevoEstado) => {
        try {
            await updateEstadoServicio(id, nuevoEstado);
            setServicios((prevServicios) =>
                prevServicios.map((servicio) =>
                    servicio.id === id ? { ...servicio, estado: nuevoEstado } : servicio
                )
            );
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    };

    return (
        <div className="grooming-dashboard">
            <h1>Grooming - Tablero</h1>
            <button className="back-button" onClick={() => navigate(-1)}>Regresar</button>
            <div className="dashboard-grid">
                {coloresJaulas.map((color) => (
                    <div key={color} className="column">
                        <h2>{color}</h2>
                        {[1, 2, 3, 4, 5].map((numero) => (
                            <div key={numero} className="cell">
                                <h3>Jaula {numero}</h3>
                                {servicios
                                    .filter(
                                        (servicio) =>
                                            servicio.Jaula.color === color &&
                                            servicio.Jaula.numero === numero
                                    )
                                    .map((servicio) => (
                                        <div key={servicio.id} className="servicio-card">
                                            <p><strong>Mascota:</strong> {servicio.Mascota?.nombre || 'Sin asignar'}</p>
                                            <p><strong>Peluquero:</strong> {servicio.peluquero.nombre || 'Sin asignar'}</p>
                                            <p><strong>Recepcionista:</strong> {servicio.recepcionista.nombre || 'Sin asignar'}</p>
                                            <p><strong>Tipo de Corte:</strong> {servicio.tipo_corte || 'No especificado'}</p>
                                            <p><strong>Observaciones:</strong> {servicio.observaciones || 'Ninguna'}</p>
                                            <p><strong>Estado:</strong> {servicio.estado}</p>
                                            <div className="grooming-estado-buttons">
                                                <button
                                                    onClick={() =>
                                                        handleEstadoChange(servicio.id, 'pendiente')
                                                    }
                                                    disabled={servicio.estado === 'pendiente'}
                                                >
                                                    Pendiente
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEstadoChange(servicio.id, 'en progreso')
                                                    }
                                                    disabled={servicio.estado === 'en progreso'}
                                                >
                                                    En Progreso
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEstadoChange(servicio.id, 'finalizado')
                                                    }
                                                    disabled={servicio.estado === 'finalizado'}
                                                >
                                                    Finalizado
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroomingDashboard;

