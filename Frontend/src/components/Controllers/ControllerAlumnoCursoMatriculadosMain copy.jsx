import { useEffect, useState } from "react";
import { coursesByStudent, periodByStudent } from "../../services/studentServices";
import { getCountCursos } from "../../services/coursesServices";

export function ControllerAlumnoTrayectoriaAcademica({ userInformation,trayectoryInfo}) {
    const [totalCreditos, setTotalCreditos] = useState(0);
    const [localTrayectory,setLocalTrayectory] = useState(0);
    const [totalCursosFacultad, setTotalCursosFacultad] = useState(0);
    const [totalAprobados, setTotalAprobados] = useState(0);
    const [porcentajeAprobados, setPorcentajeAprobados] = useState(0); 

    const cargarCantidadCursos = async () => {
        const total_cursos = await getCountCursos()
        setTotalCursosFacultad(total_cursos)
    }

    const cargarCantidadCursosAprobados = async () =>{

    }

    useEffect(() => {
        //console.log("sii", trayectoryInfo)
        //console.log("user information: ",userInformation)
        if (trayectoryInfo) {
            //console.log("entro");
            setLocalTrayectory(trayectoryInfo)
            // Calcula la suma de los créditos aprobados

            const sumaCreditos = trayectoryInfo.creditosPrimera + trayectoryInfo.creditosSegunda + trayectoryInfo.creditosTercera;
            setTotalCreditos(sumaCreditos);
            cargarCantidadCursos()
            console.log("total aprobados: ", trayectoryInfo.asignaciones_con_nota_mayor_10_5)
            setTotalAprobados(trayectoryInfo.asignaciones_con_nota_mayor_10_5);
            console.log("total cursos facultad",totalCursosFacultad);
            if (totalAprobados > 0 && totalCursosFacultad > 0) {
                // Hallar el porcentaje de cursos aprobados
                
                //setTotalAprobados(trayectoryInfo.asignaciones_con_nota_mayor_10_5);
                const porky = Math.floor(
                    (trayectoryInfo.asignaciones_con_nota_mayor_10_5 / totalCursosFacultad) * 100
                );
                setPorcentajeAprobados(porky);
                console.log("porcentaje aprobados: ",porcentajeAprobados);
            }
            //cargarCantidadCursosAprobados()
            /* Hallar el porcentaje de cursos aprobados*/
            //console.log("trayectory: ", trayectoryInfo)
            const porky = Math.floor((trayectoryInfo.asignaciones_con_nota_mayor_10_5 / totalCursosFacultad) * 100)
            setPorcentajeAprobados(porky);

        }
    }, [trayectoryInfo,totalCursosFacultad]);
    /*
    useEffect(() => {
        
    }, [localTrayectory, totalCursosFacultad]);*/

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto w-full">
            
            <h2 className="text-lg font-bold mb-2">Trayectoria Académica</h2>
            <p className="text-sm text-gray-600 mb-6">
                Sistema de Gestión de Matrícula - Ingeniería Informática
            </p>
            
            <div className="space-y-6">
                {/* Alumno Section */}
                <div>
                    <p className="text-gray-500 text-sm">Alumno</p>
                    <p className="text-base font-semibold">{userInformation.nombre} {userInformation.primerApellido} {userInformation.segundoApellido}</p>
                </div>

                {/* Créditos Section */}
                <div>
                    <p className="text-gray-500 text-sm">Créditos aprobados</p>
                    <p className="text-base font-semibold">{totalCreditos}</p>
                </div>

                {/* Cursos Section */}
                <div>
                    <p className="text-gray-500 text-sm">Cursos aprobados/Cursos Totales</p>
                    <p className="text-base font-semibold">{totalAprobados}/{totalCursosFacultad}</p>

                    <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
                        <div className="bg-bgLoginOne h-full rounded-full" style={{ width: `${porcentajeAprobados}%`}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
