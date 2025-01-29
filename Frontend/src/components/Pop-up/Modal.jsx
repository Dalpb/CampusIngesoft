import { useEffect,useState } from "react";
import { motion,AnimatePresence } from "framer-motion";
import { Button } from "../Button/Button";
export const Modal = ({ isOpen, onClose, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3,ease:"easeInOut" }}
        >
          <motion.div
            className={`p-6 bg-white rounded-lg shadow-xl max-w-xl mx-auto overflow-hidden ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            
          {children}

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

export const TitleModal =({title,className}) =>{
  return (
    <h2 className={`text-2xl font-bold mb-6 text-center ${className}}`}>{title}</h2>
  )
}


export const ModalEditHorario = ({ isOpen, onClose, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3,ease:"easeInOut" }}
        >
          <motion.div
            className={`p-6 bg-white rounded-lg shadow-xl max-w-[430px] mx-auto overflow-hidden ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            
          {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export const ModalErrorVisualizarCursos = ({ isOpen, onClose, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3,ease:"easeInOut" }}
        >
          <motion.div
            className={`p-6 bg-white rounded-lg shadow-xl max-w-xl mx-auto overflow-hidden ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            
          {children}

          <div className="bg-white px-4 py-3 sm:px-6 flex justify-center">
                <Button
                  txt="Cerrar Sesion"
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