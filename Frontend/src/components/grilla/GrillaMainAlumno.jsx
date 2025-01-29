import { MoreEyeIcon } from "./GridIcons";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { LoadingLayout } from "../Layout/Layout";

export function GrillaMainAlumno({ courses,period }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Estado para indicar si se está cargando el grid
    console.log("Cursos de grilla: ", courses);
    useEffect(() => {
        if (courses) {
            setIsLoading(false); // Detener la carga cuando los cursos están disponibles
        }
    }, [courses]);
    
    const goToDetalleCompetencias = (course,idSchedule) => {
        //Se navega de manera dinamica al curso FALTA MEJORAR LOS STATES, PERO ESTA FUNCIONAL - Joey
        navigate(`/alumno/cursos/${course.id}/detalleCompetencias`,{
            state: {
                cursoId : course.id,
                cursoClave: course.curso.clave,
                cursoNombre: course.curso.nombre,
                periodo: period,
                horarioNum: course.numHorario,
            }
        });    
    };

    // Mostrar solo el indicador de carga si isLoading es true
    // if (isLoading) {
    //     return (
    //       <div className="mt-20">
    //         <LoadingLayout msg="Cargando los cursos disponibles..." />
    //       </div>
    //     );
    // }
    
    return (
        <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
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
                                Vez
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider hidden sm:table-cell">
                                Horario
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider hidden sm:table-cell">
                                Docente
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider hidden sm:table-cell">
                                Sesiones
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tr-lg">
                                Competencias
                            </th>
                        </tr>
                    </thead>

                    {/*Se esta manejando un estado de cargando cursos, asi como cuando no exista para reutilizar en las
                       demas grillas  
                    */}
                    {isLoading ? (
                        <tbody>
                            <tr>
                                <td colSpan="8" className="text-center text-gray-500 py-4">
                                    Cargando cursos...
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody className="bg-white divide-y divide-gray-200">
                            {console.log("Cursos Main Alumno: ", courses)}
                            {courses && courses.length > 0 ? (
                                courses.map((course, index) => (
                                    <tr
                                        key={index}
                                        className={
                                            course.retiroHorarios?.estadoRetiro || course.retirado
                                                ? "bg-gray-100 italic text-gray-500" // Estilo especial para retirados
                                                : ""
                                        }
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-900 hidden sm:table-cell">
                                            {course.curso.clave}
                                            {(course.retiroHorarios?.estadoRetiro || course.retirado)&& (
                                                <span className="ml-2 italic font-bold px-2 py-1 text-xs bg-gray-200 text-black rounded-full">
                                                    Retirado
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                                            {course.curso.nombre}
                                        </td>
                                        <td className="px-11 py-4 whitespace-nowrap text-sm text-black-500 hidden sm:table-cell">
                                            {course.curso.creditos}
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap text-sm text-black-500 hidden sm:table-cell">
                                            {course.vez}
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap text-sm text-black-500 hidden sm:table-cell">
                                            {course.numHorario}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500 hidden sm:table-cell">
                                            <div className="flex flex-col">
                                                <span>{course.profesor_nombre}</span>
                                                <span className="text-black-500 text-sm">
                                                    {course.apellido_profesorP}
                                                </span>
                                                <span className="text-black-500 text-sm">
                                                    {course.apellido_profesorM}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap text-center text-sm text-black-500 hidden sm:table-cell">
                                            {course.curso.numHoras}
                                        </td>
                                        <td className="px-12 py-4 whitespace-nowrap text-sm text-black-500">
                                            <button
                                                className={`transform transition-transform duration-100 active:scale-95 ${
                                                    course.retiroHorarios?.estadoRetiro || course.retirado
                                                        ? "opacity-50 cursor-not-allowed" // Deshabilitado
                                                        : "hover:scale-105"
                                                }`}
                                                onClick={() =>
                                                    !(course.retiroHorarios?.estadoRetiro || course.retirado) && goToDetalleCompetencias(course)
                                                }
                                                disabled={course.retiroHorarios?.estadoRetiro || course.retirado} // Deshabilita el botón
                                            >
                                                <Eye />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-gray-500 py-4">
                                        No hay cursos disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
