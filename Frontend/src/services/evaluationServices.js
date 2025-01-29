import API_BASE from "./config";
import axios from "axios";
const API_CALIFICATION_STUNDETS = `${API_BASE}/calificacion/alumnosxhorario`;
const API_EDITAR_COMPETENCIAS = `${API_BASE}/calificacion/competencias`;
const API_SUBCOMPETENCIAS = `${API_BASE}/calificacion/subcomp_de_competencia`;

const API_CALIFICATION_RESULT_STUDENT = `${API_BASE}/calificacion/alumno`;

export const postCalificationSubcompetition = async(body) =>{
    try {
        const response = await axios.post(`${API_CALIFICATION_STUNDETS}/guardar/`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error al guardar las calificaciones de la subcompetencia`, error);
        throw error;
    }
}



export const updateCompetencia = async (competencia) =>{
    try{
        const response = await axios.put(`${API_EDITAR_COMPETENCIAS}/${competencia.id}/`, competencia, {
            headers: {
              'Content-Type': 'application/json'
            }
        });
        return response; 
    }
    catch(error){
        console.error("Error al actualizar la cantidad de la competencia:", error);
        throw error; 
    }
}


export const getSubcompetenciasXCompetencia = async (competenciaId) => {
    try {
        const response = await axios.get(`${API_SUBCOMPETENCIAS}/${competenciaId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener competencias del curso ${cursoId}`, error);
        throw error;
    }
};

export const getCompetitionResults = async (idAlumno,idPeriodo)=>{
    try{
        
        console.log(`${API_CALIFICATION_RESULT_STUDENT}/${idAlumno}/notas-competencias/?periodo_id=${idPeriodo}`)
        const response = await axios.get(`${API_CALIFICATION_RESULT_STUDENT}/${idAlumno}/notas-competencias/?periodo_id=${idPeriodo}`);
        return response.data;
    }
    catch(error){
        console.log(`Error al obtener los resultados de competencias del alumno id ${idAlumno}`);
        throw error;
    }
}