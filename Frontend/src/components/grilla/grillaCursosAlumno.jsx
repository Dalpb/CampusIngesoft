import React from 'react';

export function CourseTable({ courses }) {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-indigo-500 text-white rounded-t-lg">
              <th className="p-3 text-left">Clave</th>
              <th className="p-3 text-left">Nombre del curso</th>
              <th className="p-3 text-center">Créditos</th>
              <th className="p-3 text-center">Horario</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Docente</th>
              <th className="p-3 text-center">Sesiones</th>
            </tr>
          </thead>
          <tbody className="bg-white rounded-b-lg">
            {courses.map((course, index) => (
              <tr
                key={index}
                className={`border-t border-gray-200 ${
                  index === courses.length - 1 ? 'rounded-b-lg' : ''
                }`}
              >
                <td className="p-3">{course.clave}</td>
                <td className="p-3">{course.nombre}</td>
                <td className="p-3 text-center">{course.creditos}</td>
                <td className="p-3 text-center">{course.horario}</td>
                <td className={`p-3 font-bold ${course.estado === 'Matriculado' ? 'text-green-500' : 'text-red-500'}`}>
                  {course.estado}
                </td>
                <td className="p-3">{course.docente}</td>
                <td className="p-3 text-center">{course.sesiones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
