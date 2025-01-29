import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation} from 'react-router-dom';

const PopUp = ({ title, buttons, onClose ,url}) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cursoId,cursoClave, cursoNombre, horarioNumero, periodo,horarioId,periodoId } = location.state || {};
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for the animation to finish before closing

  };
  const handleButtonClick = (tipoNota, indice) => {
    if (location.state) {

      //manejarle un id o prodria manejarse tipoNota - indice
      const index = indice ?? 0;
      navigate(`${url}${index}`, { 
        state: {
          ...location.state,
          tipoNota:tipoNota,
          indice:indice,
          periodo:periodo,
          periodoId:periodoId
      } });
  } else {
      console.error("No se pudo navegar, falta información del curso");
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 m-0 p-0 min-h-screen ">
      <div
        className={`bg-white rounded-lg shadow-lg w-80 transform transition-all duration-300 ease-in-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-2">
          {buttons.map((button) => (
            <button 
              key={button.id}
              onClick={() => handleButtonClick(button.tipoNota, button.indice)}
              className="w-full py-2 px-4 bg-bgLoginOne text-white rounded-md hover:bg-indigo-700 transition duration-300"
            >
              {`${button.tipoNota} ${button.indice}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopUp;