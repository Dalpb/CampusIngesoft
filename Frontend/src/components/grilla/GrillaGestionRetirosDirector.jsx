import React, {useState} from "react";
import { MoreEyeIcon, CloseIcon, CheckIcon } from "./GridIcons";
import { EmptyState } from "./grillaEmpty";
import { Eye } from 'lucide-react'
import { retirarAlumno } from "../../services/directorServices";
import { PopupConfirm } from "../Pop-up/Question/PopupConfirm";
import PopupSuccess from "../Pop-up/Response/SucessPopUp";
import { aprobarRetiro, rechazarRetiro } from "../../services/directorServices";
import { LoadingLayout } from "../Layout/Layout";

export function GrillaGestionRetirosDirector({ solicitudes, isLoading, openModal, openModalAlumno }) {
  const [confirmingSolicitud, setConfirmingSolicitud] = useState(null);
  const [popupAction, setPopupAction] = useState(null); // Guarda la acción a realizar en el popup
  const [popupText, setPopupText] = useState(""); // Texto dinámico del popup
  const [successPopupOpen, setSuccessPopupOpen] = useState(false); // Controla el popup de éxito

  const handleAprobar = async (solicitud) => {
    try {
      await aprobarRetiro([solicitud.id]);

      // Actualiza el estado a "Aceptado" dinámicamente en la grilla
      solicitud.estadoRetiro = true;
      solicitud.estadoSolicitud = false;
      console.log("Se aprueba");
      // Mostrar el popup de éxito
      setSuccessPopupOpen(true);
    } catch (error) {
      console.error("Error al aprobar el retiro:", error);
      alert("Hubo un error al procesar la solicitud. Inténtelo nuevamente.");
    }
  };

  const handleRechazar = async (solicitud) => {
    try {
      await rechazarRetiro([solicitud.id]);

      // Actualiza el estado a "Rechazado" dinámicamente en la grilla
      solicitud.estadoRetiro = false;
      solicitud.estadoSolicitud = false;

      // Mostrar el popup de éxito
      setSuccessPopupOpen(true);
    } catch (error) {
      console.error("Error al rechazar el retiro:", error);
      alert("Hubo un error al procesar la solicitud. Inténtelo nuevamente.");
    }
  };

  const openConfirmPopup = (action, solicitud, text) => {
    console.log("Abriendo popup para solicitud:", solicitud, "Acción:", action, "Texto:", text);
    setPopupAction(() => action(solicitud));
    setPopupText(text);
    setConfirmingSolicitud(solicitud);
  };

  const closePopup = () => {
    setConfirmingSolicitud(null);
    setPopupAction(null);
    setPopupText("");
  };

  const handleSuccessContinue = () => {
    setSuccessPopupOpen(false); // Cierra el popup de éxito
  };

  return (
    <>
      {confirmingSolicitud && popupAction && (
        <>
          {console.log("Renderizando PopupConfirm con solicitud:", confirmingSolicitud)}
          <PopupConfirm
            text={popupText}
            onConfirm={() => {
              popupAction();
              closePopup();
            }}
            onCancel={closePopup}
          />
        </>
      )}

      {successPopupOpen && (
        <PopupSuccess
          isOpen={successPopupOpen}
          text="Operación realizada con éxito."
          onContinue={handleSuccessContinue}
        />
      )}

      <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto rounded-t-2xl shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-clrTableHead">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tl-lg">
                  Número
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                  Curso
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                  Motivo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                  Alumno
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white tracking-wider rounded-tr-lg">
                  Acciones
                </th>
              </tr>
            </thead>

            {isLoading ? (
              <tbody>
                <tr>
                  {/* <td colSpan="6" className="text-center text-gray-500 py-4">
                    Cargando solicitudes de retiro...
                  </td> */}
                </tr>
              </tbody>
            ) : (
              <tbody className="bg-white divide-y divide-gray-200">
                {solicitudes.length > 0 ? (
                  solicitudes.slice().reverse().map((solicitud, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-black-900">
                        {solicitud.id}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-black-500">
                        {`${solicitud.idAlumnoXHorario.horario.curso.nombre} (${solicitud.idAlumnoXHorario.horario.curso.clave})`}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-center text-black-500">
                        <button
                          onClick={() => openModal(solicitud.justificacion)}
                          className="flex items-center justify-center w-8 h-8 rounded-full hover:text-bgLoginOne transition-transform duration-200 hover:scale-110"
                          aria-label="Ver motivo"
                        >
                          <Eye />
                        </button>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-black-500">
                        <button
                          onClick={() => openModalAlumno(solicitud.idAlumnoXHorario.alumno.id)}
                          className="text-black-600 transition-transform duration-200 hover:scale-110 hover:text-bgLoginOne"
                        >
                          {solicitud.idAlumnoXHorario.alumno.codigo}
                        </button>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-center text-black-500">
                        <span
                          className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                            solicitud.estadoSolicitud && !solicitud.estadoRetiro
                              ? "bg-gray-100 text-gray-800" // "Pendiente" en gris
                              : solicitud.estadoSolicitud && solicitud.estadoRetiro
                              ? "bg-green-100 text-green-800" // "Aceptado" en verde
                              : !solicitud.estadoSolicitud && !solicitud.estadoRetiro
                              ? "bg-red-100 text-red-800" // "Rechazado" en rojo
                              : ""
                          }`}
                        >
                          {solicitud.estadoSolicitud && !solicitud.estadoRetiro
                            ? "Pendiente"
                            : solicitud.estadoSolicitud && solicitud.estadoRetiro
                            ? "Aceptado"
                            : !solicitud.estadoSolicitud && !solicitud.estadoRetiro
                            ? "Rechazado"
                            : ""}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-black-500 flex space-x-4 justify-center">
                        <div
                          onClick={() =>
                            solicitud.estadoSolicitud && !solicitud.estadoRetiro
                              ? openConfirmPopup(handleAprobar, solicitud, "¿Está seguro de aprobar el retiro?")
                              : null
                          }
                          className={`w-8 h-8 flex items-center justify-center ${
                            solicitud.estadoSolicitud && !solicitud.estadoRetiro
                              ? "bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          } rounded-full transition-transform duration-200 ${
                            solicitud.estadoSolicitud && !solicitud.estadoRetiro ? "hover:scale-110" : ""
                          }`}
                          aria-label="Aprobar"
                        >
                          <CheckIcon />
                        </div>
                        <div
                          onClick={() =>
                            solicitud.estadoSolicitud && !solicitud.estadoRetiro
                              ? openConfirmPopup(handleRechazar, solicitud, "¿Está seguro de rechazar el retiro?")
                              : null
                          }
                          className={`w-8 h-8 flex items-center justify-center ${
                            solicitud.estadoSolicitud && !solicitud.estadoRetiro
                              ? "bg-red-100 hover:bg-red-200 text-red-800 cursor-pointer"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          } rounded-full transition-transform duration-200 ${
                            solicitud.estadoSolicitud && !solicitud.estadoRetiro ? "hover:scale-110" : ""
                          }`}
                          aria-label="Rechazar"
                        >
                          <CloseIcon />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <EmptyState
                        mainMessage="No se encontraron solicitudes de retiro."
                        secondaryMessage="Verifique los filtros aplicados o intente con otros criterios de búsqueda."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}