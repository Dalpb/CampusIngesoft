import { useState } from 'react';
import {
    useLocation,
 } from 'react-router-dom'; 
import { ButtonAnchor } from '../Button/ButtonSpecial';
import { PreMatriculaIcon } from '../Button/ButtonImage';
import { getAbrirPrematricula, getCerrarPrematricula, getAbrirExtemporanea, getCerrarExtemporanea, getIniciarCiclo, getCerrarCiclo } from '../../services/gestorServices';
import { useAuth } from "../../context/AuthContext";


const ESTADOS = {
  MATRICULA: 'Matricula',
  PUBLICACIONMATRICULA: 'Publicacion Matricula',
  MATRICULAEXTEMPORANEA: 'Matricula Extemporanea',
  PUBLICACIONMATEXTEMPORANEA: 'Publicación Mat. Ext',
  CICLOLECTIVO: 'Ciclo Lectivo',
  FINDECICLO : 'Fin de Ciclo',
};

const ORDEN_ESTADOS = [
  ESTADOS.MATRICULA,
  ESTADOS.PUBLICACIONMATRICULA,
  ESTADOS.MATRICULAEXTEMPORANEA,
  ESTADOS.PUBLICACIONMATEXTEMPORANEA,
  ESTADOS.CICLOLECTIVO,
  ESTADOS.FINDECICLO,
];

function ActionButton({ title, description, icon, action, isActive, isNext, isCompleted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const openPopup = () => {
    setIsEntering(true);
    setIsOpen(true);

    // Asegurarse de que la clase de entrada se quite después de la animación
    setTimeout(() => setIsEntering(false), 200); // Duración de la animación
  };

  const closePopup = () => {
    setIsExiting(true); // Inicia la animación de salida
    setTimeout(() => {
      setIsOpen(false);
      setIsExiting(false); // Restablece el estado de salida
    }, 200); // Duración de la animación
  };

  return (
    <>
      <button
        onClick={openPopup}
        className={`flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 relative
          ${
            isActive
              ? "border-green-500 bg-green-50 text-green-700"
              : isCompleted
              ? "border-green-500 bg-green-50 text-green-700"
              : isNext
              ? "border-clrNavbar bg-white text-clrNavbar scale-100 shadow-lg hover:bg-clrNavbar hover:text-white hover:animate-none"
              : "border-clrNavbar bg-white text-clrNavbar hover:bg-clrNavbar hover:text-white"
          }`}
      >
        {icon}
        <div className="text-center">
          <div className="font-medium">{title}</div>
          <p className="text-xs opacity-80">{description}</p>
        </div>
        {isNext && (
          <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-clrNavbar text-white animate-bounce"></div>
        )}
        {(isActive || isCompleted) && (
          <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
            ✓
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300 ${
            isExiting ? "opacity-0" : "opacity-100"
          }`}
          style={{ zIndex: 9999 }}
        >
          <div
            className={`bg-white p-6 rounded-lg max-w-md w-full transform transition-all duration-200 ${
              isEntering ? "opacity-0 scale-95" : "opacity-100 scale-100"
            } ${isExiting ? "opacity-0 scale-95" : ""}`}
          >
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closePopup}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  action();
                  closePopup();
                }}
                className="px-4 py-2 bg-clrNavbar text-white rounded-md hover:bg-opacity-90"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export default function DashboardGestor() {
  const {userInformation, getName} = useAuth();
  console.log(userInformation.estado)
  const location = useLocation();
  const [estadoActual, setEstadoActual] = useState(userInformation.estado);

  const fetchAbrirPrematricula = async () => {
    const data = await getAbrirPrematricula();
    setEstadoActual(ESTADOS.MATRICULA);
    console.log(data);
  };

  const fetchCerrarPrematricula = async () => {
    const data = await getCerrarPrematricula();
    setEstadoActual(ESTADOS.PUBLICACIONMATRICULA);
    console.log(data);
  };

  const fetchAbrirExtemporanea = async () => {
    const data = await getAbrirExtemporanea();
    setEstadoActual(ESTADOS.MATRICULAEXTEMPORANEA);
    console.log(data);
  };

  const fetchCerrarExtemporanea = async () => {
    const data = await getCerrarExtemporanea();
    setEstadoActual(ESTADOS.PUBLICACIONMATEXTEMPORANEA);
    console.log(data);
  };

  const fetchIniciarCiclo = async () => {
    const data = await getIniciarCiclo();
    setEstadoActual(ESTADOS.CICLOLECTIVO);
    console.log(data);
  };

  const fetchCerrarCiclo = async () => {
    const data = await getCerrarCiclo();
    setEstadoActual(ESTADOS.FINDECICLO);
    console.log(data);
  };

  const isNextAction = (buttonState) => {
    const currentIndex = ORDEN_ESTADOS.indexOf(estadoActual);
    const buttonIndex = ORDEN_ESTADOS.indexOf(buttonState);
    return buttonIndex === currentIndex + 1;
  };

  const isActiveState = (buttonState) => {
    return estadoActual === buttonState;
  };

  const isCompletedState = (buttonState) => {
    const currentIndex = ORDEN_ESTADOS.indexOf(estadoActual);
    const buttonIndex = ORDEN_ESTADOS.indexOf(buttonState);
    return buttonIndex < currentIndex;
  };

  return (
    <div className="p-6 mt-0 px-0 rounded-lg w-full max-w-10xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="bg-clrNavbar text-white font-semibold px-4 py-4 rounded-t-md mb-6">
          <h2 className="text-2xl">Manipulación de horarios</h2>
          <p className="text-white/80">Acciones Para la matrícula</p>
        </div>
        <div className="grid gap-4 p-6">
          <ButtonAnchor
            title="Administración de horarios"
            subtitle="Gestionar los horarios del periodo académico"
            goTo="/gestor/principal/horarios"
            state={{...location.state}}
          >
            <PreMatriculaIcon/>
          </ButtonAnchor>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ActionButton
              action={fetchAbrirPrematricula}
              title="Abrir Matrícula"
              description="Habilitar el proceso de matrícula"
              isActive={isActiveState(ESTADOS.MATRICULA)}
              isNext={isNextAction(ESTADOS.MATRICULA)}
              isCompleted={isCompletedState(ESTADOS.MATRICULA)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
            />
            <ActionButton
              action={fetchCerrarPrematricula}
              title="Cerrar Matrícula"
              description="Publicacion de Resultados Matrícula"
              isActive={isActiveState(ESTADOS.PUBLICACIONMATRICULA)}
              isNext={isNextAction(ESTADOS.PUBLICACIONMATRICULA)}
              isCompleted={isCompletedState(ESTADOS.PUBLICACIONMATRICULA)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>}
            />
            <ActionButton
              action={fetchAbrirExtemporanea}
              title="Abrir Mat. Extemporánea"
              description="Habilitar matrícula extemporánea"
              isActive={isActiveState(ESTADOS.MATRICULAEXTEMPORANEA)}
              isNext={isNextAction(ESTADOS.MATRICULAEXTEMPORANEA)}
              isCompleted={isCompletedState(ESTADOS.MATRICULAEXTEMPORANEA)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
            />
            <ActionButton
              action={fetchCerrarExtemporanea}
              title="Cerrar Mat. Extemporánea"
              description="Publicación de Resultado de Mat. Extemporánea"
              isActive={isActiveState(ESTADOS.PUBLICACIONMATEXTEMPORANEA)}
              isNext={isNextAction(ESTADOS.PUBLICACIONMATEXTEMPORANEA)}
              isCompleted={isCompletedState(ESTADOS.PUBLICACIONMATEXTEMPORANEA)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>}
            />
            <ActionButton
              action={fetchIniciarCiclo}
              title="Iniciar Ciclo"
              description="Iniciar el ciclo lectivo"
              isActive={isActiveState(ESTADOS.CICLOLECTIVO)}
              isNext={isNextAction(ESTADOS.CICLOLECTIVO)}
              isCompleted={isCompletedState(ESTADOS.CICLOLECTIVO)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>}
            />
            <ActionButton
              action={fetchCerrarCiclo}
              title="Finalizar Ciclo"
              description="Finalizar el ciclo lectivo"
              isActive={isActiveState(ESTADOS.FINDECICLO)}
              isNext={isNextAction(ESTADOS.FINDECICLO)}
              isCompleted={isCompletedState(ESTADOS.FINDECICLO)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

