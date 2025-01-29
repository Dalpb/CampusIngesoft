import { createContext,useContext, useState,useEffect } from "react";
import {useCourseTeacher} from "./ScheduleTeacherContext";

const courseContext = createContext(null);

export const ScheduleTeacherProvider = ({children}) =>{
    const {scheduleTeacher, periods, changeCoursesByCicle}  = useCourseTeacher();
    const getCoursesTeacher = async(idTeacher,cicle = null) =>{
        try{
            const courses = await coursesByTeacher(idTeacher,cicle);
            setScheduleTeacher(courses);
            console.log(courses);
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
        }catch(error){
            console.error("Error en obtener los periodos");
        }
    }

    useEffect(()=>{
        if(userInformation){  //esperamos a que cargue
            getPeriodsTeacher();
            getCoursesTeacher(userInformation.id);
        }
    },[userInformation]) 


  
    return (
        <ScheduleTeacherContext.Provider value={
            {scheduleTeacher,
            periods,
            changeCoursesByCicle
        }}>
            {children}
        </ScheduleTeacherContext.Provider>
    )
}

export const useCourseTeacher = ()=>{
    return useContext(ScheduleTeacherContext);
}