import axios from "axios";
import API_BASE from "./config";
const API_COURSE_STUDENT = `${API_BASE}/cursos/alumno`;
const API_PERIOD_STUDENT = `${API_BASE}/usuarios/periodos/alumno`;
const API_COURSES_STUDENT_NOTES =`${API_BASE}/calificacion/alumno`;
const API_POST_COURSES_SOL_RETIRO = `${API_BASE}/matricula/guardar_retiros/`;
const API_STUDENT_TRAYECTORY = `${API_BASE}/usuarios/alumnos`;
const API_STUDENT_TRAYECTORY_TRAYECTORY = `${API_BASE}/usuarios/trayectoria_academica`;
const API_CURSOS_PERMITIDOS = `${API_BASE}/usuarios/alumno`;
const API_CICLO_ACTUAL = `${API_BASE}/cursos/periodo_actual`;
const API_GET_SOL_RETIRO_ALUM = `${API_BASE}/matricula/retiros_alumno`;
const API_GET_COUNT_ALUM = `${API_BASE}/usuarios/alumno/count`;
const API_GET_COUNT_PROF = `${API_BASE}/usuarios/profesor/count`;
// API MATIAS
const API_STUDENTS = `${API_BASE}/usuarios/alumnos`;

export async function coursesByStudent(idAlumno,periodo) {
    try{
        const response = await axios.get(`${API_COURSE_STUDENT}/${idAlumno}/cursos/?periodo_id=${periodo}`);
        return response.data;
    }catch(error){
        console.error(`Error en obtener cursos para el del alumno ${idAlumno}`);
        throw error;
    }
}

export async function periodByStudent(idAlumno) {
    try{
        const response = await axios.get(`${API_PERIOD_STUDENT}/${idAlumno}`);
        return response.data;
    }catch(error){
        console.error(`Error en obtener periodos para el del alumno ${idAlumno}`);
        throw error;
    }
}
export async function trayectoryByStudent(idAlumno) {
    try{
        const response = await axios.get(`${API_STUDENT_TRAYECTORY_TRAYECTORY}/${idAlumno}`);
        console.log("valor: ", `${API_STUDENT_TRAYECTORY_TRAYECTORY}/${idAlumno}`);
        return response.data;
    }catch(error){
        console.error(`Error en obtener periodos para el del alumno ${idAlumno}`);
        throw error;
    }
}

export async function notesCoursesByStudent(idAlumno,periodo) {
    try{
        console.log(`${API_COURSES_STUDENT_NOTES}/${idAlumno}/notas/?periodo_id=${periodo}`)
        const response = await axios.get(`${API_COURSES_STUDENT_NOTES}/${idAlumno}/notas/?periodo_id=${periodo}`);
        return response.data;
    }catch(error){
        console.error(`Error en obtener periodos para el del alumno ${idAlumno}`);
        throw error;
    }
}

export async function enviarSolicitudRetiro(justificacion, listaCursos) {
    try {
        console.log("Datos enviados a la API:", {
            justificacion,
            lista_cursos: listaCursos
        });
        
        const response = await axios.post(API_POST_COURSES_SOL_RETIRO, {
            justificacion,
            lista_cursos: listaCursos
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error en la solicitud de retiro de cursos", error);
        throw error;
    }
}

export async function getRetirosByStudent(idAlumno) {
    try {
        const response = await axios.get(`${API_GET_SOL_RETIRO_ALUM}/alumno/${idAlumno}/`);
        return response.data;
    } catch (error) {
        console.error(`Error en obtener las solicitudes de retiro para el alumno ${idAlumno}`, error);
        throw error;
    }
}

export async function getCursosPermitidos(idAlumno) {
    try{
        const response = await axios.get(`${API_CURSOS_PERMITIDOS}/${idAlumno}/cursos_permitidos/`);
        return response.data;
    }catch(error){
        console.error(`Error en obtener cursos permitidos para el del alumno ${idAlumno}`);
        throw error;
    }
}

export async function getCicloActual() {
    try{
        const response = await axios.get(`${API_CICLO_ACTUAL}`);
        return response.data;
    }catch(error){
        console.error(`Error en obtener ciclo actual`);
        throw error;
    }
}

export async function getAlumCount() {
    try{
        const response = await axios.get(`${API_GET_COUNT_ALUM}`);
        return response.data;
    }catch(error){
        console.error(`Error en obtener conteo de los alumnos actual`);
        throw error;
    }
}

export async function getProfCount() {
    try{
        const response = await axios.get(`${API_GET_COUNT_PROF}`);
        return response.data;
    }catch(error){
        console.error(`Error en obtener conteo de los profesores actual`);
        throw error;
    }
}

/*soy matias*/ 
export async function getStudentCount() {
    try {
        const response = await axios.get(API_GET_COUNT_ALUM);
        // Verifica que la respuesta tenga datos en el formato esperado
        /*
        if (Array.isArray(response.data)) {
            return response.data.length; // Devuelve el número de estudiantes
        } else {
            throw new Error("La respuesta no tiene el formato esperado.");
        }*/
       return response.data.count;
    } catch (error) {
        console.error("Error en obtener la cantidad de estudiantes", error);
        throw error;
    }
}

export async function getStudentFactorDesempeno(id) {
    try{
        const response = await axios.get(`${API_STUDENTS}/${id}`);
        return response.data.factorDeDesempeno;
    }catch(error){
        console.error(`Error en obtener conteo de los profesores actual`);
        throw error;
    }
}