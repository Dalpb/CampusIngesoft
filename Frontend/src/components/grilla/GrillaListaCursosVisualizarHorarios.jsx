import React, { useState } from "react";

export const GrillaListaCursosVisualizarHorarios = ({horarios}) => {
  const cursos = [
    {
      clave: "INF111",
      nombre: "Ingeniería de Software",
      matriculados: 45,
      creditos: 4,
      horarios: [
        { hora: "882", profesor: "Dávila, A" },
        { hora: "883", profesor: "Cruz, B" },
        { hora: "884", profesor: "Flores, C" },
      ],
    },
    {
      clave: "INF112",
      nombre: "Programación 3",
      matriculados: 45,
      creditos: 4.5,
      horarios: [
        { hora: "882", profesor: "Cueva, R" },
        { hora: "883", profesor: "Guanira, M" },
        { hora: "884", profesor: "Zavala, D" },
      ],
    },
    {
      clave: "INF113",
      nombre: "Fundamentos de Física",
      matriculados: 30,
      creditos: 4,
      horarios: [
        { hora: "882", profesor: "Mendoza, N" },
        { hora: "883", profesor: "Pérez, J" },
        { hora: "884", profesor: "López, L" },
      ],
    },
    {
      clave: "INF114",
      nombre: "Arquitectura Empresarial",
      matriculados: 25,
      creditos: 3.5,
      horarios: [
        { hora: "882", profesor: "Tupia, F" },
        { hora: "883", profesor: "Rojas, M" },
        { hora: "884", profesor: "Sánchez, K" },
      ],
    },
    {
      clave: "INF115",
      nombre: "Gobierno y Gestión de TI",
      matriculados: 25,
      creditos: 3,
      horarios: [
        { hora: "882", profesor: "Moquillaza, F" },
        { hora: "883", profesor: "Castro, P" },
        { hora: "884", profesor: "García, R" },
      ],
    },
  ];

  const [selectedHorario, setSelectedHorario] = useState(
    cursos.map((curso) => curso.horarios[0].hora)
  );

  const handleHorarioChange = (index, newHorario) => {
    setSelectedHorario((prev) =>
      prev.map((hora, i) => (i === index ? newHorario : hora))
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
    <div className="overflow-x-auto rounded-t-2xl shadow-md rounded-lg">
    <table className="min-w-full divide-y divide-white-200">
      <thead className="bg-clrTableHead">
          <tr>
               <th scope="col" className="px-6 py-3 text-left text-xs font-large text-white tracking-wider rounded-tl-lg hidden sm:table-cell">
                    Clave
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                Nombre del curso
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                Vacantes
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                Créditos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                Horario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tr-lg">
                Profesor
                </th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((curso, index) => {
            const selectedHora = selectedHorario[index];
            const profesor =
              curso.horarios.find((h) => h.hora === selectedHora)?.profesor ||
              "No asignado";

            return (
              <tr key={curso.clave} className="text-center">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden sm:table-cell">
                  {curso.clave}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{curso.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {curso.matriculados}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{curso.creditos}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={selectedHora}
                    onChange={(e) =>
                      handleHorarioChange(index, e.target.value)
                    }
                    className="border rounded p-1"
                  >
                    {curso.horarios.map((h) => (
                      <option key={h.hora} value={h.hora}>
                        {h.hora}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profesor}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
};
