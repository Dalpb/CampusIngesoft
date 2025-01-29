import React from "react";
import { useState, useEffect } from "react";
import { buscarAlumnoPorCodigo } from "../../../services/userServices";
import { postMatricularAlumnoExtemporanea } from "../../../services/matricula.service";
import { motion } from "framer-motion";
import PopupSuccess from "../Response/Success";

export function ModalAgregarAlumno({ isOpen, onClose, onSubmit, horarioId }) {
  const [codigo, setCodigo] = useState(""); // Código del alumno ingresado
  const [nombreCompleto, setNombreCompleto] = useState(""); // Nombre completo a rellenar
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(""); // Mensaje de error
  const [alumnoId, setAlumnoId] = useState(null); // ID del alumno encontrado
  const [showSuccess, setShowSuccess] = useState(false); 

  // Limpia los campos cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      setCodigo("");
      setNombreCompleto("");
      setAlumnoId(null);
      setError("");
        setShowSuccess(false); // Resetear popup
    }
  }, [isOpen]);

  const handleBuscarAlumno = async () => {
    try {
      setLoading(true);
      setError(""); // Resetea el error anterior
      const alumno = await buscarAlumnoPorCodigo(codigo); // Llamada al servicio
      setAlumnoId(alumno.id); // Guardamos el ID del alumno
      setNombreCompleto(`${alumno.primerApellido} ${alumno.segundoApellido}, ${alumno.nombre}`); // Rellenar el nombre
    } catch (err) {
      setNombreCompleto(""); // Limpia el nombre en caso de error
      setError("No se encontró un alumno con ese código."); // Muestra el error
    } finally {
      setLoading(false);
    }
  };

  console.log("idalumno: ", alumnoId);
  console.log("idhorario: " , horarioId);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!alumnoId || !horarioId) {
      setError("Debes buscar un alumno válido antes de inscribir.");
      return;
    }

    try {
      setLoading(true);
      await postMatricularAlumnoExtemporanea(alumnoId, horarioId);

      setShowSuccess(true); // Mostrar el popup de éxito

      // Opcional: Llamar a onSubmit para actualizar la lista en el componente principal
      onSubmit({ id: alumnoId, codigo, nombre: nombreCompleto });

      // Limpia y cierra el modal después de un breve retraso
      setTimeout(() => {
        setShowSuccess(false); 
      }, 300);
    } catch (err) {
      setError("Ocurrió un error al intentar inscribir al alumno.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-xl font-bold">Inscribir Nuevo Alumno</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-700"
          >
            ✖
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
              Código
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleBuscarAlumno}
                className="px-4 py-2 bg-clrNavbar text-white rounded-md "
                disabled={loading}
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              value={nombreCompleto}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-clrNavbar text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Inscribiendo..." : "Inscribir Alumno"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Popup de Éxito */}
      <PopupSuccess
        text="Alumno inscrito exitosamente."
        isOpen={showSuccess}
        onContinue={() => setShowSuccess(false)} // Cierra el popup manualmente
      />
    </div>
  );
}
