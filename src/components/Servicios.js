import React, { useEffect, useState } from 'react';
import { fetchServicios, updateEstadoServicio, updateServicio, archivarServicio } from '../services/serviciosService';
import { useNavigate } from 'react-router-dom';
import { liberarJaula } from '../services/jaulasService';

import '../Servicios.css';

const Servicios = () => {
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [editingServicio, setEditingServicio] = useState(null); // Servicio que se está editando
    const [expandedServicioId, setExpandedServicioId] = useState(null); // ID del servicio con detalles visibles

    const loadServicios = async () => {
        try {
            const data = await fetchServicios();
            setServicios(data.filter((servicio) => !servicio.archivado)); // Excluye los archivados
        } catch (error) {
            console.error('Error al cargar servicios:', error);
        }
    };

    useEffect(() => {
        loadServicios();

        const interval = setInterval(() => {
            loadServicios();
        }, 5000); // Cambia 5000 (5 segundos) según lo que necesites

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    const handleEstadoChange = async (id, nuevoEstado) => {
        try {
            await updateEstadoServicio(id, nuevoEstado);
            alert('Estado actualizado correctamente.');
            loadServicios();
        } catch (error) {
            console.error(error);
            alert('Error al actualizar el estado del servicio.');
        }
    };

    const handleLiberarJaula = async (jaulaId) => {
        try {
            await liberarJaula(jaulaId);
            alert('Jaula liberada con éxito y hora de finalizacion registrada.');
            loadServicios();
        } catch (error) {
            console.error('Error al liberar jaula:', error);
            alert('Error al liberar la jaula.');
        }
    };

    const handleEditServicio = (servicio) => {
        setEditingServicio({ ...servicio }); // Clona el servicio a editar
    };

    const handleArchivarServicio = async (id) => {
        try {
            await archivarServicio(id, { archivado: true });
            alert('Servicio archivado con éxito.');
            setServicios((prevServicios) => prevServicios.filter((servicio) => servicio.id !== id));
            window.location.reload(); // Recarga la página para reflejar los cambios
        } catch (error) {
            console.error('Error al archivar el servicio:', error);
            alert('Error al archivar el servicio.');
        }
    };    
    

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        try {
            await updateServicio(editingServicio.id, editingServicio);
            alert('Servicio actualizado correctamente.');
            setEditingServicio(null); // Cierra el formulario de edición
            loadServicios(); // Recarga la lista de servicios
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
            alert('Error al actualizar el servicio.');
        }
    };

    const toggleDetails = (id) => {
        setExpandedServicioId((prevId) => (prevId === id ? null : id)); // Alterna entre mostrar u ocultar detalles
    };

    return (
        <div className="servicios-container">
            <h1>Servicios de Grooming</h1>
            <button className="regresar-button" onClick={() => navigate(-1)}>Regresar</button>

            <ul className="servicios-list">
                {servicios.map((servicio) => (
                    <li key={servicio.id} 
                        className="servicio-item"
                        style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: servicio.estado === 'finalizado' ? 'lightgreen' : 'white',
                        }}>
                        {editingServicio?.id === servicio.id ? (
                            <form onSubmit={handleSubmitEdit} className="editar-servicio-form">
                                <h3>Editando Servicio</h3>
                                <label>
                                    Tipo de Corte:
                                    <input
                                        type="text"
                                        value={editingServicio.tipo_corte}
                                        onChange={(e) =>
                                            setEditingServicio({ ...editingServicio, tipo_corte: e.target.value })
                                        }
                                    />
                                </label>
                                <label>
                                    Observaciones:
                                    <textarea
                                        value={editingServicio.observaciones}
                                        onChange={(e) =>
                                            setEditingServicio({ ...editingServicio, observaciones: e.target.value })
                                        }
                                    />
                                </label>
                                <button type="submit">Guardar Cambios</button>
                                <button type="button" onClick={() => setEditingServicio(null)}>Cancelar</button>
                            </form>
                        ) : (
                            <>
                                <p><strong>Mascota:</strong> {servicio.Mascota.nombre} - {servicio.Mascota.peso}kg</p>
                                <p><strong>Jaula:</strong> {servicio.Jaula?.color || 'Sin color'} - {servicio.Jaula?.numero || 'Sin número'}</p>
                                <p><strong>Peluquero:</strong> {servicio.peluquero.nombre}</p>
                                <p><strong>Recepcionista:</strong> {servicio.recepcionista.nombre}</p>
                                <p><strong>Estado:</strong> {servicio.estado}</p>
                                {servicio.estado === 'finalizado' && (
                                <p style={{ color: 'red', fontWeight: 'bold' }}>
                                    El servicio ha finalizado, contacta al propietario.
                                </p>
                                )}
                                <div className="servicios-estado-buttons">
                                    <button onClick={() => handleEditServicio(servicio)}>Editar</button>
                                    <button onClick={() => toggleDetails(servicio.id)}>
                                        {expandedServicioId === servicio.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                                    </button>
                                    <button onClick={() => handleEstadoChange(servicio.id, 'pendiente')} disabled={servicio.estado === 'pendiente'}>
                                        Pendiente
                                    </button>
                                    <button onClick={() => handleEstadoChange(servicio.id, 'en progreso')} disabled={servicio.estado === 'en progreso'}>
                                        En Progreso
                                    </button>
                                    <button onClick={() => handleEstadoChange(servicio.id, 'finalizado')} disabled={servicio.estado === 'finalizado'}>
                                        Finalizado
                                    </button>
                                    <button
                                        onClick={() => handleLiberarJaula(servicio.jaula_id)}
                                        disabled={servicio.estado !== 'finalizado'}
                                    >
                                        Liberar Jaula
                                    </button>
                                    <button onClick={() => handleArchivarServicio(servicio.id)}>Archivar</button>
                                </div>
                                {expandedServicioId === servicio.id && (
                                    <div className="detalles-servicio">
                                        
                                        <p><strong>Propietario:</strong> {servicio.Mascota.propietario_nombre} - <strong>Tel:</strong> {servicio.Mascota.propietario_contacto} - <strong>Domicilio:</strong> {servicio.Mascota.domicilio}</p>
                                        <p><strong>Tipo de Corte:</strong> {servicio.tipo_corte || 'No especificado'}</p>
                                        <p><strong>Observaciones:</strong> {servicio.observaciones || 'Ninguna'}</p>
                                        <p><strong>Pulgas:</strong> {servicio.pulgas ? 'Sí' : 'No'}</p>
                                        <p><strong>Garrapatas:</strong> {servicio.garrapatas ? 'Sí' : 'No'}</p>
                                        <p><strong>Servicio a Domicilio:</strong> {servicio.domicilio ? 'Sí' : 'No'}</p>
                                        <p><strong>Método de pago:</strong> {servicio.metodo_pago}</p>
                                        <p><strong>Hora de Ingreso:</strong> {new Date(servicio.fecha_ingreso).toLocaleString()}</p>
                                        <p><strong>Firma del propietario:</strong></p>
                                            {servicio.firma ? (
                                                <img src={servicio.firma} alt="Firma" style={{ width: '100%', maxHeight: '200px' }} />
                                            ) : (
                                                <p>No hay firma registrada.</p>
                                            )}
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Servicios;
