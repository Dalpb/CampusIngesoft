import { ControllerGestionRetirosDirector } from "../../components/Controllers/ControllerGestionRetirosDirector";
import { GrillaGestionRetirosDirector } from "../../components/grilla/GrillaGestionRetirosDirector";
import { useAuth } from "../../context/AuthContext";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"; // Para obtener el periodo
import { getRetiros } from '../../services/coursesServices';
import { trayectoryByStudent } from "../../services/studentServices";
import { coursesByStudent } from "../../services/studentServices";
import { Button } from '../../components/Button/Button';
import { motion, AnimatePresence } from "framer-motion";
import { TitleLayout } from "../../components/Layout/Layout";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";

export function GestionRetiros() {
    const { idPeriodo } = useParams(); // Obtener el periodo desde la URL
    const { userInformation } = useAuth();
    const [solicitudes, setSolicitudes] = useState([]);
    const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal de motivo
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    // Modal de alumno
    const [isModalAlumnoOpen, setIsModalAlumnoOpen] = useState(false);
    const [alumnoData, setAlumnoData] = useState(null);

    console.log("id: ", idPeriodo);
    // Función para abrir el modal del alumno
    const openModalAlumno = async (idAlumno) => {
      try {
        const alumno = await trayectoryByStudent(idAlumno); // Información del alumno
        const cursos = await coursesByStudent(idAlumno, idPeriodo); // Cursos en el ciclo seleccionado

        // Filtrar cursos no retirados y calcular totales
        const cursosMatriculados = cursos.filter(
          (curso) => !curso.retiroHorarios?.estadoRetiro
        );
        const creditosTotales = cursosMatriculados.reduce(
          (acc, curso) => acc + curso.curso.creditos,
          0
        );

        setAlumnoData({
          ...alumno,
          totalCursos: cursosMatriculados.length,
          totalCreditos: creditosTotales,
        });
        setIsModalAlumnoOpen(true);
      } catch (error) {
        console.error("Error al obtener la información del alumno:", error);
      }
    };

    // Función para cerrar el modal del alumno
    const closeModalAlumno = () => {
      setIsModalAlumnoOpen(false);
      setAlumnoData(null);
    };
  
    const openModal = (content) => {
      setModalContent(content);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setModalContent('');
    };
  
    // Obtener las solicitudes
    useEffect(() => {
      const fetchSolicitudes = async () => {
        try {
          const data = await getRetiros();
          
          // Filtrar solicitudes por el periodo actual (idPeriodo)
          const solicitudesFiltradas = data.filter(
            (solicitud) => solicitud.idAlumnoXHorario.periodo.id.toString() === idPeriodo
          );
          
          setFilteredSolicitudes(solicitudesFiltradas); // Inicialmente no hay filtros aplicados
          setSolicitudes(solicitudesFiltradas);
        } catch (error) {
          console.error('Error al obtener las solicitudes de retiro', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSolicitudes();
    }, [idPeriodo]);
  
    // Manejar el filtrado
    const handleFiltrar = ({ curso, alumno }) => {
      let filtradas = [...solicitudes];

      // Filtrar por curso (nombre o clave)
      if (curso) {
        filtradas = filtradas.filter((solicitud) => {
          const nombreCurso = solicitud.idAlumnoXHorario.horario.curso.nombre.toLowerCase();
          const claveCurso = solicitud.idAlumnoXHorario.horario.curso.clave.toLowerCase();
          return nombreCurso.includes(curso.toLowerCase()) || claveCurso.includes(curso.toLowerCase());
        });
      }

      // Filtrar por alumno (nombre o código)
    if (alumno) {
      filtradas = filtradas.filter((solicitud) => {
        const nombreCompletoAlumno = `${solicitud.idAlumnoXHorario.alumno.nombre} ${solicitud.idAlumnoXHorario.alumno.primerApellido} ${solicitud.idAlumnoXHorario.alumno.segundoApellido}`.toLowerCase();
        const codigoAlumno = solicitud.idAlumnoXHorario.alumno.codigo.toLowerCase();
        return nombreCompletoAlumno.includes(alumno.toLowerCase()) || codigoAlumno.includes(alumno.toLowerCase());
      });
    }

      setFilteredSolicitudes(filtradas);
    };
  
    const handleCleanFilters = () => {
      setFilteredSolicitudes(solicitudes);
    };

    if (!userInformation) {
      return <div>Cargando datos del usuario...</div>;
    }
  
    return (
      <AnimatedContainer>
        <div className="md:px-16 px-2 py-4 flex flex-col gap-6">          
          <TitleLayout title="Gestión de Solicitudes de Retiro"/>
    
          {/* Controlador de filtros */}
          <ControllerGestionRetirosDirector
            onFiltrar={handleFiltrar}
            onCleanFilters={handleCleanFilters} // Se incluye para limpiar filtros
          />
    
          {/* Grilla de solicitudes */}
          <GrillaGestionRetirosDirector
            solicitudes={filteredSolicitudes}
            isLoading={isLoading}
            openModal={openModal} // Pasar la función al hijo para mostrar el modal de motivo
            openModalAlumno={openModalAlumno} // Pasar la función al hijo para mostrar detalles del alumno
          />
    
          {/* Modal para el motivo */}
          <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />

          {/* Modal del Alumno */}
          <ModalAlumno
            isOpen={isModalAlumnoOpen}
            onClose={closeModalAlumno}
            alumnoData={alumnoData}
          />
        </div>
      </AnimatedContainer>
    );
  }
  
  // Modal para mostrar el motivo
  export function Modal({ isOpen, onClose, content }) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900 text-center">Motivo</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-sm leading-relaxed text-justify">{content}</p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-center">
                <Button
                  txt="Cerrar"
                  action={onClose}
                  type="button"
                  extraClasses="ml-3 hover:bg-blue-600 text-white"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  export function ModalAlumno({ isOpen, onClose, alumnoData }) {
    if (!isOpen || !alumnoData) return null;
  
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Título con línea divisoria */}
              <div className="flex items-center justify-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900 text-center">
                  Información del Alumno
                </h2>
              </div>
  
              {/* Contenido del modal */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-y-4">
                  {/* Primera fila */}
                  <div>
                    <p className="font-bold">Nombre completo</p>
                    <p>{`${alumnoData.nombre} ${alumnoData.primerApellido} ${alumnoData.segundoApellido}`}</p>
                  </div>
                  <div>
                    <p className="font-bold">Código de alumno</p>
                    <p>{alumnoData.codigo}</p>
                  </div>
                  {/* Segunda fila */}
                  <div>
                    <p className="font-bold">Ciclo actual</p>
                    <p>{alumnoData.numeroSemestres}</p>
                  </div>
                  <div>
                    <p className="font-bold">Promedio ponderado acumulado</p>
                    <p>{alumnoData.factorDeDesempeno.toFixed(2)}</p>
                  </div>
                  {/* Tercera fila */}
                  <div>
                    <p className="font-bold">Total de cursos matriculados</p>
                    <p>{alumnoData.totalCursos}</p>
                  </div>
                  <div>
                    <p className="font-bold">Total de créditos matriculados</p>
                    <p>{alumnoData.totalCreditos}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-center">
                <Button
                  txt="Cerrar"
                  action={onClose}
                  type="button"
                  extraClasses="ml-3 hover:bg-blue-600 text-white"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  