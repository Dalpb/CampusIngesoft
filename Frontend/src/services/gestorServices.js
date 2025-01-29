import axios from "axios";
import API_BASE from "./config";
const API_horarios_periodo = `${API_BASE}/cursos/horarios_por_periodo`; 
const API_periodos = `${API_BASE}/cursos/periodo/`; 
const API_ALL_STUDENTS = `${API_BASE}/usuarios/alumnos/`; 
const API_ALL_HORARIOS = `${API_BASE}/cursos/horarios/`; 
const API_ALL_TEACHERS = `${API_BASE}/usuarios/profesores/`; 
const API_APERTURA_PREMATRICULA = `${API_BASE}/matricula/cambiar_campus/matricula/`; 
const API_CIERRE_PREMATRICULA = `${API_BASE}/matricula/cambiar_campus/publicacion_matricula/`; 
const API_APERTURA_EXTEMPORANEA = `${API_BASE}/matricula/cambiar_campus/matricula_extemp/`; 
const API_CIERRE_EXTEMPORANEA = `${API_BASE}/matricula/cambiar_campus/publicacion_extemp/`; 
const API_APERTURA_CICLO = `${API_BASE}/matricula/cambiar_campus/ciclo_lectivo/`; 
const API_CIERRE_CICLO = `${API_BASE}/matricula/cambiar_campus/fin_de_ciclo/`; 


export async function getHorariosPeriodo(idhorario) {
    try{
        console.log(`${API_horarios_periodo}/${idhorario}`)
        const response = await axios.get(`${API_horarios_periodo}/${idhorario}`);// aca debe ir el idhorario
        return response.data;      
    }
    catch(error){
        console.error(`Error al obtener evaluaciones del curso ${courseCode}`, error);
        throw error;
    }
}
export async function getPeriodos() {
    try{
        console.log(`${API_periodos}`)
        const response = await axios.get(`${API_periodos}`);// aca debe ir el idhorario
        return response.data;      
    }
    catch(error){
        console.error(`Error al obtener evaluaciones del curso ${courseCode}`, error);
        throw error;
    }
}

export async function getAllStudents() {
    try{
        console.log(`${API_ALL_STUDENTS}`)
        const response = await axios.get(`${API_ALL_STUDENTS}`);// aca debe ir el idhorario
        return response.data;      
    }
    catch(error){
        console.error(`Error al obtener evaluaciones del curso ${courseCode}`, error);
        throw error;
    }
}

export async function getAllHorarios() {
    try{
        console.log(`${API_ALL_HORARIOS}`)
        const response = await axios.get(`${API_ALL_HORARIOS}`);// aca debe ir el idhorario
        return response.data;      
    }
    catch(error){
        console.error(`Error al obtener horarios`, error);
        throw error;
    }
}

export async function getHorario(idHorario) {
    try{
        console.log(`${API_ALL_HORARIOS}`)
        const response = await axios.get(`${API_ALL_HORARIOS}/${idHorario}`);// aca debe ir el idhorario
        return response.data;      
    }
    catch(error){
        console.error(`Error al obtener horario ${idHorario}`, error);
        throw error;
    }
}

export async function getAllTeachers() {
    try{
        console.log(`${API_ALL_TEACHERS}`)
        const response = await axios.get(`${API_ALL_TEACHERS}`);// aca debe ir el idhorario
        return response.data;      
    }
    catch(error){
        console.error(`Error al obtener evaluaciones del curso ${courseCode}`, error);
        throw error;
    }
}



export async function getAbrirPrematricula() {
    try{
        console.log(`${API_APERTURA_PREMATRICULA}`)
        const response = await axios.get(`${API_APERTURA_PREMATRICULA}`);
        return response.data;      
    }
    catch(error){
        console.error(`Error apertura prematricula`, error);
        throw error;
    }
}

export async function getCerrarPrematricula() {
    try{
        console.log(`${API_CIERRE_PREMATRICULA}`)
        const response = await axios.get(`${API_CIERRE_PREMATRICULA}`);
        return response.data;      
    }
    catch(error){
        console.error(`Error al cerrar prematricula`, error);
        throw error;
    }
}

export async function getAbrirExtemporanea() {
    try{
        console.log(`${API_APERTURA_EXTEMPORANEA}`)
        const response = await axios.get(`${API_APERTURA_EXTEMPORANEA}`);
        return response.data;      
    }
    catch(error){
        console.error(`Error apertura extemporanea`, error);
        throw error;
    }
}

export async function getCerrarExtemporanea() {
    try{
        console.log(`${API_CIERRE_EXTEMPORANEA}`)
        const response = await axios.get(`${API_CIERRE_EXTEMPORANEA}`);
        return response.data;      
    }
    catch(error){
        console.error(`Error al cerrar extemporanea`, error);
        throw error;
    }
}

export async function getIniciarCiclo() {
    try{
        console.log(`${API_APERTURA_CICLO}`)
        const response = await axios.get(`${API_APERTURA_CICLO}`);
        return response.data;      
    }
    catch(error){
        console.error(`Error al iniciar ciclo`, error);
        throw error;
    }
}

export async function getCerrarCiclo() {
    try{
        console.log(`${API_CIERRE_CICLO}`)
        const response = await axios.get(`${API_CIERRE_CICLO}`);
        return response.data;      
    }
    catch(error){
        console.error(`Error al cerrar ciclo`, error);
        throw error;
    }
}

export const patchActualizarVacantes = async (clave, vacantes) => {
    try {
        const response = await axios.patch(`${API_ALL_HORARIOS}${clave}/`, {
            numVacantes: vacantes
        });
        console.log("Horario updated:", response.data);
    } catch (error) {
        console.error("Error updating horario:", error.response.data);
    }
};

export const patchDeshabilitarHorario = async (clave) => {
    try {
        const response = await axios.patch(`${API_ALL_HORARIOS}${clave}/`, {
            activo: false
        });
        console.log("Horario updated:", response.data);
    } catch (error) {
        console.error("Error updating horario:", error.response.data);
    }
};