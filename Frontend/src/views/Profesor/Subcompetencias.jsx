import { ButtonSpecial } from "../../components/Button/ButtonSpecial";
import { InputText } from "../../components/Inputs/InputText";
import Layout, { LoadingLayout, TitleLayout } from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { json, useLocation } from "react-router-dom";
import { useEvaluation } from "../../context/EvaluationContext";
import { useScheduleTeacher } from "../../context/ScheduleTeacherContext";
import { SubCompetitionTeacher } from "../../components/Table/SubCompetitionTeacher";
import { useEffect, useState } from "react";
import { getCompetitionNotes } from "../../services/coursesServices";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";

export function SubCompetencias(){
    const location = useLocation();
    const {userInformation} = useAuth();
    const {competitionSelect} = useEvaluation(); //información de competencia seleccionada
    const {cursoId,cursoClave,cursoNombre, horarioNumero,periodo,horarioId,compId,periodoId } = location.state || {};
    const [competitionNotes,setCompetitionNotes] = useState([]); //contiene competencias por indice
    const [notesByIndex,setNotesByIndex] = useState([]); //contiene por indice
    const [itsLoading,setItsLoading] = useState(false);
    const [indexEvaluation, setIndexEvaluation] = useState(1); //maneja el cambio de estado ne indexEvaluation

    
    const getNotes = async() =>{
        setItsLoading(true);
        try{
            const newCompNotes = await getCompetitionNotes(horarioId,compId,indexEvaluation,periodoId);
            console.log("subcompe",newCompNotes);
            setCompetitionNotes(newCompNotes);
        }catch(error){
            console.error("No se obtuvo las notas de la competencia");
            setCompetitionNotes([]);
        }
        finally{
            setItsLoading(false);
        }
    }

    const handleChange = e =>{
        const value = e.target.value;
        setIndexEvaluation(parseInt(value));
    }

    useEffect(()=>{
      if(userInformation && indexEvaluation){
        setCompetitionNotes([]);
        console.log("parametros: ", horarioId,compId,indexEvaluation);
        getNotes();
      }
    },[userInformation,indexEvaluation])
    
    if (!userInformation || itsLoading ) {
        return <LoadingLayout msg="Cargando las notas de competencias de la evaluación"/>
    }
    if(competitionNotes.length<=0 && !itsLoading){
        return <p>Ya no hay nada</p>
    }
    return (
        <AnimatedContainer>
        <div className="md:px-16 px-2 py-4 flex flex-col gap-6">
            <TitleLayout
            title={`${cursoClave} - ${cursoNombre}`}
            subtitle={`${competitionSelect.clave} - ${competitionSelect.nombre} - 
            ${competitionSelect.cantidadEvaluaciones === indexEvaluation ? "Evaluación final":`Evaluación ${indexEvaluation}`}`}
            cicle={periodo}
            schedule={horarioNumero}
            />
            <form className="bg-white w-full md:p-4 p-2 rounded-lg shadow-xl flex flex-row-revese  justify-between items-center gap-6"
            >
                <div className="flex gap-5 h-11 items-center">
                    <span className="font-semibold">
                        Calificaciones de <br/>la evaluación : 
                    </span>
                    <select className="border border-solid border-[#CBD5E1] rounded-md px-2 py-1  text-black text-sm bg-white self-stretch w-56"
                    onChange={handleChange}   >
                        {
                            [...Array(competitionSelect.cantidadEvaluaciones)].map((_,i) =>(
                                <option key={`Eval${i}`} value={i+1} selected={i+1 === indexEvaluation} >
                                    {competitionSelect.cantidadEvaluaciones -1 !== i ? `Evaluación ${i+1}`: "Evaluación final"}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </form>
            <SubCompetitionTeacher
            content = {competitionNotes}
            indexEvaluation={indexEvaluation}
            horarioId ={horarioId}
            competitionId= {competitionSelect.idCompetencia}
            />
        </div>
        </AnimatedContainer>
    )
}