import { EstadoRetiroCheckbox } from "../Inputs/Checkbox";

export function GrillaRetiroCursos({ courses, selectedCourses, handleCheckboxChange }) {
    console.log("Cursos recibidos en GrillaRetiroCursos:", courses); // Validar los cursos que llegan al componente
    
    return (
      <div className="overflow-x-auto rounded-t-2xl shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-clrTableHead">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tl-lg hidden sm:table-cell">
                Clave
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                Nombre del curso
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider hidden sm:table-cell">
                Créditos
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider hidden sm:table-cell">
                Horario
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white tracking-wider rounded-tr-lg">
                Retiro
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses && courses.length > 0 ? (
              courses.map((course) => {
                const retiroHorarios = course.retiroHorarios || {
                  estadoSolicitud: null,
                  estadoRetiro: null,
                };

                return (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-900 hidden sm:table-cell">
                      {course.curso.clave}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                      {course.curso.nombre}
                    </td>
                    <td className="px-11 py-4 whitespace-nowrap text-sm text-black-500 hidden sm:table-cell">
                      {course.curso.creditos}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-black-500 hidden sm:table-cell">
                      {course.numHorario}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <EstadoRetiroCheckbox
                        estadoRetiro={retiroHorarios.estadoRetiro}
                        estadoSolicitud={retiroHorarios.estadoSolicitud}
                        isSelected={!!selectedCourses[course.id]}
                        onChange={() => handleCheckboxChange(course.id)}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  Cargando cursos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  