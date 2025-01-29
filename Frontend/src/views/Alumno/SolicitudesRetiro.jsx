import React, {useEffect, useState} from 'react';
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { getRetirosByStudent } from '../../services/studentServices';
import { EmptyState } from '../../components/grilla/grillaEmpty';
import { MoreEyeIcon } from '../../components/grilla/GridIcons';
import { Button } from '../../components/Button/Button';
import { Eye } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedContainer } from '../../components/Layout/AnimatedContainer';


export function SolicitudesRetiro() {
  const { userInformation } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]); // Estado para las solicitudes de retiro
  const [isLoading, setIsLoading] = useState(true); // Estado para indicar si se está cargando el grid
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  useEffect(() => {
    // Llamada a la funcion para obtener las solicitudes de retiro
    const fetchSolicitudes = async () => {
      try {
        const data = await getRetirosByStudent(userInformation.id);
        setSolicitudes(data);
        console.log("Solicitudes", data);
      } catch (error) {
        console.error("Error al obtener las solicitudes de retiro", error);
      }finally{
        setIsLoading(false); // Setea isLoading a false al finalizar la solicitud
      }
    };

    fetchSolicitudes();
  }, [userInformation.id]);

  if (!userInformation) {
    return <div>Cargando datos del usuario...</div>;
  }

  return (
    <AnimatedContainer className="max-w-6xl mt-4 mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="text-left mb-6">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
          Historial de solicitudes de Retiro
        </h2>
      </div>

      <div className="overflow-x-auto rounded-t-2xl shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-clrTableHead">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tl-lg">
                Periodo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                Curso
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                Motivo
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white tracking-wider">
                Estado de Solicitud
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white tracking-wider rounded-tr-lg">
                Estado del Retiro
              </th>
            </tr>
          </thead>

          {/*Validar mensaje en caso haya datos*/}
          {isLoading ? (
            <td colSpan="6" className="text-center text-gray-500 py-4">
              {/* Cargando solicitudes de retiro */}
            </td>
          ) : (
            <tbody className="bg-white divide-y divide-gray-200">
              {console.log("solicitudes RETIROOO: ", solicitudes)}
              {solicitudes.length > 0 ? (
                solicitudes.map((solicitud, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-900">
                      {solicitud.idAlumnoXHorario.periodo.periodo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                      {`${solicitud.idAlumnoXHorario.horario.curso.nombre} (${solicitud.idAlumnoXHorario.horario.curso.clave})`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                      <button
                        onClick={() => openModal(solicitud.justificacion)}
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:text-bgLoginOne transition"
                        aria-label="Ver motivo"
                      >
                      <Eye />
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-black-500">
                      <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        solicitud.estadoSolicitud && !solicitud.estadoRetiro
                          ? 'bg-green-100 text-green-800' // "Enviada" en verde
                          : 'bg-green-100 text-green-800' // "Atendida" en verde
                      }`}>
                        {solicitud.estadoSolicitud && !solicitud.estadoRetiro
                          ? 'Enviada'
                          : 'Atendida'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-black-500">
                      <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        solicitud.estadoSolicitud && !solicitud.estadoRetiro
                          ? 'bg-yellow-100 text-yellow-800' // "En proceso" en amarillo
                          : !solicitud.estadoSolicitud && !solicitud.estadoRetiro
                          ? 'bg-red-100 text-red-800'      // "Rechazado" en rojo
                          : solicitud.estadoRetiro
                          ? 'bg-green-100 text-green-800'  // "Aceptada" en verde
                          : ''
                      }`}>
                        {solicitud.estadoSolicitud && !solicitud.estadoRetiro
                          ? 'En proceso'
                          : !solicitud.estadoSolicitud && !solicitud.estadoRetiro
                          ? 'Rechazado'
                          : solicitud.estadoRetiro
                          ? 'Aceptada'
                          : ''}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <EmptyState
                      mainMessage="No hay solicitudes de retiro actualmente."
                      secondaryMessage="Cuando se generen solicitudes, aparecerán aquí."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          )}

        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
    </AnimatedContainer>
  );
}

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
