import { useEffect,useState } from "react";
import SearchBar from "../../components/Bars/SearchBar";
import Layout from "../../components/Layout/Layout.jsx";
import { useAuth } from "../../context/AuthContext";
import { coursesByTeacher, getPeriodCourses, getStudentsList } from "../../services/coursesServices";
import CursosGrid from "../../components/grilla/grillaCursosProfe";
import { useScheduleTeacher } from "../../context/ScheduleTeacherContext.jsx";
import { motion } from "framer-motion";

export function MainProfesor(){
    
    const {userInformation,getName} = useAuth();
    const {scheduleTeacher,periods,periodo,periodoId,changeCoursesByCicle} = useScheduleTeacher();
    const [credits,setCredits] = useState(0);
    const [horarios,setHorarios] = useState(0);
    const [activos,setActivos]= useState(0);
    const [students,setStudents] = useState([]);
    const getStudentsListCourse = async (horarioId,periodoId) => {
        try {
            const sl = await getStudentsList(horarioId,periodoId);
            return sl

        } catch (error) {
            console.error("Error en obtener los estudiantes");
        }
    };
    function totalCredits(coursesTeacher){
        const total = coursesTeacher.reduce((acum,current) =>{
            return acum + (current.horarios.length)*current.creditos;},0)
        return total;
    }
    
    function totalHorarios(coursesTeacher){
        const total = coursesTeacher.reduce((acum,current) => acum+current.horarios.length,0);
        return total;
    }
    useEffect(() => {
        if (scheduleTeacher) {
            const updateSchedule = async () => {
                await Promise.all(
                    scheduleTeacher.map(async (element) => {
                        try {
                            console.log("element")
                            const sl = await getStudentsListCourse(element.horarios[0].id,periodoId);
                            console.log(sl)
                            if(sl){
                                const activos = sl.filter(student => !student.retirado).length;
                                console.log("activos")
                                console.log(activos)
                                setActivos(activos);
                            }

                        } catch (error) {
                            console.error("Error al obtener los estudiantes para el horario:", element.id, error);
                        }
                    })
                );
                console.log("Schedule actualizado:", updatedSchedule);
            };
            updateSchedule();
        }
    }, [scheduleTeacher, periodoId]);
    

    if (!userInformation) {
        return <div>Cargando datos del usuario...</div>; // until loading
    }
    
    return(
        <motion.div
            className='md:px-16 px-2 py-4 flex flex-col gap-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mt-7 mx-12 flex flex-col gap-6 items-center">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text self-start">Detalle de cursos a cargo</h1>
                <div className="bg-white h-16 w-full rounded-2xl shadow-xl flex justify-between items-center px-10">
                    <div className="flex gap-6">
                        <div className="flex flex-col text-[#A3A3A3] font-semibold">
                            Ciclo
                            <select id="cicle"
                                className="border border-solid border-[#CBD5E1] rounded-md px-2 py-1 font-bold text-black text-sm bg-white"
                                onChange={changeCoursesByCicle} value={periodoId}>

                                {
                                    periods.map((period) =>(
                                        <option value={period.id} key={period.id}>
                                            {period.periodo}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="flex flex-col text-[#A3A3A3] font-semibold ">
                            Profesor
                            <span className="text-black">{`${userInformation.nombre} ${userInformation.primerApellido} ${userInformation.segundoApellido}`}</span>
                        </div>
                    </div>
                    <div className="flex gap-7">
                        <div className="flex flex-col text-[#A3A3A3] font-semibold items-center">
                            Horarios
                            <span className="text-black">{horarios}</span>
                        </div>
                        <div className="flex flex-col text-[#A3A3A3] font-semibold items-center">
                            CrÃ©ditos
                            <span className="text-black">{credits}</span>
                        </div>
                    </div>
                </div>
                <CursosGrid cursos={scheduleTeacher} activos={activos}/>
            </div>
        </motion.div>
    )
}