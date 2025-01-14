import React, { useEffect, useState } from 'react';
import { fetchMascotas, createMascota, deleteMascota, updateMascota } from '../services/mascotasService';
import { useNavigate } from 'react-router-dom';
import '../Mascotas.css';

const Mascotas = () => {
    const [mascotas, setMascotas] = useState([]);
    const [filteredMascotas, setFilteredMascotas] = useState([]); // Lista filtrada
    const [searchText, setSearchText] = useState(''); // Texto de búsqueda

    const [nombre, setNombre] = useState('');
    const [peso, setPeso] = useState('');
    const [propietarioNombre, setPropietarioNombre] = useState('');
    const [propietarioContacto, setPropietarioContacto] = useState('');
    const [domicilio, setDomicilio] = useState('');

    const [editing, setEditing] = useState(false);
    const [currentMascota, setCurrentMascota] = useState(null);
    const navigate = useNavigate();

    const loadMascotas = async () => {
        const data = await fetchMascotas();
        setMascotas(data);
        setFilteredMascotas(data); // Inicializa la lista filtrada
    };

    const handleCreate = async () => {
        if (!nombre || !peso || !propietarioNombre || !propietarioContacto || !domicilio) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        await createMascota({
            nombre,
            peso,
            propietario_nombre: propietarioNombre,
            propietario_contacto: propietarioContacto,
            domicilio,
        });
        setNombre('');
        setPeso('');
        setPropietarioNombre('');
        setPropietarioContacto('');
        setDomicilio('');
        loadMascotas();
    };

    const handleDelete = async (id) => {
        await deleteMascota(id);
        loadMascotas();
    };

    const handleEdit = (mascota) => {
        setEditing(true);
        setCurrentMascota(mascota);
        setNombre(mascota.nombre);
        setPeso(mascota.peso);
        setPropietarioNombre(mascota.propietario_nombre);
        setPropietarioContacto(mascota.propietario_contacto);
        setDomicilio(mascota.domicilio);
    };

    const handleUpdate = async () => {
        if (!currentMascota) return;

        await updateMascota(currentMascota.id, {
            nombre,
            peso,
            propietario_nombre: propietarioNombre,
            propietario_contacto: propietarioContacto,
            domicilio,
        });

        setEditing(false);
        setCurrentMascota(null);
        setNombre('');
        setPeso('');
        setPropietarioNombre('');
        setPropietarioContacto('');
        setDomicilio('');
        loadMascotas();
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setCurrentMascota(null);
        setNombre('');
        setPeso('');
        setPropietarioNombre('');
        setPropietarioContacto('');
        setDomicilio('');
    };

    // Filtrar las mascotas en función del texto de búsqueda
    useEffect(() => {
        const filtered = mascotas.filter(
            (m) =>
                m.nombre.toLowerCase().includes(searchText.toLowerCase()) || // Coincide con el nombre de la mascota
                m.propietario_nombre.toLowerCase().includes(searchText.toLowerCase()) // Coincide con el nombre del propietario
        );
        setFilteredMascotas(filtered);
    }, [searchText, mascotas]);

    useEffect(() => {
        loadMascotas();
    }, []);

    return (
        <div className="mascotas-container">
            <h1>Gestión de Mascotas</h1>
            <button className="back-button" onClick={() => navigate(-1)}>Regresar</button>

            {/* Campo de búsqueda */}
            <div className="search-bar">
                <label>
                    Buscar:
                    
                </label>
            </div>

            {/* Formulario de crear/editar */}
            <div className="mascotas-form">
                <input
                        type="text"
                        placeholder="Escribe el nombre de la mascota o propietario"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)} // Actualiza el texto de búsqueda
                    />
                <input
                    type="text"
                    placeholder="Nombre de la mascota"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Peso de la mascota"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nombre del propietario"
                    value={propietarioNombre}
                    onChange={(e) => setPropietarioNombre(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Contacto del propietario"
                    value={propietarioContacto}
                    onChange={(e) => setPropietarioContacto(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Domicilio"
                    value={domicilio}
                    onChange={(e) => setDomicilio(e.target.value)}
                />

                {!editing ? (
                    <button onClick={handleCreate}>Crear Mascota</button>
                ) : (
                    <>
                        <button onClick={handleUpdate}>Guardar Cambios</button>
                        <button className="cancel" onClick={handleCancelEdit}>Cancelar</button>
                    </>
                )}
            </div>

            {/* Lista de mascotas */}
            <ul>
                {filteredMascotas.map((mascota) => (
                    <li key={mascota.id} className="mascota-item">
                        <div className="mascota-info">
                            {mascota.nombre} - {mascota.peso}kg
                            <br />
                            Propietario: {mascota.propietario_nombre} ({mascota.propietario_contacto})
                            <br />
                            Domicilio: {mascota.domicilio}
                        </div>
                        <div className="mascotas-list">
                            <button onClick={() => handleEdit(mascota)} className="btn btn-warning">Editar</button>
                            <button onClick={() => handleDelete(mascota.id)} className="btn btn-danger">Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Mascotas;
