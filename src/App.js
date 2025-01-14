import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Jaulas from './components/Jaulas';
import Personal from './components/Personal';
import Mascotas from './components/Mascotas';
import RegistroServicio from './components/RegistroServicio';
import Servicios from './components/Servicios';
import ServiciosArchivados from './components/ServiciosArchivados';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import GroomingDashboard from './components/GroomingDashboard';


const App = () => {
    return (
        <Router>
            <div className="container">
                
                <h1>Vet San Ignacio - Grooming</h1>

                <Routes>
                    <Route
                        path="/"
                        element={
                          <div className="section-link">
                              <div className="row">
                                <div className="section-card">
                                    <h2>Iniciar Sesión</h2>
                                    <p>Accede al sistema como recepcionista o grooming.</p>
                                    <Link to="/login">Ir a Login</Link>
                                </div>
                                <div className="section-card">
                                    <h2>Registrar Usuario</h2>
                                    <p>Crea un nuevo usuario en el sistema.</p>
                                    <Link to="/register">Ir a Registro</Link>
                                </div>

                              </div>
                              <div className="row">
                                  
                            
                              </div>
                              
                          </div>
                      
                        }
                    />
                    <Route path="/jaulas" element={<Jaulas />} />
                    <Route path="/personal" element={<Personal />} />
                    <Route path="/mascotas" element={<Mascotas />} />
                    <Route path="/registro-servicio" element={<RegistroServicio />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/servicios-archivados" element={<ServiciosArchivados />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/grooming-principal" element={<GroomingDashboard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

