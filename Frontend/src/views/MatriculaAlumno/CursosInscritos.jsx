import {
    Bar,
    BarOption
} from "../../components/Bars/Bar"
import {
    useLocation,
    useNavigate
} from "react-router-dom";
import { useMatricula } from "../../context/MatriculaContext";
import { LoadingLayout } from "../../components/Layout/Layout";
import { EmptyInscriptionCourse } from "../../components/grilla/GridIcons";
import { Button } from "../../components/Button/Button";
import { CursosSeleccionadosTable } from "../../components/Table/CursosSeleccionadosTable";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";
import { useState, useEffect } from "react";
import { getTotalAlumnos } from "../../services/userServices";

export const CursosInscritos = () =>{
    const location = useLocation();
    const navigate = useNavigate();
    const {periodo} = location.state || {};
    const contextoMatricula = useMatricula();
    const [totalAlumnos, setTotalAlumnos] = useState(null);

    useEffect(() => {
        const fetchTotalAlumnos = async () => {
            try {
            const total = await getTotalAlumnos();
            setTotalAlumnos(total); // Guarda el total de alumnos
            } catch (error) {
            console.error('Error al obtener el total de alumnos:', error);
            }
        };
        fetchTotalAlumnos();
    }, []);

    if(!contextoMatricula)return null;
    
    const goToSeleccionCursos =() => navigate("/alumno/matricula/inscripcion/seleccion-cursos",{state:{...location.state, creidtosIncritos :creditosData.credIns}});
    
    const {
        matriculaData,
        creditosData,
        cantidaData,
        loadingData,
        trayectoria,
        userInfo
        }= contextoMatricula;


    if(!userInfo.userInformation || loadingData.inscritos || !trayectoria ) //si los datos de cursos matricula e inscritos aun cargan de la bd
        return <LoadingLayout msg="Cargando datos de matrícula"/>
    
    return (
        <AnimatedContainer>
     <div className="p-4  rounded-lg w-full max-w-6xl mx-auto">
        <div className="flex flex-col gap-3">
        <Bar className="gap-4 lg:grid-cols-4 md:grid-cols-2 ">
            <h1 className="text-3xl  font-bold md:text-left text-center text-[#060C37]
                lg:col-span-4 md:col-span-2" >Datos del alumno</h1>
                {/* Necesito el endpoint del ultimo ciclo */}
            <BarOption title="Ciclo de matrícula" result={periodo}/>
            <BarOption title="Alumno" result={userInfo.getName() + ` (${userInfo.userInformation.codigo})`} />
            <BarOption title="Factor de desempeño" result={trayectoria.factorDeDesempeno}/>
            <BarOption title="Turno de matricula" result={`${trayectoria.turnoOrdenMatricula} de ${totalAlumnos}`}/>
        </Bar>
        <hr className="border-3" />
        <Bar className="gap-4 lg:grid-cols-5 md:grid-cols-3 ">
        <h1 className="text-3xl  font-bold  md:text-left text-center text-[#060C37]
            lg:col-span-5 md:col-span-3">Mis datos de matrícula</h1>
            <BarOption title="Cursos inscritos" result={cantidaData.cantIns}/>
            <BarOption title="Créditos inscritos" result={creditosData.credIns}/>
            <BarOption title="Cursos matriculados" result={cantidaData.cantMat}/>
            <BarOption title="Créditos matriculados" result={creditosData.credMat} />
            <BarOption title="Créditos totales" result={creditosData.credIns + creditosData.credMat}/>
        </Bar>
        <hr className="border-3" />
        <h1 className="text-3xl  font-bold mb-4 md:text-left text-center text-[#060C37]">Mis cursos inscritos</h1>
        </div>
        {
            matriculaData.cursosInscritos?.lineas.length >0
            ?
            <>
            <div className="flex w-full flex-row-reverse mb-3 ">
            <Button
            txt="Ver cursos disponibles"
            action={goToSeleccionCursos}/>
            </div>
            <CursosSeleccionadosTable />
            </>
            :
            <Bar className="gap-4 md:py-5 md:px-10 lg:grid-cols-2  ">
                <EmptyInscriptionCourse className="justify-self-center"/>
                <div className="self-center flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold tracking-tight text-center text-[#060C37]">Actualmente no estás inscrito en ningún curso. ¡Matricúlate y sigue aprendiendo!</h2>
                    <p className="text-md text-center text-[#757576]">Para comenzar,  inscribase en  nuestros cursos en
                    cursos disponibles</p>
                        <Button
                        txt="Ver cursos disponibles"
                        extraClasses="self-center"
                        action={goToSeleccionCursos}
                        />
                </div>
            </Bar>
        }
     </div>
     </AnimatedContainer>
    )
}