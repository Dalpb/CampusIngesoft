import React, { useEffect, useState } from "react";

export function CursosPermitidosTable({ courses }) {
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    if (courses) {
      setIsLoading(false); // Detener carga cuando los cursos están disponibles
    }
  }, [courses]);

  // Función para determinar la fórmula de calificación
  const obtenerFormula = (formula) => {
    const { pesoParciales, pesoFinales, pesoPracticas } = formula;

    if (pesoParciales === 0.3 && pesoFinales === 0.5 && pesoPracticas === 0.2) {
      return "ME1";
    } else if (pesoParciales === 0.4 && pesoFinales === 0.6 && pesoPracticas === 0.0) {
      return "ME2";
    } else if (pesoParciales === 0.0 && pesoFinales === 0.0 && pesoPracticas === 0.0) {
      return "ME3";
    } else {
      return "Desconocida"; // Para casos que no cumplen ninguna fórmula
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
      {/* Tabla */}
      <div className="overflow-x-auto rounded-t-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-clrTableHead">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tl-lg"
              >
                Clave
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                Nombre del curso
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
              >
                Créditos
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
              >
                Nivel
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
              >
                Vez
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tr-lg"
              >
                Fórmula
              </th>
            </tr>
          </thead>

          {/* Cuerpo de la tabla */}
          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  Cargando cursos permitidos...
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="bg-white divide-y divide-gray-200">
              {courses && courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr key={index}>
                    {/* Clave del curso */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-900">
                      {course.clave}
                    </td>

                    {/* Nombre del curso */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                      {course.nombre}
                    </td>

                    {/* Créditos */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                      {course.creditos}
                    </td>

                    {/* Nivel */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                      {course.nivel}
                    </td>

                    {/* Vez */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                      {course.vez}
                    </td>

                    {/* Fórmula */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                      {obtenerFormula(course.formula)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-4">
                    No hay cursos permitidos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Leyenda */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Leyenda de Fórmulas</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>
            <span className="font-bold text-black">ME1:</span> 20% Prom. Prácticas + 30% Parcial + 50% Final
          </li>
          <li>
            <span className="font-bold text-black">ME2:</span> 40% Parcial + 60% Final
          </li>
          <li>
            <span className="font-bold text-black">ME3:</span> Nota Única
          </li>
        </ul>
      </div>
    </div>
  );
}
