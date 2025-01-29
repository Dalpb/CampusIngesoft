import { ButtonSpecial } from "../../components/Button/ButtonSpecial";
import { InputText } from "../../components/Inputs/InputText";
import Layout, { LoadingLayout, TitleLayout } from "../../components/Layout/Layout"
import { useAuth } from "../../context/AuthContext"
import { CompetitionCourseTable } from "../../components/Table/CompetitionCourseTable";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompetitionSheduleTeacher } from "../../services/coursesServices";
import { useScheduleTeacher } from "../../context/ScheduleTeacherContext";
import { removeTempValuesSubcompetition } from "../../utils/removeLocalStorage";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";
export function CompetenciaCurso(){
    const {userInformation,getName} = useAuth();
    const location = useLocation();
    const {cursoId,cursoClave, cursoNombre, horarioNumero,periodo,horarioId,periodoId} = location.state || {};
    const [competitions,setCompetitions] = useState([]);
    const [shearchName,setSearchName] = useState("");
    const [competitionsFilter,setCompetitionFilter] = useState([]);
    console.log("Horario: ",horarioId);
    console.log(periodoId);

    const getCompetition = async () =>{
        try{
            const newCompetitions = await getCompetitionSheduleTeacher(horarioId,userInformation.id); //ahora no es necesario idusuario
            console.log("Competencias del horario",horarioId,"y el profesor", userInformation.id,newCompetitions);
            console.log("Se obtuvo las competencias ")
            setCompetitions(newCompetitions);
            setCompetitionFilter(newCompetitions);
        }catch(error){
            console.error("No se obtuvo las competencias");
            setCompetitions([]);
        }
    }


    useEffect(()=>{
        if(userInformation){
             //aseguramos no guardar masivamente en el localstorage
              //aseguramos no guardar masivamente en el localstorage
            removeTempValuesSubcompetition();
            getCompetition();

        }
    },[userInformation]);


    const filterByName =() =>{
        if(!shearchName){
            setCompetitionFilter(competitions);
            return ;
        }
        console.log(shearchName);
        const filterCompe = competitions.filter(compe => compe.nombre.includes(shearchName));
        setCompetitionFilter(filterCompe);
    }


    if (userInformation === null || competitions.length <= 0){
        return <LoadingLayout msg="Espera hasta que carguen las competencias"/>
    }
    return(
        <AnimatedContainer>
        <div className="md:px-16 px-2 py-4 flex flex-col gap-6">
            <TitleLayout
            title={`${cursoClave} - ${cursoNombre}`}
            cicle={periodo}
            schedule={horarioNumero}
            />
            <div className="bg-white w-full p-4 rounded-lg shadow-xl flex justify-between items-center ">
            <div className="flex gap-8">
                <div className="sm:w-64" >
                    <InputText
                    label="Nombre de la competencia:"
                    value={shearchName}
                    onchange={e => setSearchName(e.target.value)}
                    name="namecompetition"
                    placeholder="Ejm: Técnica"
                    type="text"
                    description="Ingrese el nombre de la competencia"
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <ButtonSpecial
                    type="Search"
                    submit={false}
                    action={filterByName} />
                </div>
            </div>
            </div>
            <CompetitionCourseTable competitionCourse={competitionsFilter} scheduleId={horarioId}/>
        </div>
        </AnimatedContainer>
    )
}