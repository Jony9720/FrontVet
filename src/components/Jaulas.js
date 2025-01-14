import React, { useEffect, useState } from 'react';
import { fetchJaulas, createJaula, toggleBloqueoJaula, deleteJaula } from '../services/jaulasService';
import { useNavigate } from 'react-router-dom'; // Importar el hook
import '../Jaulas.css';

const Jaulas = () => {
    const [jaulas, setJaulas] = useState([]);
    const [color, setColor] = useState('');
    const [numero, setNumero] = useState('');
    const navigate = useNavigate(); // Hook para navegar

    const loadJaulas = async () => {
        const data = await fetchJaulas();
        setJaulas(data);
    };

    const handleCreate = async () => {
        if (!color || !numero) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        try {
            await createJaula({ color, numero });
            setColor('');
            setNumero('');
            loadJaulas();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Hubo un error al crear la jaula.');
        }
    };

    const handleDelete = async (id) => {
        await deleteJaula(id);
        loadJaulas();
    };

    const handleToggleBloqueo = async (id, bloqueada) => {
        await toggleBloqueoJaula(id, !bloqueada);
        loadJaulas();
    };

    useEffect(() => {
        const loadJaulas = async () => {
            try {
                setJaulas(await fetchJaulas()); // Obtener todas las jaulas
            } catch (error) {
                console.error('Error al cargar jaulas:', error);
            }
        };
        loadJaulas();
    }, []);    

    return (
        <div className="jaulas-container">
            <h1>Gestión de Jaulas</h1>
            <button className="back-button" onClick={() => navigate(-1)}>Regresar</button> {/* Botón de regresar */}
            <div className="jaulas-form">
                <input
                    type="text"
                    placeholder="Color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Número (1-5)"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                />
                <button onClick={handleCreate}>Crear Jaula</button>
            </div>

            <ul className="jaulas-list">
                {jaulas.map((jaula) => (
                    <li key={jaula.id}>
                        {jaula.color} - {jaula.numero} - {jaula.bloqueada ? 'Bloqueada' : 'Desbloqueada'}
                        <div>
                            <button onClick={() => handleToggleBloqueo(jaula.id, jaula.bloqueada)}>
                                {jaula.bloqueada ? 'Desbloquear' : 'Bloquear'}
                            </button>
                            <button onClick={() => handleDelete(jaula.id)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Jaulas;
