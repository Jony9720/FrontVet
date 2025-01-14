import React, { useEffect, useState } from 'react';
import { fetchPersonal, createPersonal, deletePersonal } from '../services/personalService';
import { useNavigate } from 'react-router-dom'; // Importa el hook
import '../Personal.css'; // Importa el archivo CSS

const Personal = () => {
    const [personal, setPersonal] = useState([]);
    const [nombre, setNombre] = useState('');
    const [rol, setRol] = useState('recepcionista');
    const navigate = useNavigate(); // Hook para navegar

    const loadPersonal = async () => {
        const data = await fetchPersonal();
        setPersonal(data);
    };

    const handleCreate = async () => {
        if (!nombre) {
            alert('Por favor, completa el campo de nombre.');
            return;
        }
        await createPersonal({ nombre, rol });
        setNombre('');
        setRol('recepcionista');
        loadPersonal();
    };

    const handleDelete = async (id) => {
        await deletePersonal(id);
        loadPersonal();
    };

    useEffect(() => {
        loadPersonal();
    }, []);

    return (
        <div className="personal-container">
            <h1>Gestión de Personal</h1>
            <button className="back-button" onClick={() => navigate(-1)}>Regresar</button> {/* Botón de regresar */}
            <div className="personal-form">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <select value={rol} onChange={(e) => setRol(e.target.value)}>
                    <option value="recepcionista">Recepcionista</option>
                    <option value="peluquero">Peluquero</option>
                </select>
                <button onClick={handleCreate}>Crear Personal</button>
            </div>

            <ul className="personal-list">
                {personal.map((p) => (
                    <li key={p.id}>
                        {p.nombre} - {p.rol}
                        <button onClick={() => handleDelete(p.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Personal;
