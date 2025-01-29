import React, { useState } from 'react';

export default function SearchBar ({ ciclos, nombre }) {
  const [cicloSeleccionado, setCicloSeleccionado] = useState(Object.keys(ciclos)[0]);  // Inicia con el primer ciclo disponible
  const [cursos, setCursos] = useState(ciclos[cicloSeleccionado]);  // Cursos del ciclo seleccionado

  // Función para actualizar el ciclo seleccionado
  const actualizarCiclo = (e) => {
    const nuevoCiclo = e.target.value;
    setCicloSeleccionado(nuevoCiclo);  // Actualizamos el ciclo seleccionado
    setCursos(ciclos[nuevoCiclo]);  // Actualizamos los cursos del nuevo ciclo
  };

  // Calcular la cantidad de cursos (horarios) y la suma de créditos
  const totalHorarios = cursos.length;
  const totalCreditos = cursos.reduce((sum, curso) => sum + curso.creditos, 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-black text-center sm:text-left">{nombre}</h1>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-auto">
            <label htmlFor="ciclo" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-2">Ciclo</label>
            <select
              id="ciclo"
              className="border-l-0 rounded-md px-2 py-1 font-bold text-black text-sm"
              value={cicloSeleccionado}
              onChange={actualizarCiclo}
            >
              {Object.keys(ciclos).map((ciclo) => (
                <option key={ciclo} value={ciclo}>
                  {ciclo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row flex-wrap justify-between items-center gap-4">
            <div className="mr-4 sm:mr-8">
              <span className="block text-sm font-medium text-gray-700">Profesor</span>
              <span className="block text-base sm:text-lg font-bold text-gray-900">Abraham Dávila</span>
            </div>

            <div className="flex-1 min-w-[60px] text-center">
              <span className="block text-sm font-medium text-gray-700">Horarios</span>
              <span className="block text-base sm:text-lg font-bold text-gray-900">{totalHorarios}</span>
            </div>

            <div className="flex-1 min-w-[60px] text-center">
              <span className="block text-sm font-medium text-gray-700">Créditos</span>
              <span className="block text-base sm:text-lg font-bold text-gray-900">{totalCreditos}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
