import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://back-vet-lovat.vercel.app/api', // Usa REACT_APP_ para variables de entorno en React
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
