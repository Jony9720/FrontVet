import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [rol, setRol] = useState('recepcion_principal'); // Valor por defecto
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, rol, password }),
            });            

            const data = await response.json();
            if (response.ok) {
                alert('Usuario registrado con éxito.');
                setNombre('');
                setRol('recepcion_principal');
                setPassword('');
            } else {
                alert(data.error || 'Error al registrar el usuario.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en el servidor.');
        }
    };

    return (
        <div>
            <h1>Registrar Usuario</h1>
            <button className="back-button" onClick={() => navigate(-1)}>Regresar</button> {/* Botón de regresar */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <select value={rol} onChange={(e) => setRol(e.target.value)}>
                    <option value="recepcion_principal">Recepción</option>
                    
                    <option value="grooming_principal">Grooming</option>
                    
                </select>
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
