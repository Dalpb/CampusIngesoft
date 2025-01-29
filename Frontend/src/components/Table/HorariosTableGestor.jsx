import { useEffect, useState } from "react"
import { Bar } from "../Bars/Bar"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableContainer
} 

from "./Table"
import { Link,useLocation } from "react-router-dom";
import { SelectInput } from "../Inputs/InputText";
import { getHorariosXCurso } from "../../services/coursesServices";
import { EditHorarioPopUp } from "../Pop-up/Horario/EditHorarioPopUp";
import { CreateHorarioPopUp } from "../Pop-up/Horario/CreateHorarioPopUp";
import { DisableIcon, PenIcon } from "./TableIcons";
import { patchDeshabilitarHorario } from "../../services/gestorServices";
import { PopupConfirm } from "../Pop-up/Question/PopupConfirm";
import { CodeSquare } from "lucide-react";
//import { PopupSuccess as popupSuccess1 } from "../Pop-up/Response/Success"
//import { PopupSuccess as popupSuccess2 } from "../Pop-up/Response/SucessPopUp"
import PopupSuccess from "../Pop-up/Response/Success";

export function  HorariosTableGestor({cursos, user}){
    const location  = useLocation();
    const [horariosSelecc,setHorariosSelecc] =  useState([]);
    const [vacantes,setVacantes] =  useState([]);
    const [nombreProfesor,setNombreProfesor] =  useState([]);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isNewPopupOpen, setIsNewPopupOpen] = useState(false);
    const [isDeshabilitarPopupOpen, setIsDeshabilitarPopupOpen] = useState(false);
    const [isExitoPopup, setIsExitoPopup] = useState(false)
    const [selectedData, setSelectedData] = useState({});
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [selectedCurso, setSelectedCurso] = useState({});
    const [selectedHorarioDeshabilitar, setSelectedHorarioDeshabilitar] = useState(null);

    //actulizar los horarios seleccionados
    
    useEffect(() => {
        // Inicializar el estado para cada curso
        const initialData = {};
        cursos.forEach((curso) => {
            if (curso.horarios && curso.horarios.length > 0) {
                const firstHorario = curso.horarios[0]; // Tomar el primer horario
                initialData[curso.id] = {
                    id: firstHorario.numVacantes,
                    clave: firstHorario.claveHorario,
                    vacantes: firstHorario.numVacantes,
                    profesor: firstHorario.profesor,
                    activo: firstHorario.activo,
                };
            }else {
                // Si no hay horarios o se desea incluir la opción de "Nuevo"
                initialData[curso.id] = {}; // Inicializar con objeto vacío
            }
        });
        setSelectedData(initialData);
        console.log(initialData)
    }, [cursos]); // Esto se ejecutará cuando los cursos cambien


    const cambiarHorario = (e, curso) => {
        if (e.target.value === "nuevo") {
            // Si se selecciona "Nuevo", asignar un objeto vacío
            setSelectedData(prevState => ({
                ...prevState,
                [curso.id]: {}
            }));
        }else{
            const selectedHorario = curso.horarios.find(horario => horario.claveHorario === e.target.value);
            if (selectedHorario) {
                setSelectedData(prevState => ({
                    ...prevState,
                    [curso.id]: {
                        id: selectedHorario.id,
                        clave: selectedHorario.claveHorario,
                        vacantes: selectedHorario.numVacantes,
                        profesor: selectedHorario.profesor,
                        activo: selectedHorario.activo,
                    },
                }));
            }
        }
        setSelectedCurso(curso.id)
    }

    const handleEditClick = () => {
        setIsEditPopupOpen(true)
    }

    const handleNewClick = () => {
        setIsNewPopupOpen(true)
    }

    const handleDeshabilitarClick = (cursoId, horarioClave) => {
        const horarioEnc = cursos[cursoId-1].horarios.find(horario => horario.claveHorario === horarioClave)
        setSelectedHorarioDeshabilitar(horarioEnc)
        setIsDeshabilitarPopupOpen(true)
    }

    //para manejar el pop up del lapiz
    const mostrarHorario = (cursoId) => {
        // horario seleccionado del curso
        const horarioActual = selectedData[cursoId];
        //console.log(horarioActual)
        setSelectedHorario(horarioActual)
        setSelectedCurso(cursoId)
        if (Object.keys(horarioActual).length === 0) {
            console.log("Nuevo");
            handleNewClick()
        }else{
            console.log("Tiene datos para editar")
            handleEditClick()
        }
        
    };

    const handleClosePopup = () => {
        setIsEditPopupOpen(false)
        const horarioIndex = cursos[selectedCurso-1].horarios.findIndex(
            horario => horario.claveHorario === selectedHorario.clave
        );

        // Si encuentras el horario, reemplázalo
        if (horarioIndex !== -1) {
            cursos[selectedCurso-1].horarios[horarioIndex].numVacantes = selectedHorario.vacantes;
        }
        //setIsExitoPopup(true)
    }

    const finalizarTask = () => {
        setIsExitoPopup(false)
    }

    const handleClosePopupNew = () => {
        setIsNewPopupOpen(false)
    }

    const handleClosePopupDeshabilitar = () => {
        setIsDeshabilitarPopupOpen(false)
    }
    
    const deshabilitarHorario = async () => {
        try {
            const resp = await patchDeshabilitarHorario(selectedHorarioDeshabilitar.id)
            console.log('Deshabilitado correctamente:', resp);
        } catch (error) {
            console.error('Error al deshabilitar horario', error);
        }
        handleClosePopupDeshabilitar()
        setIsExitoPopup(true)
    };

    return(
        <Bar>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell type="head">Clave del curso</TableCell>
                            <TableCell type="head">Nombre del curso</TableCell>
                            <TableCell type="head">Créditos</TableCell>
                            <TableCell type="head">Vacantes</TableCell>
                            <TableCell type="head">Horarios</TableCell>
                            <TableCell type="head">Profesor</TableCell>
                            <TableCell type="head">Editar</TableCell>
                            <TableCell type="head">Deshabilitar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            cursos.map((curso,indexCurso) =>{
                                const data = selectedData[curso.id] || { vacantes: '-', nombreProfesor: '-' };

                                return(
                                    <TableRow type="body" key={curso.id}>
                                        <TableCell>{curso.clave}</TableCell>
                                        <TableCell>{curso.nombre}</TableCell>
                                        <TableCell className="text-center">{curso.creditos}</TableCell>
                                        <TableCell className="text-center">{data.vacantes}</TableCell>
                                        
                                        {/* Verificamos si el curso tiene horarios antes de mostrar el SelectInput */}
                                        <TableCell>
                                            {curso && curso.horarios && Array.isArray(curso.horarios) && curso.horarios.length > 0 ? (
                                                <SelectInput onchange={e => cambiarHorario(e, curso)} className="border-r-0 border-t-0 border-l-0">
                                                    {curso.horarios.filter(horario => horario.activo === true).map((horario) => (
                                                        <option key={horario.claveHorario} value={horario.claveHorario}>
                                                            {horario.claveHorario}
                                                        </option>
                                                    ))}
                                                </SelectInput>
                                            ) : (
                                                // Si no hay horarios, mostramos un mensaje
                                                <span className="text-sm text-gray-500 italic">No hay horarios disponibles</span>
                                            )}
                                        </TableCell>

                                        <TableCell>{data?.profesor?.nombre} {data?.profesor?.primerApellido}</TableCell>
                                        
                                        {/* Establecemos la visibilidad de los iconos según si hay horarios */}
                                        
                                        <TableCell>
                                            <button onClick={() => mostrarHorario(curso.id)} className={`transform transition-transform duration-100 active:scale-95 hover:scale-105 flex justify-center
                                                ${curso && curso.horarios && Array.isArray(curso.horarios) && curso.horarios.length > 0 ? 'block' : 'hidden'}`}>
                                                <PenIcon />
                                            </button>
                                        </TableCell>
                                        
                                        <TableCell style={{ visibility: curso && curso.horarios && Array.isArray(curso.horarios) && curso.horarios.length > 0 ? 'visible' : 'hidden' }}>
                                            <button onClick={() => handleDeshabilitarClick(curso.id, selectedData[curso.id]?.clave)/*deshabilitarHorario(curso.id, selectedData[curso.id]?.clave)*/} className={`transform transition-transform duration-100 active:scale-95 hover:scale-105 ml-5
                                                ${curso && curso.horarios && Array.isArray(curso.horarios) && curso.horarios.length > 0 ? 'block' : 'hidden'}`}>
                                                <DisableIcon />
                                            </button>
                                        </TableCell>
                                        
                                    </TableRow>
                                )
                            })
                        }

                    </TableBody>
                </Table>
            </TableContainer>
            {/* Modal para editar/crear horarios */}
            {isEditPopupOpen && (
                <EditHorarioPopUp
                isOpen={isEditPopupOpen}
                onClose={handleClosePopup}
                horario={selectedHorario} // Pasamos los datos del horario actual
                setIsExitoPopup={setIsExitoPopup}
                />
            )}
            {isNewPopupOpen && (
                <CreateHorarioPopUp
                isOpen={isNewPopupOpen}
                onClose={handleClosePopupNew}
                cursoId={selectedCurso} // Pasamos los datos del horario actual
                />
            )}   
            {isDeshabilitarPopupOpen && (
                <PopupConfirm
                isOpen={isDeshabilitarPopupOpen}
                onCancel={handleClosePopupDeshabilitar}
                text={"Deshabilitar este horario"}
                onConfirm={deshabilitarHorario}
                />
            )} 
            {isExitoPopup && (
                <PopupSuccess
                    text={"Operacion Exitosa"}
                    onContinue={finalizarTask}
                />   
            )}     
        </Bar>
    )
}