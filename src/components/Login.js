import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, password }),
            });            

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en el servidor.');
        }
    };

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <button className="back-button" onClick={() => navigate(-1)}>Regresar</button> {/* Botón de regresar */}
            <form onSubmit={handleSubmit}>
                <input
                    type="Nombre"
                    placeholder="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
