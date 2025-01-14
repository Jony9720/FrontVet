import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import getUserRole from '../utils/getUserRole'; // Función para obtener el rol
import GroomingDashboard from './GroomingDashboard'; // Importa el tablero de grooming

const Dashboard = () => {
    const rol = getUserRole();
    const navigate = useNavigate();

    if (rol === 'recepcion_principal') {
        return (
            <div className="container">
                <button className="back-button" onClick={() => navigate(-1)}>Regresar</button> {/* Botón de regresar */}
                <div className="section-link">
                    <div className="row">
                        <div className="section-card">
                            <h2>Gestión de Jaulas</h2>
                            <p>Administra las jaulas asignadas para las mascotas.</p>
                            <Link to="/jaulas">Ir a Jaulas</Link>
                        </div>
                        <div className="section-card">
                            <h2>Gestión de Personal</h2>
                            <p>Gestiona el personal encargado de la recepción y grooming.</p>
                            <Link to="/personal">Ir a Personal</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="section-card">
                            <h2>Gestión de Mascotas</h2>
                            <p>Administra los datos de las mascotas y sus propietarios.</p>
                            <Link to="/mascotas">Ir a Mascotas</Link>
                        </div>
                        <div className="section-card">
                            <h2>Registro de Grooming</h2>
                            <p>Registra los grooming del día</p>
                            <Link to="/registro-servicio">Ir a Registro</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="section-card">
                            <h2>Lista de Grooming</h2>
                            <p>Ve el progreso de los grooming's</p>
                            <Link to="/servicios">Ir a lista de grooming</Link>
                        </div>
                        <div className="section-card">
                            <h2>Lista de Grooming Archivados</h2>
                            <p>Ve los archivos de los grooming's que ya terminaron</p>
                            <Link to="/servicios-archivados">Ir a lista de archivos</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (rol === 'grooming_principal') {
        return <GroomingDashboard />; // Renderiza el tablero de grooming
    }

    return (
        <div>
            <h1>Bienvenido al Dashboard</h1>
            <p>Esta es la vista del dashboard para roles específicos.</p>
        </div>
    );
};

export default Dashboard;
