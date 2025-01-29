import React, { useState } from 'react';
import { ButtonSpecial } from '../Button/ButtonSpecial';
import { motion } from "framer-motion";

export function EvaluacionDropdown({ evaluaciones, onSelect }) {
  const [selectedEvaluacion, setSelectedEvaluacion] = useState('');
  const [isOpen, setIsOpen] = useState(false); 

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedEvaluacion(value);
    onSelect(value); // Llamamos a onSelect para actualizar en el componente padre
    setIsOpen(false); 
  };

  return (
    <div className={`relative`}>
      <label
        htmlFor="evaluacionDropdown"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Evaluación
      </label>

      {/* Dropdown visible */}
      <div
        className={`w-full h-11 px-4 py-2 rounded-md border border-gray-300 bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring focus:ring-blue-300`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>
          {selectedEvaluacion || 'Seleccione evaluación'}
        </span>
        <span className="ml-2">
          {/* Flecha estilizada con animación */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>

      {/* Lista desplegable */}
      <ul
        className={`absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-md transition-all duration-300 z-10 overflow-hidden ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {evaluaciones.length === 0 ? (
          <li className="px-4 py-2 text-gray-500">No hay evaluaciones</li>
        ) : (
          evaluaciones.map((evaluacion) => (
            <li
              key={evaluacion.key}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedEvaluacion(evaluacion.value);
                onSelect(evaluacion.value);
                setIsOpen(false); // Cierra el dropdown después de seleccionar
              }}
            >
              {evaluacion.value}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export function DropdownGenerico({ label, value, options, onChange, loading, disabled, className }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${className} relative`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {/* Input visible */}
      <div
        className={`w-full h-11 px-4 py-2 rounded-md border border-gray-300 bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring focus:ring-blue-300 ${
          disabled ? "bg-gray-200 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        <span>
          {value ? options.find((opt) => opt.value === value)?.label : `Seleccione ${label.toLowerCase()}`}
        </span>
        <span className="ml-2">
          {/* Flecha estilizada */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {/* Lista desplegable */}
      <ul
        className={`absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-md transition-all duration-300 z-10 overflow-hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {loading ? (
          <li className="px-4 py-2 text-gray-500">Cargando...</li>
        ) : (
          options.map((option) => (
            <li
              key={option.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export function CursoDropdown({ options, onCursoChange }) {
  return (
      <div className="w-full sm:w-1/2 sm:mr-16">
          <label htmlFor="dropCursos">
              <span className="block text-sm font-medium text-gray-700 mb-1">Curso</span>
              <select 
                  id="dropCursos" 
                  className="mt-1.5 px-4 py-2 h-11 rounded-md w-full border border-solid border-[#CBD5E1] text-black"
                  onChange={(e) => onCursoChange(e.target.value)}
              >
                  {options.map((option, index) => (
                      <option key={index} value={option.value}>{option.label}</option>
                  ))}
              </select>
          </label>
      </div>
  );
}

export function CicloDropdown({ options, onCicloChange }) {
  return (
      <div className="w-full sm:w-1/6 ml-4 mr-7 min-w-28 mb-4">
          <label htmlFor="dropCiclo">
              <span className="font-semibold">Ciclo</span>
              <select 
                  id="dropCiclo" 
                  className="mt-1.5 px-1 py-2 h-11 rounded-md w-full border border-solid border-[#CBD5E1] text-black"
                  onChange={(e) => onCicloChange(e.target.value)}
              >
                  {options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                  ))}
              </select>
          </label>
      </div>
  );
}

// el que esta usando matias
export function NivelDropdownDir({ options, onNivelChange }) {
  return (
      <div className="w-full sm:w-1/6 ml-4 mr-7 min-w-28 mb-4">
          <label htmlFor="dropNivelCurso">
              <span className="font-semibold">Nivel</span>
              <select 
                  id="dropNivelCurso" 
                  className="mt-1.5 px-1 py-2 h-11 rounded-md w-full border border-solid border-[#CBD5E1] text-black"
                  onChange={(e) => onNivelChange(e.target.value)}
              >
                  <option value="Todos" className="text-gray-400">Todos</option>
                  {options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                  ))}
              </select>
          </label>
      </div>
  );
}

export function EvaluacionDropdownNuevo({ evaluaciones, onSelect }) {
  const [selectedEvaluacion, setSelectedEvaluacion] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedEvaluacion(value);
    onSelect(value); // Llamamos a onSelect para actualizar en el componente padre
  };

  return (
    <div className="p-2">
      <label htmlFor="evaluacionDropdown" className="block text-sm font-medium text-gray-700 mb-1">
        Evaluación
      </label>
      <select
        id="evaluacionDropdown"
        value={selectedEvaluacion}
        onChange={handleChange}
        className="px-4 py-2 h-11 rounded-md w-full sm:w-96 border border-solid border-[#CBD5E1] text-black bg-white"
      >
        <option value="">Seleccione evaluación</option>
        {evaluaciones.map((evaluacion) => (
          <option key={evaluacion.key} value={evaluacion.value}>
            {evaluacion.value}
          </option>
        ))}
      </select>
    </div>
  );
}

export function NivelDropdown({ options, onCicloChange }) {
  return (
      <div className="w-full sm:w-1/6 ml-4 mr-8 min-w-28">
          <label htmlFor="dropCiclo">
              <span className="block text-sm font-medium text-gray-700 mb-1">Nivel</span>
              <select 
                  id="dropCiclo" 
                  className="mt-1.5 px-4 py-2 h-11 rounded-md w-full border border-solid border-[#CBD5E1] text-black"
                  onChange={(e) => onCicloChange(e.target.value)}
              >
                  {options.map((option, index) => (
                      <option key={index} value={option.value}>{option.label}</option>
                  ))}
              </select>
          </label>
      </div>
  );
}