import axios from "axios";
import API_BASE from "./config";
const API_NOTAS = `${API_BASE}/calificacion/guardarnotashorario/`; 
const API_URL_USER = `${API_BASE}/usuarios/usuarios`;
const API_TOTALES_ALUM = `${API_BASE}/usuarios/totalAlumnos`;
const API_BUSCAR_ALUMNOS = `${API_BASE}/usuarios/buscarAlumnos`;

export async function loginUser(userCode) {
    try{
        const response = await axios.post(`${API_URL_USER}/login/`,
            new URLSearchParams({'codigo_usuario': userCode}),
            {headers: {'Content-Type':'application/x-www-form-urlencoded'}}
        );
        return response.data;         
    }
    catch(error){
        throw error.response?.data?.error || "Error al iniciar sesión";
    }
}


//create more services about the users ....
export async function getTotalAlumnos() {
    try {
        const response = await axios.get(API_TOTALES_ALUM);

        // Verifica que la respuesta tenga el valor esperado
        if (typeof response.data !== 'number') {
            throw new Error('Respuesta inesperada de la API');
        }

        return response.data; // Devuelve la cantidad de alumnos
    } catch (error) {
        console.error('Error al obtener el total de alumnos:', error);
        throw error; // Lanza el error para manejarlo en el componente que lo utiliza
    }
}

export async function buscarAlumnoPorCodigo(codigoAlumno) {
    try {
        const response = await axios.get(`${API_BUSCAR_ALUMNOS}/`, {
            params: {
                codigo: codigoAlumno, // Parámetro de búsqueda
            },
        });

        // Verifica si la respuesta contiene datos válidos
        if (!response.data || response.data.length === 0) {
            throw new Error('No se encontró un alumno con el código proporcionado');
        }

        return response.data[0]; // Devuelve el primer resultado encontrado
    } catch (error) {
        console.error('Error al buscar el alumno por código:', error);
        throw error; // Lanza el error para manejarlo en el componente que lo utiliza
    }
}