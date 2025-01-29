import { createContext,useContext, useState,useEffect,useRef } from "react";
import { coursesByTeacher,getPeriodCourses } from "../services/coursesServices";
import { useAuth } from "./AuthContext";

const ScheduleTeacherContext = createContext(null);

export const ScheduleTeacherProvider = ({children}) =>{
    const {userInformation}  = useAuth();
    const [scheduleTeacher,setScheduleTeacher] = useState([]); //almacena todos los horarios del profesor
    const [scheduleSelect,setScheduleSelect]= useState([]); //almacena el horario seleccionado
    const [students,setStudents] = useState([]);  //alamacena los alumnos del horarario seleccionado
    const [periods,setPeriods] = useState([]); //almacena los periodos
    const [periodo,setPeriod] = useState([]); 
    const [periodoId,setPeriodoId]  = useState(0);

    const getCoursesTeacher = async(idTeacher,cicle = null) =>{
        try{
            const courses = await coursesByTeacher(idTeacher,cicle);
            setScheduleTeacher(courses);
            console.log(idTeacher,cicle,"Cursos del profesor", courses);
        }
        catch(error){
            console.error("Error al cargar los cursos", error);
        }
    }
    const getPeriodsTeacher = async() =>{
        try{
            const periods = await getPeriodCourses();
            const periodsR = periods.reverse();
            setPeriods(periodsR);
            console.log(periodsR);
            const periodo = periodsR[0]["periodo"];; // Obtiene el texto del <option>
            const periodoId = periodsR[0]["id"];
            console.log(periodo);
            console.log(periodoId);
            setPeriodoId(periodoId);
            setPeriod(periodo)
            return periodoId;
        }catch(error){
            console.error("Error en obtener los periodos");
        }
    }
    
    const changeCoursesByCicle = event =>{
        const cicleId = event.target.value;
        const selectedOption = event.target.options[event.target.selectedIndex]; // Obtiene el <option> seleccionado
        const periodoNuevo = selectedOption.text; // Obtiene el texto del <option>
        setPeriod(periodoNuevo);
        setPeriodoId(cicleId);
        console.log(periodo); // Imprime el texto del <option> seleccionado
        console.log(cicleId);
        getCoursesTeacher(userInformation.id,cicleId);
    }


    const selectSchedule = (schedule) =>{
        localStorage.setItem('schedule',JSON.stringify(schedule));
        setScheduleSelect(schedule);
    }


    const selectStudents = (students) =>{
        localStorage.setItem('students',JSON.stringify(students));
        setStudents(students);
    }

    useEffect(()=>{
        const saveScheduleSelected = localStorage.getItem('schedule');
        const saveStudents = localStorage.getItem('students');
        if(saveScheduleSelected && saveStudents ){
            setScheduleSelect(JSON.parse(saveScheduleSelected));
            setStudents(JSON.parse(saveStudents));
        }
    },[])

    useEffect(()=>{
        if(userInformation){  //esperamos a que cargue
            getPeriodsTeacher().then(periodo =>
                getCoursesTeacher(userInformation.id,periodo)
            );
        }
    },[userInformation]) 
    



  
    return (
        <ScheduleTeacherContext.Provider value={
            {scheduleTeacher,
            periods,
            periodo,
            periodoId,
            changeCoursesByCicle,
            scheduleSelect,
            selectSchedule,
            students,
            selectStudents
        }}>
            {children}
        </ScheduleTeacherContext.Provider>
    )
}

export const useScheduleTeacher = ()=>{
    return useContext(ScheduleTeacherContext);
}