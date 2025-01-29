import { Bar,BarOption } from "../../components/Bars/Bar"
import { useMatricula } from "../../context/MatriculaContext"
import { useLocation } from "react-router-dom";
import { TableBody, TableContainer, TableHead,Table,TableCell,TableRow } from "../../components/Table/Table";
import { LoadingLayout } from "../../components/Layout/Layout";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";
import { getTotalAlumnos } from "../../services/userServices";
import { useState, useEffect } from "react";

export const ResultadosMatricula = () =>{
    const location = useLocation();
    const {periodo} = location.state || {};
    const [totalAlumnos, setTotalAlumnos] = useState(null); 
    
    const contextoMatricula  = useMatricula();
    if(!contextoMatricula)return null;

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
    
    const {matriculaData,trayectoria,userInfo,loadingData} = contextoMatricula;
    if(!userInfo.userInformation || loadingData.inscritos || !trayectoria || !periodo)
        return <LoadingLayout/>
    
    const {cursosInscritos} = matriculaData;

    return(
        <AnimatedContainer>
        <div className="p-4  rounded-lg w-full max-w-6xl mx-auto">
        <div className="flex flex-col gap-3">
        <Bar className="gap-4 lg:grid-cols-4 md:grid-cols-2 ">
            <BarOption title="Ciclo de matrícula" result={periodo}/>
            <BarOption title="Alumno" result={userInfo.getName() + ` (${userInfo.userInformation.codigo})`} />
            <BarOption title="Factor de desempeño" result={trayectoria.factorDeDesempeno}/>
            <BarOption title="Turno de matricula" result={`${trayectoria.turnoOrdenMatricula} de ${totalAlumnos}`}/>
        </Bar>
        <hr className="border-3" />
        <Bar>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell type="head">Clave</TableCell>
                            <TableCell type="head">Nombre del curso</TableCell>
                            <TableCell type="head">Créditos</TableCell>
                            <TableCell type="head">Horario</TableCell>
                            <TableCell type="head">Estado</TableCell>
                            <TableCell type="head">Docente</TableCell>
                            <TableCell type="head">Sesiones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                          cursosInscritos?.lineas?.length >0 && (cursosInscritos?.lineas?.map(curso =>{
                                const matriculado = curso.seleccionado;
                               return <TableRow type="body" key={curso.id}>
                                    <TableCell type="body">{curso.clave}</TableCell>
                                    <TableCell type="body">{curso.nombre}</TableCell>
                                    <TableCell type="body" className="text-center">{curso.creditos}</TableCell>
                                    <TableCell type="body" className="text-center">{curso.horario}</TableCell> 
                                    <TableCell type="body" className={`text-center font-bold ${matriculado ? "text-green-500" : "text-rose-400"}`}>
                                        {matriculado ? "Matriculado" : "Sin vacante"}
                                    </TableCell>
                                    <TableCell type="body" className="text-center">{curso.profesor}</TableCell>
                                    <TableCell type="body" className="text-center">{curso.numHoras} hrs</TableCell>  
                                </TableRow>
                            }))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Bar>
        </div>
        </div>
        </AnimatedContainer>
    )
}