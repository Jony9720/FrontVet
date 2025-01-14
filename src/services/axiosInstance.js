import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Usa REACT_APP_ para variables de entorno en React
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
