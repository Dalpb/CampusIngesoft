import axios from "axios";
import API_BASE from "./config";

const API_COURSE_TEACHER = `${API_BASE}/cursos/cursos_profesor`;
const API_COURSES_LIST = `${API_BASE}/cursos/cursos`;
const API_PERIOD = `${API_BASE}/cursos/periodo`;
const API_NOTAS = `${API_BASE}/calificacion/guardarnotashorario/`; 
const API_NOTAS_DISPOIBLES = `${API_BASE}/cursos/evaluaciones_horario/horario`;
const API_STUDENST_LIST =   `${API_BASE}/matricula/alumnos_horario/horario`;
const API_CALIFICACION = `${API_BASE}/calificacion`;
const API_GET_NOTAS = `${API_BASE}/calificacion/vernotashorario`;
const API_COMPETENCIAS = `${API_BASE}/cursos/cursos`;
const API_HORARIOS_LIST = `${API_BASE}/cursos/horarios`;
const API_GET_SOL_RETIROS = `${API_BASE}/matricula/retiros_alumno`;
const API_CALIFICACION_COM_HOR_PROF = `${API_BASE}/calificacion/competenciasxhorarioxprof`;
const API_STUDENST_NOTES_LIST = `${API_BASE}/calificacion/vernotashorario`;
const API_POST_STUDENTS_NOTES_LIST =`${API_BASE}/calificacion/guardarnotashorario/`;
const API_CALIFICATION_STUNDETS = `${API_BASE}/calificacion/alumnosxhorario`;
const API_SUBCOMPETENCIAS = `${API_BASE}/calificacion/vercalificacioncompetencias/alumnos`

const API_GET_PROFESORES = `${API_BASE}/usuarios/profesores`;
const API_CURSOS_TOTALES = `${API_BASE}/cursos/cursos_gestor/`;
const API_COUNT_HORARIOS = `${API_BASE}/cursos/contar_horarios/`;
const API_COUNT_CURSOS = `${API_BASE}/cursos/totalCursos`;

export async function getNotesByEvaluation (horarioId, tipoDeNota, indice,periodoId) {
    try {
        // Construcción de la URL con el orden correcto de los parámetros
        const url = `${API_GET_NOTAS}/?tipoDeNota=${tipoDeNota}&indice=${indice}&horario_id=${horarioId}&periodo_id=${periodoId}`;
        console.log(`URL solicitada: ${url}`); // Para depuración, verifica la URL generada
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener notas para el horario ${horarioId}, tipo de nota ${tipoDeNota}, e índice ${indice}`, error);
        throw error;
    }
};

export async function coursesByTeacher(teacherId,cicle = null) {
    try{
        const url = cicle !== null
            ? `${API_COURSE_TEACHER}/profesor/${teacherId}?periodo_academico_id=${cicle}`
            : `${API_COURSE_TEACHER}/profesor/${teacherId}`;
        const response = await axios.get(url);
        return response.data;
    }catch(error){
        console.error(`Error en obtener cursos para el profesor ${teacherId}`, error);
        throw error;
    }
}
export async function getPeriodCourses(){
    try{
        const response = await axios.get(`${API_PERIOD}/`);
        return response.data;
    }
    catch(error){
        console.error(`No fue posible obtener los periodos`);
        throw error;
    }
}


export const getEvaluationsByCourse = async (courseCode) => {
    try {
        const response = await axios.get(`${API_NOTAS}/cursos/${courseCode}/evaluaciones/`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener evaluaciones del curso ${courseCode}`, error);
        throw error;
    }
};

export const getNotesList = async (id) => {
    try {
        console.log(`${API_NOTAS_DISPOIBLES}/${id}`)
        const response = await axios.get(`${API_NOTAS_DISPOIBLES}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener evaluaciones del curso ${id}`, error);
        throw error;
    }
};

export const getStudentsList = async (horarioId,periodoId) => {
    try {
        console.log(`${API_STUDENST_LIST}/${horarioId}?periodo=${periodoId}`)
        const response = await axios.get(`${API_STUDENST_LIST}/${horarioId}?periodo=${periodoId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener evaluaciones del curso ${horarioId}`, error);
        throw error;
    }
};

export const getCompetitionSheduleTeacher = async(idSchedule,idTeacher) =>{
    try{
        // const response = await axios.get(`${API_CALIFICACION_COM_HOR_PROF}/competencias/?idprofesor=${idTeacher}&idhorario=${idSchedule}`)
        const response = await axios.get(`${API_CALIFICACION_COM_HOR_PROF}/competencias/?idhorario=${idSchedule}&idprofesor=${idTeacher}`);
        return response.data;
    }catch(error){
        console.error(`No fue posible obtener las competencias de este horario ${idSchedule}`);
        throw error;
    }
} 
export const updatEvaluationQuantity = async (idCompetition,idSchedule,quantity) =>{
    try{
        const response = await axios.post(`${API_CALIFICACION_COM_HOR_PROF}/actualizar-cantidad/`,
            {
             'horarioxcomp' : idCompetition,
             'cantidad': quantity},
             {headers:{'Content-Type':'application/json'}} );
        return response.data;
    }
    catch(error){
        console.error("Error al actualizar la cantidad de evaluaciones:", error);
        throw error; 
    }
}


export const getStudentsNotesXCourseList = async (tipoDeNota,indice,horario_id,periodo) => {
    try {
        console.log(`${API_STUDENST_NOTES_LIST}/?tipoDeNota=${tipoDeNota}&indice=${indice}&horario_id=${horario_id}&periodo_id=${periodo}`)
        const response = await axios.get(`${API_STUDENST_NOTES_LIST}/?tipoDeNota=${tipoDeNota}&indice=${indice}&horario_id=${horario_id}&periodo_id=${periodo}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener evaluaciones del curso ${id}`, error);
        throw error;
    }
};

export const postStudentsNotesXCourseList = async (body) => {
    try {
        // Realizar la solicitud POST enviando el cuerpo (body) como JSON
        const response = await axios.post(`${API_POST_STUDENTS_NOTES_LIST}`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        return response.data;
    } catch (error) {
        console.error(`Error al guardar las notas del curso`, error);
        throw error;
    }
};

export const getCompetitionNotes = async (idHorario,idCom,index,idPeriodo) => {
    try{
        const response = await axios.get(`${API_SUBCOMPETENCIAS}/?idhorario=${idHorario}&idcompetencia=${idCom}&indice=${index}&periodo=${idPeriodo}`);
        return response.data;
    }
    catch (error) {
        console.error(`Error  al Obtener las notas de las competencias`, error);
        throw error;
    }
}

export const getCourses = async ({ page = 1, clave = '', nombre = '', nivel = '' }) => {
    try {
        // Construir la URL con los parámetros opcionales
        const params = new URLSearchParams({
            page, // Siempre incluir la página
            ...(clave && { clave }),
            ...(nombre && { nombre }),
            ...(nivel && { nivel }),
        });

        const url = `${API_COURSES_LIST}/?${params.toString()}`;
        console.log(`Fetching from: ${url}`);

        const response = await axios.get(url);
        return response.data; // Esto incluye count, next, previous y results
    } catch (error) {
        console.error(`Error al obtener los cursos`, error);
        throw error;
    }
};

export const getCompetenciasXCurso = async (cursoId) => {
    try {
        const response = await axios.get(`${API_COMPETENCIAS}/${cursoId}/competencias/`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener competencias del curso ${cursoId}`, error);
        throw error;
    }
};

export async function getRetiros() {
    try {
        const response = await axios.get(`${API_GET_SOL_RETIROS}`);
        return response.data;
    } catch (error) {
        console.error(`Error en obtener las solicitudes de retiro`, error);
        throw error;
    }
}

export async function getHorariosXCurso(courseId) {
    try {
        // Construcción de la URL para obtener los horarios de un curso
        const url = `${API_COURSES_LIST}/${courseId}/horarios/`;
        console.log(`URL solicitada: ${url}`); // Para depuración, verifica la URL generada

        // Realiza la solicitud GET
        const response = await axios.get(url);
        // Devuelve los datos de la respuesta
        return response.data;
    } catch (error) {
        // Manejo de errores
        console.error(`Error al obtener los horarios del curso ${courseId}`, error);
        throw error;
    }
}

export async function getHorarios() {
    try {
        const response = await axios.get(`${API_HORARIOS_LIST}`);
        return response.data; // Esto incluye count, next, previous y results
    } catch (error) {
        console.error(`Error al obtener los horarios`, error);
        throw error;
    }
}


export async function getTeacherCount () {
    try {
        const response = await axios.get(API_GET_PROFESORES);
        if (Array.isArray(response.data)) {
            return response.data.length; // Retorna la cantidad de profesores
        } else {
            throw new Error("La respuesta no tiene el formato esperado.");
        }
    } catch (error) {
        console.error("Error al obtener la cantidad de profesores", error);
        throw error;
    }
};

export async function getCursosYHorarios() {
    try {
        let cursos = [];
        let nextPage = API_CURSOS_TOTALES; // Primera página

        // Paginar y recopilar todos los horarios
        while (nextPage) {
            const response = await axios.get(nextPage);
            const data = response.data;

            if (data.results) {
                cursos = [...cursos, ...data.results]; // Agrega cursos únicos
            }

            nextPage = data.next; // Página siguiente
        }
        console.log(cursos.length);
        return cursos; // Retorna todos los horarios
    } catch (error) {
        console.error("Error al obtener los horarios:", error);
        throw error;
    }
};

export async function getCountHorarios() {
    try {
        // Solicitud GET al nuevo endpoint
        const response = await axios.get(API_COUNT_HORARIOS);
        return response.data;  // Devolver los datos obtenidos de la respuesta
    } catch (error) {
        console.error("Error al contar los horarios", error);
        throw error;
    }
}


export async function getCountCursos() {
    try {
        // Solicitud GET al nuevo endpoint
        const response = await axios.get(API_COUNT_CURSOS);
        return response.data;  // Devolver los datos obtenidos de la respuesta
    } catch (error) {
        console.error("Error al contar los horarios", error);
        throw error;
    }
}


