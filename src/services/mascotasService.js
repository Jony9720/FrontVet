import axiosInstance from './axiosInstance';

export const fetchMascotas = async () => {
    const response = await axiosInstance.get('/mascotas');
    return response.data;
};

export const createMascota = async (data) => {
    const response = await axiosInstance.post('/mascotas', data);
    return response.data;
};

export const deleteMascota = async (id) => {
    const response = await axiosInstance.delete(`/mascotas/${id}`);
    return response.data;
};

export const updateMascota = async (id, data) => {
    const response = await axiosInstance.put(`/mascotas/${id}`, data);
    return response.data;
};

