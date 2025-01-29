import API_BASE from "./config";
import axios from "axios";
const API_MATRICULA =  `${API_BASE}/matricula`;
const API_GUARDAR_LINEASINSCRIPCION = `${API_BASE}/matricula/guardar_lineas_de_inscripcion/`;
const API_CURSOS = `${API_BASE}/cursos`;

const API_MATRICULAR_ALUMNO = `${API_BASE}/matricula/matriculaGestor/`;

export async function postMatricularAlumnoExtemporanea(alumno_id, horario_id) {
  console.log("Datos enviados:", { alumno_id, horario_id });
  try {
    const response = await axios.post(
      API_MATRICULAR_ALUMNO,
      { alumno_id, horario_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Devuelve la respuesta del servidor
    return response.data;
  } catch (error) {
    console.error("Error al matricular alumno ext", error);
    throw error.response?.data || "Hubo un problema al realizar la matrícula.";
  }
}

export const putActualizarEstadoRetirado = async (idAlumnoPorHorario, estadoRetirado) => {
  try {
    const url = `${API_MATRICULA}/alumnoporhorario/${idAlumnoPorHorario}/`;

    // Obtener los datos existentes
    const existingDataResponse = await axios.get(url);
    const existingData = existingDataResponse.data;

    console.log("Datos actuales del alumno:", existingData);

    // Crear un nuevo objeto con los campos actualizados
    const updatedData = {
      ...existingData, // Mantener todos los campos existentes
      retirado: estadoRetirado, // Actualizar solo el campo necesario
    };

    // Realizar el PUT con todos los datos
    const response = await axios.put(url, updatedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Datos actualizados exitosamente:", response.data);

    return response.data; // Retornar la respuesta del servidor
  } catch (error) {
    console.error("Error al actualizar el estado retirado del alumno", error);
    throw error;
  }
};

export const getInscripciones = async (idAlumno,idperiodo) => {
  try {
    const response  = await axios.get(`${API_MATRICULA}/inscripcionMostrar/${idAlumno}/?id_periodo=${idperiodo}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las inscripciones",error);
    throw error;
  }
}

export async function postLineasInscripcion(idAlumno, listaHorarios) {
  try {
    // Formatear los horarios correctamente como { idHorario: valor }
    const lineas = listaHorarios;

    console.log("Datos enviados a la API:", {
      idAlumno,
      lineas, 
    });

    // Hacer el POST con el formato correcto
    const response = await axios.post(API_GUARDAR_LINEASINSCRIPCION, {
      idAlumno,
      lineas,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; 
  } catch (error) {
    console.error("Error al guardar líneas de inscripción", error);
    throw error;
  }
}


export const postRetirarseCurso = async (idAlumno,idLineaInscripcion) =>{
  try{
    console.log ("retiro de",idAlumno,idLineaInscripcion)
    const response = await axios.post(`${API_MATRICULA}/eliminar_lineas_de_inscripcion/`,
      {
        'idAlumno': idAlumno,
        'lineas':[{"idLinea":idLineaInscripcion}]
      },
      {headers:{'Content-Type':'application/json'}});
    return response.status;
  }catch(error){
    console.log("Error al desinscribirse del curso");
    throw error;
  }
}

// export const getCursosyHorarios = async (page) => {
//   try {
//       const response = await axios.get(`${API_CURSOS}/cursos_gestor/?page=${page}`);
//       return response.data;
//   } catch (error) {
//       console.log("Error al obtener los cursos");
//       throw error;
//   }
// };

export const getCursosyHorarios = async ({ page = 1, clave = '', nombre = '', nivel = '' }) => {
  try {
    // Construir los parámetros opcionales para la URL
    const params = new URLSearchParams({
      page, // Página actual, siempre incluida
      ...(clave && { clave }), // Agregar clave si existe
      ...(nombre && { nombre }), // Agregar nombre si existe
      ...(nivel && { nivel }), // Agregar nivel si existe
    });

    // Construir la URL completa
    const url = `${API_CURSOS}/cursos_gestor/?${params.toString()}`;
    console.log(`Fetching from: ${url}`);

    // Realizar la solicitud HTTP
    const response = await axios.get(url);

    // Devolver los datos de la respuesta
    return response.data; // Esto incluye count, next, previous y results
  } catch (error) {
    console.error("Error al obtener los cursos y horarios", error);
    throw error;
  }
};


export const getUltimoPeriodo = async() =>{
  try{
    const response = await axios.get(`${API_CURSOS}/periodo_actual`);
    return response.data;
  } catch(error){
    console.log("Error al obtener el ultimo ciclo");
    throw error;
  }
}

export const getInformacionCampus = async() =>{
  try{
    const response = await axios.get(`${API_MATRICULA}/informacionCampus`);
    return response.data;
  }
  catch(error){
    console.log("Error en obtener infromación de campus");
    throw error;
  }
}
export const getEstadoMatricula = async () =>{
  try{
    const response = await axios.get(`${API_MATRICULA}/verEstado`);
    return response.data;
  }
  catch(error){
    console.log("Error al obtener estado matriucla");
    throw error;
  }
}