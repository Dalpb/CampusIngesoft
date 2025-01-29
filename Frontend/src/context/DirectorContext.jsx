import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAlumCount, getStudentCount } from '../services/studentServices';
import { getTeacherCount } from '../services/coursesServices';
import { getCursosYHorarios } from '../services/coursesServices';
import { useAuth } from './AuthContext';
import { getCountHorarios } from '../services/coursesServices';
import { getCursosyHorarios } from '../services/matricula.service';

// Crear el contexto
const MatriculaContext = createContext();

export const MatriculaDirectorProvider = ({ children }) => {
  const [cursos, setCursos] = useState([]);
  const [totalCursos, setTotalCursos] = useState(0);
  const [totalHorarios, setTotalHorarios] = useState(0);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [totalProfesores, setTotalProfesores] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [totalPages,setTotalPages] = useState(0);
  const itemsPerPage = 20; // Cantidad de cursos por página


  const fetchData = async (page) => {
    try {
      setLoading(true);
      const data = await getCursosYHorarios(page);
      console.log("data: ", data);
      console.log("cantidad data: ", data.length);
      
      setTotalCursos(data.length);
      
      // Obtener el total de horarios usando el nuevo servicio
      const totalHorariosResponse = await getCountHorarios();
      setTotalHorarios(totalHorariosResponse.cantidad_horarios_activos);
      console.log("Cantidad total de horarios: ", totalHorariosResponse.cantidad_horarios_activos);

      // Obtener totales de alumnos y profesores
      const alumnos = await getAlumCount();
      setTotalAlumnos(alumnos.count);

      const profesores = await getTeacherCount();
      await consultarCursos(1)
      setTotalProfesores(profesores);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const consultarCursos = async (page = 1,clave = "",nombre = "",nivel = "") => {
    try{
      const cursosConsultados = await getCursosyHorarios({page,clave,nombre,nivel});
      setCursos(cursosConsultados.results);
      console.log("cursos consultados",cursosConsultados);
      setTotalPages(Math.ceil(cursosConsultados.count / 20));
    }
    catch(error){
      console.log("Error en la consultado de datos filtrados");
    }
  }


  useEffect(() => {
    fetchData(currentPage);
  }, []);



  const value = {
    cursos,
    totalCursos,
    totalHorarios,
    totalAlumnos,
    totalProfesores,
    loading,
    itemsPerPage,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchData,
    consultarCursos
  };

  return (
    <MatriculaContext.Provider value={value}>
      {children}
    </MatriculaContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useMatriculaDirector = () => {
  return useContext(MatriculaContext);
};
