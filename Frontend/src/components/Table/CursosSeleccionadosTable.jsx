import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableContainer
}
from "./Table"
import { Bar } from "../Bars/Bar"
import {TrashIcon} from "../grilla/GridIcons"
import { useMatricula } from "../../context/MatriculaContext"
import { useState } from "react"
import { PopupWarning } from "../Pop-up/Question/PopupWarning"
import { PopupConfirm } from "../Pop-up/Question/PopupConfirm"
import { SpinnerLoading } from "../Pop-up/SpinnerLoading"
import PopupSuccess from "../Pop-up/Response/SucessPopUp"
import { PopUpError } from "../Pop-up/Response/Errror"
export const CursosSeleccionadosTable = () => {

    const {matriculaData,matriculaFunctions} = useMatricula();
    const {desInscribirCurso} = matriculaFunctions;
    const cursos = matriculaData.cursosInscritos.lineas;

    const [openConfirm,setConfirm] = useState(false);
    const [openSuccess,setOpenSuccess] = useState(false);
    const [openError,setOpenError]  = useState(false);
    const [loadingSpinner,setLoadingSpinner] = useState(false);
    const [lineaSeleccionada,setLineaSeleccionada] = useState(null); //almacena el idLinea


    const closeConfirmPopUp = () => {
        setLineaSeleccionada(null);
        setConfirm(false);
    }
    const openConfirmPopUp = (idLinea) => {
        setLineaSeleccionada(idLinea);
        setConfirm(true);
    }

    const handleConfirmPopUp = async ()=>{
        if(lineaSeleccionada){
            setConfirm(false);
            setLoadingSpinner(true);
            try{
                await desInscribirCurso(lineaSeleccionada);
                setLoadingSpinner(false);
                setOpenSuccess(true);
            }
            catch(error){
                //puede aparece un pop up aca
                setLoadingSpinner(false);
                setOpenError(true);
                console.log("Error");
            }
        }
        else{
            closeConfirmPopUp();
        }
    }

    return(
        <>
        <Bar>
            <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                       <TableCell type="head">Clave/Horario</TableCell>
                       <TableCell type="head">Nombre del curso</TableCell>
                       <TableCell type="head">Créditos</TableCell>
                       <TableCell type="head">Horario</TableCell>
                       <TableCell type="head">Pos. relativa</TableCell>
                       <TableCell type="head">Docente</TableCell>
                       <TableCell type="head">Sesiones</TableCell>
                       <TableCell type="head">Borrar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                    cursos.length > 0 &&(
                        cursos.map((curso,i) =>{
                            const isMatricula = curso.seleccionado; //si tiene posRel
                            return  (<TableRow type="body" key={curso.id}>
                                <TableCell type="body">{curso.clave}</TableCell>
                                <TableCell type="body">{curso.nombre}</TableCell>
                                <TableCell type="body" className="text-center">{curso.creditos}</TableCell>
                                <TableCell type="body" className="text-center">{curso.horario}</TableCell>
                                <TableCell type="body" className={`text-center font-bold ${!isMatricula ? (curso.posicionrelativa > curso.numVacantes ? "text-rose-400" : "text-green-500") : ""}`} >{
                                    `${isMatricula ? "-/-" : `${curso.posicionrelativa}/${curso.numVacantes}`}`}
                                </TableCell>
                                <TableCell type="body" className="text-center">{curso.profesor}</TableCell>
                                <TableCell type="body" className="text-center">{curso.numHoras} hrs</TableCell>
                                <TableCell type="body" className="flex justify-center">
                                    <button className={isMatricula ? "opacity-50 cursor-default" :`transform transition-transform duration-100 active:scale-95 hover:scale-105`}
                                    onClick={!isMatricula ? ()=>openConfirmPopUp(curso.idLinea): null}>
                                        <TrashIcon />
                                    </button>
                                </TableCell>
                            </TableRow>)
                        }))
                    }
                </TableBody>
            </Table>
            </TableContainer>
        </Bar>
        <PopupConfirm 
        isOpen={openConfirm}
        text="¿Está seguro de querer salir de este curso?"
        onCancel={closeConfirmPopUp}
        onConfirm={handleConfirmPopUp}/>
        {loadingSpinner && <SpinnerLoading />}
        {<PopupSuccess 
        isOpen={openSuccess}
        text="Fue retirado del curso existosamente!"
        onContinue={()=>setOpenSuccess(false)}
        className="w-80" />}
        {
        <PopUpError
        isOpen={openError}
        className="w-80"
        onContinue={()=>setOpenError(false)}
        text="Lo sentimos, ocurrió un problema al realizar la desinscripcion"
        />
        }
        </>
    )
}
