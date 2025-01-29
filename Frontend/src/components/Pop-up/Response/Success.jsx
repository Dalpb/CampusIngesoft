import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../Button/Button";
import circle_Svg from "../../../assets/check_circle.svg"; // Asegúrate de que la ruta sea correcta

const PopupSuccess = ({ text, onContinue, isOpen = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }} // Animación inicial
          animate={{ opacity: 1 }} // Animación cuando está visible
          exit={{ opacity: 0 }} // Animación al salir
          transition={{ duration: 0.3 }} // Duración de las transiciones
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-80 text-center"
            initial={{ scale: 0.8, opacity: 0 }} // Estado inicial del popup
            animate={{ scale: 1, opacity: 1 }} // Estado final cuando aparece
            exit={{ scale: 0.8, opacity: 0 }} // Estado final cuando desaparece
            transition={{ duration: 0.3 }} // Duración de las transiciones
          >
            <div className="mb-4">
              <img className="w-16 h-16 mx-auto" src={circle_Svg} alt="Success" />
            </div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">{text}</h2>
            <div className="flex justify-center">
              <div onClick={onContinue}>
                <Button txt="Continuar" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupSuccess;
