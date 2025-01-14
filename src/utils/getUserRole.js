const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
        return payload.rol; // Retorna el rol del usuario
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};

export default getUserRole;

