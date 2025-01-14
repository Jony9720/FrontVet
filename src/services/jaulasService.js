import axiosInstance from './axiosInstance';

export const fetchJaulas = async () => {
    const response = await axiosInstance.get('/jaulas');
    return response.data;
};

export const createJaula = async (data) => {
    const response = await axiosInstance.post('/jaulas', data);
    return response.data;
};

export const toggleBloqueoJaula = async (id, bloqueada) => {
    const response = await axiosInstance.put(`/jaulas/${id}`, { bloqueada });
    return response.data;
};

export const deleteJaula = async (id) => {
    const response = await axiosInstance.delete(`/jaulas/${id}`);
    return response.data;
};

export const fetchJaulasDisponibles = async () => {
    const response = await axiosInstance.get('/jaulas/disponibles');
    return response.data;
};

export const liberarJaula = async (jaulaId) => {
    const response = await axiosInstance.put(`/jaulas/liberar/${jaulaId}`);
    return response.data;
};


