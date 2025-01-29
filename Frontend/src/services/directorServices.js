import axios from "axios";
import API_BASE from "./config";

const API_retirar_alumnos = `${API_BASE}/matricula/alumno-x-horario/retirar-alumno/`;
const API_aprobar_retiro = `${API_BASE}/matricula/alumno-x-horario/aprobar-retiro/`;
const API_rechazar_retiro = `${API_BASE}/matricula/alumno-x-horario/rechazar-retiro/`;
const API_retirar_directo = `${API_BASE}/matricula/alumnoporhorario/`;


export async function retirarAlumno(idAlumno, horarios) {
  try {
      const payload = {
          idAlumno,
          Horarios: horarios
      };
      console.log(`${API_retirar_alumnos}`, payload);
      const response = await axios.post(`${API_retirar_alumnos}`, payload);
      return response.data;
  } catch (error) {
      console.error("Error al retirar al alumno de los cursos seleccionados", error);
      throw error;
  }
}

export async function aprobarRetiro(idsRetiros) {
  try {
    const payload = {
      idRetiros: idsRetiros,
    };
    console.log(`${API_aprobar_retiro}`, payload);
    const response = await axios.post(`${API_aprobar_retiro}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error al aprobar la solicitud de retiro", error);
    throw error;
  }
}

export async function rechazarRetiro(idsRetiros) {
  try {
    const payload = {
      idRetiros: idsRetiros,
    };
    console.log(`${API_rechazar_retiro}`, payload);
    const response = await axios.post(`${API_rechazar_retiro}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error al rechazar la solicitud de retiro", error);
    throw error;
  }
}


export async function retirarDirecto(idsRetiros) {
  try{
    let r1 = await axios.get(`${API_retirar_directo}${idsRetiros}`)
    r1.data.retirado=true
    console.log(r1.data)
    const r2 = await axios.put(`${API_retirar_directo}${idsRetiros}/`, r1.data, {
        headers: {
          'Content-Type': 'application/json'
        }
    });
    return r2; 
} catch (error) {
    console.error("Error al rechazar la solicitud de retiro", error);
    throw error;
  }
}

