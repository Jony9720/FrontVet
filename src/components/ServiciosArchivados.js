import React, { useState, useEffect } from 'react';
import { fetchServicios } from '../services/serviciosService'; // Asegúrate de tener este servicio configurado
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import '../ServiciosArchivados.css';

const ServiciosArchivados = () => {
    const [archivados, setArchivados] = useState([]);
    const [expandedServicioId, setExpandedServicioId] = useState(null); // ID del servicio con detalles visibles
    const [filteredServicios, setFilteredServicios] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const loadArchivados = async () => {
            try {
                const servicios = await fetchServicios(); // Solicitar todos los servicios
                console.log('Servicios cargados:', servicios); // Verificar servicios recibidos
                const archivados = servicios.filter((servicio) => servicio.archivado === true || servicio.archivado === 1);
                console.log('Servicios archivados:', archivados); // Verificar servicios archivados
                setArchivados(archivados); // Actualizar el estado
            } catch (error) {
                console.error('Error al cargar servicios archivados:', error);
            }
        };
        loadArchivados();
    }, []); // Ejecutar solo al montar el componente    

    useEffect(() => {
        // Filtrar por texto de búsqueda
        const lowerSearchText = searchText.toLowerCase();
        const serviciosFiltrados = archivados.filter(
            (servicio) =>
                servicio.Mascota.nombre.toLowerCase().includes(lowerSearchText) ||
                servicio.Mascota.propietario_nombre.toLowerCase().includes(lowerSearchText)
        );
        setFilteredServicios(serviciosFiltrados);
    }, [searchText, archivados]);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };
    
    useEffect(() => {
        if (selectedDate) {
            const selected = new Date(selectedDate).toLocaleDateString();
            const filtered = archivados.filter((servicio) => {
                const ingresoDate = new Date(servicio.fecha_ingreso).toLocaleDateString();
                return ingresoDate === selected;
            });
            console.log('Servicios filtrados:', filtered);
            setFilteredServicios(filtered);
        } else {
            setFilteredServicios([]);
        }
    }, [selectedDate, archivados]);
    

   const generarResumenPDF = () => {
    const doc = new jsPDF();
    const margenX = 10;
    let y = 20; // Posición inicial en Y

    // Título principal del documento
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Servicios Archivados', margenX, y);
    y += 10; // Espacio después del título

    if (filteredServicios.length === 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('No hay servicios para la fecha seleccionada.', margenX, y);
    } else {
        filteredServicios.forEach((servicio, index) => {
            // Añade un encabezado para cada servicio
            y += 10;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(`Servicio ${index + 1}`, margenX, y);

            // Detalles del servicio
            y += 8;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Mascota: ${servicio.Mascota.nombre}`, margenX, y);
            y += 6;
            doc.text(`Propietario: ${servicio.Mascota.propietario_nombre}`, margenX, y);
            y += 6;
            doc.text(`Peluquero: ${servicio.peluquero.nombre}`, margenX, y);
            y += 6;
            doc.text(`Fecha y Hora de Ingreso: ${new Date(servicio.fecha_ingreso).toLocaleString()}`, margenX, y);
            y += 6;

            // Línea separadora
            doc.setDrawColor(200, 200, 200); // Color gris claro
            doc.line(margenX, y, 200, y);
            y += 6;

            // Comprueba si hay que mover a una nueva página
            if (y > 280) {
                doc.addPage();
                y = 20; // Restablece la posición inicial
            }
        });
    }

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Vet San Ignacio - Grooming', margenX, 290);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, margenX, 295);

    // Guardar el archivo PDF
    doc.save(`Resumen_Servicios_${selectedDate}.pdf`);
};


    const toggleDetails = (id) => {
        setExpandedServicioId((prevId) => (prevId === id ? null : id)); // Alterna entre mostrar u ocultar detalles
    };

    const generarPDF = (servicio) => {
        const doc = new jsPDF();
    
        // Variables de configuración
        const margenX = 10;
        let y = 30; // Posición inicial en Y
    
        // Añadir el logo (asegúrate de tener el logo en formato base64 o URL accesible)
        const logo = '';
        doc.addImage(logo, 'jpeg', margenX, 5, 35, 19); // Posición X, Y, ancho, alto
    
        // Título del documento
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalles del Servicio', margenX + 50, 20); // Centrado con respecto al logo
    
        // Línea decorativa
        doc.setDrawColor(255, 0, 0); // rojo
        doc.setLineWidth(0.5);
        doc.line(margenX, 25, 200, 25); // Línea horizontal
    
        // Información del servicio
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        y += 10;

        const agregarTextoNegrita = (etiqueta, contenido) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${etiqueta}: `, margenX, y, { baseline: 'top' });
            const etiquetaWidth = doc.getTextWidth(`${etiqueta}: `);
            doc.setFont('helvetica', 'normal');
            doc.text(contenido, margenX + etiquetaWidth, y, { baseline: 'top' });
            y += 8;
        };
    
        agregarTextoNegrita('Mascota', servicio.Mascota.nombre);
        agregarTextoNegrita('Peso de la Mascota', `${servicio.Mascota.peso} kg`);
        agregarTextoNegrita('Propietario', servicio.Mascota.propietario_nombre);
        agregarTextoNegrita('Domicilio del Propietario', servicio.Mascota.domicilio);
        agregarTextoNegrita('Número de Contacto', servicio.Mascota.propietario_contacto);
        agregarTextoNegrita('Peluquero', servicio.peluquero.nombre);
        agregarTextoNegrita('Fecha y Hora de Ingreso', new Date(servicio.fecha_ingreso).toLocaleString());
        agregarTextoNegrita('Tipo de Corte', servicio.tipo_corte || 'No especificado');
        agregarTextoNegrita('Observaciones', servicio.observaciones || 'Ninguna');
        agregarTextoNegrita('Pulgas', servicio.pulgas ? 'Sí' : 'No');
        agregarTextoNegrita('Garrapatas', servicio.garrapatas ? 'Sí' : 'No');
        agregarTextoNegrita('Servicio a Domicilio', servicio.domicilio ? 'Sí' : 'No');
        agregarTextoNegrita('Método de Pago', servicio.metodo_pago);
        agregarTextoNegrita(
            'Fecha y Hora de Finalización',
            new Date(servicio.hora_finalizacion).toLocaleString()
        );

        // Añadir la firma si está disponible
        if (servicio.firma) {
            y += 10; // Espacio antes de la firma
            doc.text('Firma del Propietario:', margenX, y);
            y += 10; // Posicionar la firma más abajo
            doc.addImage(servicio.firma, 'PNG', margenX, y, 80, 30); // Ajustar dimensiones y posición
            y += 40; // Espacio después de la firma
        } else {
            y += 10;
            doc.text('Firma del Propietario: No registrada', margenX, y);
            y += 10;
        }

        // Pie de página
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Vet San Ignacio - Grooming', margenX, 280);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, margenX, 285);
    
        // Guardar el PDF
        doc.save(`Servicio_${servicio.id}.pdf`);
    };
       

    return (
        <div className="archivados-container">
            <h1>Servicios Archivados</h1>
            <button className="regresar-button" onClick={() => navigate(-1)}>Regresar</button>

            <label htmlFor="fecha">Seleccionar Fecha:</label>
            <input
                type="datetime-local"
                id="fecha"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />

            <label htmlFor="buscar">Buscar por nombre o propietario:</label>
            <input
                type="text"
                id="buscar"
                placeholder="Escribe el nombre de la mascota o propietario"
                value={searchText}
                onChange={handleSearchChange}
            />

            <button onClick={generarResumenPDF} disabled={!selectedDate}>
                Generar Resumen PDF
            </button>


            {filteredServicios.length > 0 ? (
                <ul>
                    {filteredServicios.map((servicio) => (
                        <li key={servicio.id} className="archivado-item">
                            <p><strong>Mascota:</strong> {servicio.Mascota.nombre}</p>
                            <p><strong>Propietario:</strong> {servicio.Mascota.propietario_nombre}</p>
                            <p><strong>Peluquero:</strong> {servicio.peluquero.nombre}</p>
                            <p><strong>Fecha y Hora de Ingreso:</strong> {new Date(servicio.fecha_ingreso).toLocaleString()}</p>
                            <p><strong>Estado:</strong> {servicio.estado}</p>
                            <div className="botones-container">
                                <button
                                    className="detalles-boton"
                                    onClick={() => toggleDetails(servicio.id)}
                                >
                                    {expandedServicioId === servicio.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                                </button>

                                <button
                                    className="descargar-boton"
                                    onClick={() => generarPDF(servicio)}
                                >
                                    Descargar PDF
                                </button>
                            </div>
                            {expandedServicioId === servicio.id && (
                                <div className="detalles-servicio">
                                    <p><strong>Jaula:</strong> {servicio.Jaula?.color || 'Sin color'} - {servicio.Jaula?.numero || 'Sin número'}</p>
                                    <p><strong>Tipo de Corte:</strong> {servicio.tipo_corte || 'No especificado'}</p>
                                    <p><strong>Observaciones:</strong> {servicio.observaciones || 'Ninguna'}</p>
                                    <p><strong>Pulgas:</strong> {servicio.pulgas ? 'Sí' : 'No'}</p>
                                    <p><strong>Garrapatas:</strong> {servicio.garrapatas ? 'Sí' : 'No'}</p>
                                    <p><strong>Recepcionista:</strong> {servicio.recepcionista.nombre}</p>
                                    <p><strong>Servicio a Domicilio:</strong> {servicio.domicilio ? 'Sí' : 'No'}</p>
                                    <p><strong>Método de Pago:</strong> {servicio.metodo_pago}</p>
                                    <p><strong>Fecha y Hora de Finalización:</strong> {new Date(servicio.hora_finalizacion).toLocaleString()}</p>
                                    <p><strong>Firma del propietario:</strong></p>
                                        {servicio.firma ? (
                                            <img src={servicio.firma} alt="Firma" style={{ width: '100%', maxHeight: '200px' }} />
                                        ) : (
                                            <p>No hay firma registrada.</p>
                                        )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay servicios archivados.</p>
            )}
        </div>
    );
};

export default ServiciosArchivados;
