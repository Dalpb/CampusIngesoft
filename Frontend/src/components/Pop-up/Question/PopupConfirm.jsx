import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, ButtonSecondary } from "../../Button/Button";

export function PopupConfirm({isOpen, text, onConfirm, onCancel }) {
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
          <div className="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          </div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">{text}</h2>
          <div className="flex justify-center gap-4">
            <ButtonSecondary
              txt="Cancelar"
              action={onCancel}
            />
            <Button
              txt="Confirmar"
              action={onConfirm}
            />
          </div>
        </motion.div>
      </motion.div>)}
    </AnimatePresence>
  );
}
