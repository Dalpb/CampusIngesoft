import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate
        ,useLocation,
        Link } from 'react-router-dom';
import DashboardGestor from '../../components/Dashboard/DashboardGestor';
import { DirectIcon, PermitidosIcon, PreMatriculaIcon, ResultMatriculaIcon } from '../../components/Button/ButtonImage';
import { ButtonAnchor } from '../../components/Button/ButtonSpecial';
import { getInformacionCampus, getUltimoPeriodo } from '../../services/matricula.service';
import {Table,TableContainer,TableHead,TableCell,TableBody,TableRow} from "../../components/Table/Table";
import {Bar} from "../../components/Bars/Bar";
import { LoadingLayout } from '../../components/Layout/Layout';
import { transformarFecha } from '../../utils/transformarFecha';
import { AnimatedContainer } from '../../components/Layout/AnimatedContainer';
const eventos = [
  { evento: "Publicación de las cursos y horarios", fecha: "Jueves, 16 agosto de 2024" },
  { evento: "Inicio y cierre de la prematrícula", fecha: "Desde el lunes 5 hasta el jueves 8 de agosto del 2024" },
  { evento: "Publicación de cursos matriculados en prematrícula", fecha: "Viernes, 9 de agosto del 2024" },
  { evento: "Inicio y cierre de la matrícula extemporánea", fecha: "Desde el lunes 12 hasta el martes 13 de agosto del 2024" },
  { evento: "Publicación de cursos matriculados en matrícula extemporánea", fecha: "Jueves, 16 de agosto del 2024" },
];

export function DashboardMatricula() {

  const { userInformation,obtenerEstado,EstadosMatricula } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const estado  = obtenerEstado();
  const esExtemporanea = estado !== EstadosMatricula.MATRICULA && estado !==EstadosMatricula.PUBMATRICULA  &&estado !== EstadosMatricula.PREMATRICULA;
  const muestraResultados = estado === EstadosMatricula.PUBMATRICULA || estado === EstadosMatricula.PUBMATRICULAEXT;
  const [periodoMatricula,setPeriodoMatricula] = useState(null);  //lo obtengo desde una llamada al back, información de matricula
  const [infoMatricula,setInfoMatricula] = useState(null);

  useEffect(() => {
    const obtenerUltimoPeriodo = async () => {
      const infoPeriodo = await getUltimoPeriodo();
      console.log(infoPeriodo);
      setPeriodoMatricula(infoPeriodo);
    }
    const obtenerInformacionMatricula = async () =>{
      const infoMatricula = await getInformacionCampus();
      console.log(infoMatricula);
      console.log("Dadsad  ",transformarFecha(infoMatricula[0].fin));
      const infoTransform = infoMatricula.map(info =>{
        const item = {};
        for(const [key,value] of Object.entries(info)){
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            item[key] = transformarFecha(value);
          }
        }
        return item;
      })
    console.log(infoTransform[0]);
    setInfoMatricula(infoTransform[0]);
    }
    obtenerInformacionMatricula();
    obtenerUltimoPeriodo();
  },[]);  
  //carga hasta que obtengan datos del usuario y de la matricula
  if (!userInformation || !periodoMatricula || !infoMatricula) 
      return <LoadingLayout msg='Cargando matrícula'/>
  
  return (
      <AnimatedContainer>
      <div className="p-6 mt-0 px-0 rounded-lg w-full max-w-6xl mx-auto">
        <h1 className="text-3xl text-center font-bold mb-4"> {`
        ${!esExtemporanea ? "Matrícula" : "Matrícula Extemporanea"}
        ${periodoMatricula[0]?.periodo}`}</h1> 
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="bg-clrNavbar text-white font-semibold px-4 py-4 rounded-t-md mb-6">
            <h2 className="text-2xl">Inicio de matrícula</h2>
            <p className="text-white/80">Acciones Para la matrícula</p>
          </div>
          <article className='grid gap-4'>
            <ButtonAnchor
            title="Cursos Permitidos"
            subtitle='Observa los nuevos cursos que puedes acceder'
            goTo='/alumno/CursosPermitidos'>
              <PermitidosIcon/>
            </ButtonAnchor>

            <ButtonAnchor
              title="Iniciar matrícula"
              subtitle="Iniciar el proceso tu matrícula en este ciclo"
              goTo="/alumno/matricula/inscripcion"
              disable={
                estado === "Prematricula" ||
                estado === "Publicacion Matricula" ||
                estado === "Publicación Mat. Ext"
              }
              
              state={{ ...location.state, periodo: periodoMatricula[0].periodo }}
            >
              <PreMatriculaIcon />
            </ButtonAnchor>

            <ButtonAnchor
            title="Resultados de matrícula"
            subtitle='Verificar los cursos que obtuviste vacante'
            goTo='/alumno/matricula/inscripcion/resultados'
            disable ={!muestraResultados}
            state={{...location.state,periodo: periodoMatricula[0].periodo}}
            >
              <ResultMatriculaIcon/>
            </ButtonAnchor>
          </article>
        </section>
        <Bar>
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-900">Acerca de la matrícula</h2>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell type="head" className='text-center'>Eventos</TableCell>
                <TableCell type="head" className='text-center'>Fechas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow type='body'>
                <TableCell className="font-semibold text-gray-800 ">Publicación de cursos Permitidos</TableCell>
                <TableCell>{`El ${infoMatricula?.publicacionDeCursos}`}</TableCell>
              </TableRow>
              <TableRow  type='body'>
                <TableCell className="font-semibold text-gray-800 ">Inicio y cierre de la matrícula</TableCell>
                <TableCell>{`Desde el ${infoMatricula?.inicioPreMatricula}, hasta el ${infoMatricula?.cierrePreMatricula}`}</TableCell>
              </TableRow >
              <TableRow  type='body'>
                <TableCell className="font-semibold text-gray-800 ">Publicación de cursos matriculados en matrícula</TableCell>
                <TableCell>{`El ${infoMatricula?.publicacionCursosMatInicio}`}</TableCell>
              </TableRow>
              <TableRow  type='body'>
                <TableCell className="font-semibold text-gray-800 ">Inicio y cierre de la matrícula extemporánea</TableCell>
                <TableCell>{`Desde el ${infoMatricula?.inicioMatExtemporanea}, hasta el ${infoMatricula?.finMatExtemporanea}`}</TableCell>
              </TableRow>
              <TableRow  type='body'> 
                <TableCell className="font-semibold text-gray-800 "> Publicación de cursos matriculados en matrícula extemporánea</TableCell>
                <TableCell>{`El ${infoMatricula?.publicacionMatExtemporanea}`}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </Bar>
      </div>
      </AnimatedContainer>
      );
}