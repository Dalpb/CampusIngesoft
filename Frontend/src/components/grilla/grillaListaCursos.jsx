
import { useTableFilter } from '../../hooks/useTableFilter';
import { TableIndexPaginacion} from '../../components/Table/TableIndex';
import { useEffect } from 'react';
import {getCourses, getStudentsList } from '../../services/coursesServices';
import { useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from './grillaEmpty';
import { useState } from 'react';
import Eye from '../../assets/Eye.svg'; 
import { LoadingLayout } from '../Layout/Layout';

export function GrillaListaCursos({ periodo = '', cursos, clave, nombre, nivel, setCursos }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); 
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(null)
    const ITEMS_PER_PAGE = 20; 
    const { actualIndex, totalIndex, tablePartContent, getIndexContent } = useTableFilter({ content: cursos, rowsShow: ITEMS_PER_PAGE });
    const location = useLocation();  

    const fetchCursos = async (page) => {
        setIsLoading(true);
        try {
            const data = await getCourses({
                page,
                clave,
                nombre,
                nivel,
            });
            setCursos(data.results);
            setTotalPages(Math.ceil(data.count / 20)); // Total de páginas (20 cursos por página)
        } catch (error) {
            console.error('Error al obtener los cursos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Llamar a fetchCursos cada vez que cambia la página
    useEffect(() => {
        fetchCursos(currentPage);
    }, [currentPage, clave, nombre, nivel]);

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex); // Cambiar página actual
    };


    const changeButton = (curso) => {
        console.log("location: ", location.state);
        navigate(`/director/${periodo}/cursos/visualizar/${curso.id}/VistaCompetencias`, {
            state: { 
                cursoId: curso.id,
                cursoNombre: curso.nombre,
                cursoClave: curso.clave,
            }
        });
    };

    if (isLoading) {
        return (
            <div className="mt-8">
                {/* <LoadingLayout msg="Cargando lista de cursos..." /> */}
            </div>
        )
    }

    if (!cursos || cursos.length === 0) {
        return (
            <EmptyState mainMessage={"No se encontraron cursos"} secondaryMessage={"Borre los filtros o verifique que se encuentra en el periodo correcto"}/>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto rounded-t-2xl shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-clrTableHead">
                        <tr>
                            <th className="px-6 py-3 text-left text-white font-medium">Clave</th>
                            <th className="px-6 py-3 text-left text-white font-medium">Nombre del curso</th>
                            <th className="px-6 py-3 text-left text-white font-medium">Nivel</th>
                            <th className="px-6 py-3 text-left text-white font-medium">Creditos</th>
                            <th className="px-6 py-3 text-center text-white font-medium">Competencias</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {cursos.map((curso) => (
                            <tr key={curso.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {curso.clave}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {curso.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {curso.nivel === "E" ? "Electivo" : `${curso.nivel}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                    {curso.creditos.toFixed(1)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    <button
                                        className="transform transition-transform duration-100 active:scale-95 hover:scale-105"
                                        onClick={() => changeButton(curso)}
                                    >
                                        <img className="w-8 h-8 mx-auto" src={Eye} alt="Competencias" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                <TableIndexPaginacion
                    count={totalPages}
                    current={currentPage}
                    actionSelection={handlePageChange} // Función para cambiar de página
                />
            </div>
        </div>
    );
}
