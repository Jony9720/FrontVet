import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { fetchMascotas } from '../services/mascotasService';
import { fetchPersonal } from '../services/personalService';
import { fetchJaulasDisponibles } from '../services/jaulasService';
import { createServicio } from '../services/serviciosService';
import { useNavigate } from 'react-router-dom'; // Para navegación
import '../Registro.css'; // Importar estilos

const RegistroServicio = () => {
    const navigate = useNavigate(); // Hook para navegar

    const [mascotas, setMascotas] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [jaulas, setJaulas] = useState([]);
    const [searchText, setSearchText] = useState(''); // Manejar el texto del filtro
    const [formData, setFormData] = useState({
        fecha_ingreso: '',
        tipo_corte: '',
        observaciones: '',
        domicilio: false,
        metodo_pago: 'efectivo',
        pulgas: false,
        garrapatas: false,
        jaula_id: '',
        peluquero_id: '',
        recepcionista_id: '',
        mascota_id: '',
    });
    const [firma, setFirma] = useState('');
    const sigCanvas = useRef({});

    useEffect(() => {
        const loadData = async () => {
            try {
                setMascotas(await fetchMascotas());
                setPersonal(await fetchPersonal());
                setJaulas(await fetchJaulasDisponibles()); // Solo jaulas disponibles
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };
        loadData();

        // Polling cada 5 segundos
        const interval = setInterval(() => {
            loadData();
        }, 5000);

        return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, []);    

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const guardarFirma = () => {
        if (sigCanvas.current.isEmpty()) {
            alert('Por favor, firme antes de guardar.');
            return;
        }
        const firmaData = sigCanvas.current.toDataURL(); // Captura la firma en Base64
        setFirma(firmaData); // Actualiza el estado de la firma
        alert('Firma guardada correctamente.');
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firma) {
            alert('Por favor, firme para confirmar el registro.');
            return;
        }
        try {
            const dataToSend = { ...formData, firma};
            console.log('Datos enviados:', dataToSend);
            await createServicio(dataToSend);
            alert('Servicio registrado con éxito.');
            setFormData({
                fecha_ingreso: '',
                tipo_corte: '',
                observaciones: '',
                domicilio: false,
                metodo_pago: 'efectivo',
                pulgas: false,
                garrapatas: false,
                jaula_id: '',
                peluquero_id: '',
                recepcionista_id: '',
                mascota_id: '',
            });
            sigCanvas.current.clear(); // Limpia el canvas de firma
            setFirma(''); // Reinicia la firma
        } catch (error) {
            console.error(error);
            alert('Error al registrar el servicio.');
        }
    };

    const handleSearchChange = async (e) => {
        const query = e.target.value.toLowerCase();
        setSearchText(query);
    
        if (query) {
            try {
                const response = await fetch(`/api/mascotas/buscar?query=${query}`);
                const data = await response.json();
                setMascotas(data); // Actualiza las mascotas con los resultados filtrados
            } catch (error) {
                console.error('Error al buscar mascotas:', error);
            }
        } else {
            // Recargar todas las mascotas si no hay texto
            setMascotas(await fetchMascotas());
        }
    };
    
    const filteredMascotas = mascotas.filter(
        (mascota) =>
            mascota.nombre.toLowerCase().includes(searchText) || // Coincidencia en el nombre
            mascota.propietario_nombre.toLowerCase().includes(searchText) // Coincidencia en el propietario
    );

    return (
        <div className="registro-container">
            <h1>Registrar Servicio de Grooming</h1>
            <button className="regresar-button" onClick={() => navigate(-1)}>Regresar</button>
            <form onSubmit={handleSubmit} className="registro-form">

                <label>
                    Buscar Mascota:
                    <input
                        type="text"
                        value={searchText}
                        onChange={handleSearchChange} // Enlaza aquí el evento
                        placeholder="Escribe el nombre de la mascota o propietario"
                    />
                </label>

                <label>
                    Mascota:
                    <select
                        name="mascota_id"
                        value={formData.mascota_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccionar Mascota</option>
                        {filteredMascotas.map((m) => (
                            <option key={m.id} value={m.id}>
                            {`${m.nombre} - ${m.propietario_nombre} (${m.propietario_contacto}) - Domicilio: ${m.domicilio || 'No especificado'}`}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Jaula:
                    <select
                        name="jaula_id"
                        value={formData.jaula_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccionar Jaula</option>
                        {jaulas.map((j) => (
                            <option key={j.id} value={j.id}>
                                {j.color} - {j.numero}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Peluquero:
                    <select
                        name="peluquero_id"
                        value={formData.peluquero_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccionar Peluquero</option>
                        {personal
                            .filter((p) => p.rol === 'peluquero')
                            .map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre}
                                </option>
                            ))}
                    </select>
                </label>
                <label>
                    Recepcionista:
                    <select
                        name="recepcionista_id"
                        value={formData.recepcionista_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccionar Recepcionista</option>
                        {personal
                            .filter((p) => p.rol === 'recepcionista')
                            .map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre}
                                </option>
                            ))}
                    </select>
                </label>
               
                <label>
                    Tipo de Corte (Opcional):
                    <input
                        type="text"
                        name="tipo_corte"
                        value={formData.tipo_corte}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Observaciones (Opcional):
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                    />
                </label>

                <div className="checkbox-group">
                    <label>
                        ¿Tiene Pulgas?
                        <input
                            type="checkbox"
                            name="pulgas"
                            checked={formData.pulgas}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        ¿Tiene Garrapatas?
                        <input
                            type="checkbox"
                            name="garrapatas"
                            checked={formData.garrapatas}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Servicio a Domicilio:
                        <input
                            type="checkbox"
                            name="domicilio"
                            checked={formData.domicilio}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>

                <label>
                    Método de Pago:
                    <select
                        name="metodo_pago"
                        value={formData.metodo_pago}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </label>

                <label>
                    Fecha y Hora de Ingreso:
                    <input
                        type="datetime-local"
                        name="fecha_ingreso"
                        value={formData.fecha_ingreso}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                {/* Captura de la firma */}
                <div>
                    <h3>Firma del Propietario</h3>
                    <SignatureCanvas
                        ref={sigCanvas}
                        canvasProps={{
                            width: 500,
                            height: 200,
                            className: 'sigCanvas',
                        }}
                    />
                    <button type="button" className="borrar-firma-button" onClick={() => sigCanvas.current.clear()}>Borrar Firma</button>
                    <button type="button" className="guardar-firma-button" onClick={guardarFirma}>Guardar Firma</button>
                    {firma && <p style={{ color: 'green' }}>Firma guardada correctamente.</p>}
                </div>
                <button type="submit" className="submit-button">Registrar Servicio</button>
            </form>
        </div>
    );
};

export default RegistroServicio;