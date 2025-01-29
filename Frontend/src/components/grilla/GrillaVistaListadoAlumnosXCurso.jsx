
import { useTableFilter } from '../../hooks/useTableFilter';
import { TableIndex } from '../../components/Table/TableIndex';
import { useEffect, useState } from 'react';
import {getStudentsList } from '../../services/coursesServices';
import { useLocation} from 'react-router-dom';
import { EmptyState } from './grillaEmpty';
import { LoadingLayout } from '../Layout/Layout';
import { Trash } from 'lucide-react';
import { PopupConfirm } from '../Pop-up/Question/PopupConfirm';
import PopupSuccess from '../Pop-up/Response/Success'

export function GrillaVistaListadoAlumnosXCurso({ cursoId, setStudents, students,horarioId ,localStudents,setLocalStudents, 
    showRetirarColumn = false, // Nueva prop para mostrar u ocultar la columna
    onRetirarAlumno, // Nueva prop para manejar el retiro de alumnos
    periodoId
}) {
    const ITEMS_PER_PAGE = 10; // Cantidad de estudiantes por página (ajusta según necesites)
    const { actualIndex, totalIndex, tablePartContent, getIndexContent } = useTableFilter({ content: localStudents, rowsShow: ITEMS_PER_PAGE });
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga inicial
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado del popup
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false); // Estado del PopupSuccess
    const [selectedStudentId, setSelectedStudentId] = useState(null); // Alumno seleccionado para retiro  

    console.log("Estudiantes: ", students);
    // Función para obtener los estudiantes del curso
    const getStudentsListCourse = async () => {
        try {
            setIsLoading(true); // Activar estado de carga
            const studentLists = await getStudentsList(horarioId,periodoId);
            setStudents(studentLists); // Guardar la lista de estudiantes en el estado
            setLocalStudents(studentLists)
            console.log("listaEstudiantes");
            console.log(studentLists);
        } catch (error) {
            console.error("Error en obtener los estudiantes");
        } finally {
            setIsLoading(false); // Desactivar estado de carga después de completar la solicitud
        }
    };

    useEffect(() => {
        if (cursoId) {
            getStudentsListCourse(cursoId);
        }
    }, [cursoId]);

    // Maneja la apertura del popup para confirmar retiro
    const handleRetirarClick = (studentId) => {
        setSelectedStudentId(studentId);
        setIsPopupOpen(true);
    };

    // Maneja la confirmación del retiro
    const handleConfirmRetiro = async () => {
        if (onRetirarAlumno && selectedStudentId) {
            try {
                await onRetirarAlumno(selectedStudentId); // Invoca la función proporcionada
                setIsPopupOpen(false); // Cierra el popup de confirmación
    
                // Espera un momento antes de mostrar el mensaje de éxito (opcional)
                setTimeout(() => {
                    setIsSuccessPopupOpen(true); // Abre el popup de éxito
                }, 300);
            } catch (error) {
                console.error("Error al retirar al estudiante:", error);
            }
        }
    };
    

    // Maneja el cierre del popup
    const handleCancelRetiro = () => {
        setIsPopupOpen(false); // Cierra el popup
    };

    // Maneja el cierre del PopupSuccess
    const handleCloseSuccessPopup = () => {
        setIsSuccessPopupOpen(false); // Cierra el PopupSuccess
    };

    // Calcular la cantidad total de páginas
    const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);

    // Renderizar la tabla
    if (isLoading) {
        return (
            <div>
                <div className="mb-80">
                </div>
                <div >
                    <LoadingLayout msg="Espera hasta que carguen los alumnos" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto rounded-t-2xl shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-clrTableHead">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tl-lg">
                                Código
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                                Nombre Completo
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider hidden sm:table-cell">
                                Correo
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tr-lg">
                                Estado
                            </th>   
                            {/*Columna Retirar Alumno*/}
                            {showRetirarColumn && (
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white tracking-wider rounded-tr-lg">
                                    Retirar Alumno
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {console.log("EstudiantesTablePartContent: ", tablePartContent)}
                        {tablePartContent.length > 0 ? (
                            tablePartContent.map((student) => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {student.alumno.codigo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.alumno.primerApellido + " " + student.alumno.segundoApellido +" , " +student.alumno.nombre }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                        {student.alumno.correo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                                        <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            student.retirado
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                        >
                                        {student.retirado ? "Retirado" : "Matriculado"}
                                        </span>
                                    </td>
                                    {showRetirarColumn && (
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleRetirarClick(student.id)}
                                        >
                                            <Trash />
                                        </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center">
                                    <EmptyState mainMessage="Actualmente, no se encontraron estudiantes con el criterio ingresado." />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                {totalPages > 1 && <TableIndex count={totalPages} actionSelection={getIndexContent} />} {/* Actualiza con el total de páginas */}
            </div>
            {/* Popup de confirmación */}
            <PopupConfirm
                isOpen={isPopupOpen}
                text="¿Estás seguro de que deseas retirar a este alumno?"
                onConfirm={handleConfirmRetiro}
                onCancel={handleCancelRetiro}
            />

            {/* Popup de éxito */}
            <PopupSuccess
                text="El alumno fue retirado exitosamente."
                onContinue={handleCloseSuccessPopup}
                isOpen={isSuccessPopupOpen}
            />
        </div>
    );
}
