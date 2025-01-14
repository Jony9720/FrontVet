import axiosInstance from './axiosInstance';

export const fetchPersonal = async () => {
    const response = await axiosInstance.get('/personal');
    return response.data;
};

export const createPersonal = async (data) => {
    const response = await axiosInstance.post('/personal', data);
    return response.data;
};

export const deletePersonal = async (id) => {
    const response = await axiosInstance.delete(`/personal/${id}`);
    return response.data;
};
