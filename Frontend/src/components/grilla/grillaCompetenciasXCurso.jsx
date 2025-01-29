
import { useTableFilter } from '../../hooks/useTableFilter';
import { TableIndex } from '../../components/Table/TableIndex';
import { useEffect } from 'react';
import { getCompetenciasXCurso } from '../../services/coursesServices';
import { useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import edit_pen from '../../assets/edit_pen.svg'; // Asegúrate que la ruta sea correcta
import trash_can from '../../assets/trash_can.svg'; // Asegúrate que la ruta sea correcta
import list from '../../assets/list.svg'; // Asegúrate que la ruta sea correcta
import pencil from '../../assets/pencil.svg'
import { EmptyState } from './grillaEmpty';
import { LoadingLayout } from '../Layout/Layout';
import { Modal, TitleModal} from '../Pop-up/Modal';
import { Eye } from 'lucide-react';
import { MoreCourseIcon } from './GridIcons';

export function GrillaCompetenciasXCurso({ periodo = '', cursoId, setCompetencias, competencias , setCompetenciasInv }) {
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 10; // Cantidad de estudiantes por página (ajusta según necesites)
    console.log(competencias)
    const { actualIndex, totalIndex, tablePartContent, getIndexContent } = useTableFilter({ content: competencias, rowsShow: ITEMS_PER_PAGE });
    const location = useLocation();
    console.log(competencias);
    const [totalPages, setTotalPages] = useState(null)
    // Función para obtener los estudiantes del curso

    const [isLoading, setIsLoading] = useState(true); // Estado de carga

    // Estado para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    
    const getListaCompetencias = async () => {
        setIsLoading(true); // Activa el estado de carga
        try {
            const competenciasLists = await getCompetenciasXCurso(cursoId);
            setCompetencias(competenciasLists.competencias); // Guardar la lista de estudiantes en el estado
            setCompetenciasInv(competenciasLists.competencias)
            console.log(competenciasLists)
        } catch (error) {
            console.error("Error en obtener las competencias");
        } finally {
            setIsLoading(false); // Desactiva el estado de carga
        }
    };


    useEffect(() => {
        if(cursoId){
            getListaCompetencias();
            setTotalPages(Math.ceil(competencias.length / ITEMS_PER_PAGE));
        }
    }, []);

    useEffect(() => {
        if (cursoId) {
            setTotalPages(Math.ceil(competencias.length / ITEMS_PER_PAGE));
        }
    }, [cursoId, competencias]);


    const infoViewButtonDescripcion = (descripcion) => {
        setModalContent(descripcion); // Establece la descripción de la competencia en el modal
        setIsModalOpen(true); // Abre el modal
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent('');
    };
    // Calcular la cantidad total de páginas

    const infoViewButton = (competencia) => {
        console.log("Competencia seleccionada: ", competencia);
        navigate(`/director/${periodo}/cursos/visualizar/${cursoId}/VistaCompetencias/${competencia.id}/vistaSubcompetencias/`, {
            state: { 
                ...location.state,
                compID: competencia.id,
                compNombre: competencia.nombre,
                compClave: competencia.clave,
            }
        });
    };

    const updateButton = (competencia) => {
    
        navigate("/CompetenciaEditar", {
            state: { 
                competencia: competencia,
                cursoId: cursoId
            }
        });
    };

    // Priorizar el estado de carga
    if (isLoading) {
        return (
            <div className="mt-8">
                {/* <LoadingLayout msg="Cargando competencias, por favor espere..." />; */}
            </div>
        )
    }

    if (!competencias || competencias.length === 0) {
        return (
            <EmptyState mainMessage={"No se encontraron competencias"} secondaryMessage={"Borre los filtros o agregue competencias para este periodo"}/>
        );
    }


    if(!tablePartContent)
        return <div>Cargando datos</div>

    return  (
        <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto rounded-t-2xl shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-clrTableHead">
                        <tr>
                                <th className="px-6 py-3 text-left text-white font-medium">Clave</th>
                                <th className="px-6 py-3 text-left text-white font-medium">Nombre</th>
                                <th className="px-6 py-3 text-center text-white font-medium">Descripcion</th>
                                <th className="px-20 py-3 text-center text-white font-medium">Ver Subcompetencias</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tablePartContent.map((competencia) => (
                            <tr key={competencia.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {competencia.clave}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                                    {competencia.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                                    {/* Contenedor para centrar el botón Eye */}
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="flex items-center justify-center w-8 h-8 rounded-full hover:text-bgLoginOne transition-transform duration-200 hover:scale-110"
                                            onClick={() => infoViewButtonDescripcion(competencia.descripcion)}
                                        >
                                            <Eye />
                                        </button>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {/* Contenedor para centrar el botón MoreCourseIcon */}
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="transform transition-transform duration-100 active:scale-95 hover:scale-105"
                                            onClick={() => infoViewButton(competencia)}
                                        >
                                            <MoreCourseIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                <TableIndex count={totalPages} actionSelection={getIndexContent} />
            </div>

            {/* Modal para mostrar la descripción */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <TitleModal title="Descripción de la Competencia" />
                <p className="text-gray-700 text-sm leading-relaxed">{modalContent}</p>
            </Modal>
        </div>
    );
}
