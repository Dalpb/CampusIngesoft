import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
import { ControllerAlumnoTrayectoriaAcademica } from "../../components/Controllers/ControllerAlumnoCursoMatriculadosMain copy";
import { ReporteTrayectoriaAcademica } from "../../components/Dashboard/ReporteTrayectoriaAcademica";
import {Button} from "../../components/Button/Button"
import { useEffect,useState } from "react";
import { trayectoryByStudent } from "../../services/studentServices";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";

export function VistaTrayectoriaAcademica(){
    const {userInformation} = useAuth();
    const [trayectoryInfo,setTrayectoryInfo]=useState(null)
    
    const getTrayectory = async () => {
        try {
            const studentTrayectoryInfo = await trayectoryByStudent(userInformation.id);
            setTrayectoryInfo(studentTrayectoryInfo)
        } catch (error) {
            console.error("Error en obtener los periodos");
        }
    };
    useEffect(() => {
        if (userInformation) {
            getTrayectory();
        }
    }, [userInformation]);

    if (!userInformation) {
        return <div>Cargando datos del usuario...</div>; // until loading
    }

    return(
        <AnimatedContainer className="max-w-6xl mt-6 mx-auto">
            <div className='md:px-16 px-2 py-4 flex flex-col gap-6 max-w-5xl mx-auto'>
                <ControllerAlumnoTrayectoriaAcademica userInformation={userInformation} trayectoryInfo={trayectoryInfo}/>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="w-full sm:w-auto flex-grow flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    </div>
                    {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <Button txt="Ver cursos permitidos"/>
                    </div> */}
                </div>
                <ReporteTrayectoriaAcademica trayectoryInfo={trayectoryInfo}/>
            </div>
        </AnimatedContainer>
    )    
}
