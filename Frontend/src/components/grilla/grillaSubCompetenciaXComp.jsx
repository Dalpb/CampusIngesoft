import { useTableFilter } from '../../hooks/useTableFilter';
import { useEffect } from 'react';
import { getSubcompetenciasXCompetencia } from '../../services/evaluationServices';
import { useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import edit_pen from '../../assets/edit_pen.svg'; // Asegúrate que la ruta sea correcta
import trash_can from '../../assets/trash_can.svg'; // Asegúrate que la ruta sea correcta
import list from '../../assets/list.svg'; // Asegúrate que la ruta sea correcta
import pencil from '../../assets/pencil.svg'
import { TableIndex } from "../Table/TableIndex";
import { EmptyState } from './grillaEmpty';
import React from 'react';
import { Eye } from 'lucide-react';
import { Modal, TitleModal } from '../Pop-up/Modal';
import { LoadingLayout } from '../Layout/Layout';

export function GrillaSubCompetenciaXComp({ compID, setSubCompetencias, subcompetencias, setSubCompetenciasInv }) {
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 10;
    const { actualIndex, totalIndex, tablePartContent, getIndexContent } = useTableFilter({ content: subcompetencias, rowsShow: ITEMS_PER_PAGE });
    const location = useLocation();
    
    const [totalPages, setTotalPages] = useState(null);
    //const [competenciaSeleccionada, setCompetenciaSeleccionada] = useState(null); // Competencia seleccionada

    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
    const [modalContent, setModalContent] = useState(''); // Contenido del modal
    const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial

    const getListaSubcompetencias = async () => {
        setIsLoading(true); // Mostrar LoadingLayout
        try {
            const subcompetenciasLists =  await getSubcompetenciasXCompetencia(compID);
            setSubCompetencias(subcompetenciasLists.subcompetencias);
            setSubCompetenciasInv(subcompetenciasLists.subcompetencias)
            console.log(subcompetenciasLists)
            //setCompetenciasInv(competenciasLists);
        } catch (error) {
            console.error("Error en obtener las subcompetencias");
        } finally {
            setIsLoading(false); // Ocultar LoadingLayout
        }
    };

    useEffect(() => {
        if(compID){
            getListaSubcompetencias();
            setTotalPages(Math.ceil(subcompetencias.length / ITEMS_PER_PAGE));
        }
    }, []);

    useEffect(() => {
        if (compID) {
            setTotalPages(Math.ceil(subcompetencias.length / ITEMS_PER_PAGE));
        }
    }, [compID, subcompetencias]);

    const openModal = (descripcion) => {
        setModalContent(descripcion); // Establece el contenido del modal
        setIsModalOpen(true); // Abre el modal
    };

    const closeModal = () => {
        setModalContent('');
        setIsModalOpen(false); // Cierra el modal
    };

    if (isLoading) {
        return (
            <div className="mt-8">
                {/* <LoadingLayout msg="Cargando subcompetencias..." /> */}
            </div>
        );
    }

    if (!subcompetencias || subcompetencias.length === 0) {
        return (
            <EmptyState mainMessage={"No se encontraron subcompetencias"} secondaryMessage={"Borre los filtros o agregue subcompetencias para esta compentencia"}/>
        );
    }
    
    /*
    const changeButton = async (competencia) => {
        try {
            const subcompetenciasData = await getSubcompetencias(competencia.id);
            setSubCompetencias(subcompetenciasData); // Guarda las subcompetencias
            setCompetenciaSeleccionada(competencia.id); // Marca la competencia seleccionada
        } catch (error) {
            console.error("Error al obtener las subcompetencias:", error);
        }
    };
    */

    const updateButton = (subcompetencia) => {
    
        navigate("/SubCompetenciaEditar", {
            state: { 
                subcompetencia: subcompetencia,
            }
        });
    };


    const deleteButton = (subcompetencia) => {
    
        
    };


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
                            <th className="px-6 py-3 text-left text-white font-medium">Descripcion</th>
                            {/* <th className="px-6 py-3 text-center text-white font-medium">Opciones</th> */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tablePartContent.map((subcompetencia) => (
                            <React.Fragment key={subcompetencia.id}>
                                {/* Fila principal de competencia */}
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-500">
                                        {subcompetencia.clave}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                                        {subcompetencia.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500 text-center">
                                        <button
                                            className="flex items-center justify-center w-8 h-8 rounded-full hover:text-bgLoginOne transition-transform duration-200 hover:scale-110"
                                            onClick={() => openModal(subcompetencia.descripcion)} // Abre el modal con la descripción
                                        >
                                            <Eye />
                                        </button>
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        <button className="transform transition-transform duration-100 active:scale-95 hover:scale-105" onClick={() => updateButton(subcompetencia)}>
                                            <img className='w-6 h-6 mx-auto' src={pencil} alt="edition" />
                                        </button>
                                        <button className="transform transition-transform duration-100 active:scale-95 hover:scale-105" onClick={() => deleteButton(subcompetencia)}>
                                            <img className='w-6 h-6 mx-auto' src={trash_can} alt="Delete icon" />
                                        </button>
                                    </td> */}
                                </tr>
                                
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                <TableIndex count={totalPages} actionSelection={getIndexContent} />
            </div>
            {/* Modal para mostrar la descripción */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <TitleModal title="Descripción de la Subcompetencia" />
                <p className="text-gray-700 text-sm leading-relaxed">{modalContent}</p>
            </Modal>
        </div>
    );
}
