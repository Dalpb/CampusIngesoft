import React from 'react';

export function AlumnosInscritosTable({ alumnos }) {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-indigo-500 text-white">
              <th className="p-3 text-left">Código</th>
              <th className="p-3 text-left">Nombre del alumno</th>
              <th className="p-3 text-left">Correo Electrónico</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {alumnos.map((alumno, index) => (
              <tr
                key={index}
                className={`border-t border-gray-200 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="p-3">{alumno.codigo}</td>
                <td className="p-3">{alumno.nombre}</td>
                <td className="p-3">{alumno.correo}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
