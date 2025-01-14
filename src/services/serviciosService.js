import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const createServicio = async (servicioData) => {
    const response = await axios.post(`${API_URL}/servicios`, servicioData);
    return response.data;
};

export const fetchServicios = async () => {
    const response = await axios.get(`${API_URL}/servicios`);
    return response.data;
};

export const updateEstadoServicio = async (id, estado) => {
    const response = await axios.put(`${API_URL}/servicios/${id}`, { estado });
    return response.data;
};

export const updateServicio = async (id, servicio) => {
    const response = await axios.put(`${API_URL}/servicios/${id}`, servicio); // Envía los datos directamente
    return response.data;
};

export const archivarServicio = async (id) => {
    const response = await axios.put(`${API_URL}/servicios/archivar/${id}`);
    return response.data;
};

export const fetchServiciosDashboard = async () => {
    const response = await axios.get(`${API_URL}/servicios/grooming-dashboard`);
    return response.data;
};
