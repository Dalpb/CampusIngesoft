import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Layout, { LoadingLayout, TitleLayout } from "../../components/Layout/Layout";
import { GrillaVistaListadoAlumnosXCurso } from "../../components/grilla/GrillaVistaListadoAlumnosXCurso";
import { ControllerVistaListadoAlumnosXCurso } from "../../components/Controllers/ControllerVistaListadoAlumnosXCurso";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";

export const VistaListadoAlumnosXCurso = () => {
    const {userInformation} = useAuth();
    const location = useLocation();
    const { cursoId,cursoClave, cursoNombre, horarioNumero, periodo,horarioId,periodoId } = location.state || {};
    const [localStudents,setLocalStudents]=useState([])

    console.log("ESTADO ", location.state);

    const [students, setStudents] = useState([]); // Estado para almacenar la lista de estudiantes

    return (
        <AnimatedContainer>
        <div className='md:px-16 px-2 py-4 flex flex-col gap-6'>
            {students.length>0 && (
                <TitleLayout 
                    title={`${cursoClave} - ${cursoNombre}`} 
                    schedule={horarioNumero} 
                    cicle={periodo} 
                />
            )}

            <ControllerVistaListadoAlumnosXCurso cursoId={cursoId} setStudents={setStudents} students={students} horarioId={horarioId} setLocalStudents={setLocalStudents} periodo={periodo}/>
            <GrillaVistaListadoAlumnosXCurso cursoId={cursoId} setStudents={setStudents} students={students}
            horarioId = {horarioId} localStudents={localStudents} setLocalStudents={setLocalStudents} periodoId={periodoId}/>
        </div>
        </AnimatedContainer>
    );
};