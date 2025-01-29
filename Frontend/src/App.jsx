import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useLocation 
} from 'react-router-dom'

import './App.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { Login } from './views/Login.jsx'
import Layout, { LayoutDirector, LayoutStudent,LayoutGestor, FinalMatricula } from './components/Layout/Layout.jsx'
import VistaInicioClases from './views/Profesor/VistaInicioClases'
import {ReporteCurso} from './views/Profesor/ReporteCurso.jsx'
import { MainProfesor } from './views/Profesor/MainProfesor.jsx'
import { ScheduleTeacherProvider } from './context/ScheduleTeacherContext.jsx'
import { VistaListadoAlumnosXCurso } from './views/Profesor/VistaListadoAlumnosXCurso'
import { MainAlumno } from './views/Alumno/MainAlumno.jsx'
import { VistaTrayectoriaAcademica } from './views/Alumno/VistaTrayectoriaAcademica'
import { CompetenciaCurso } from './views/Profesor/Competencias.jsx'
import { RouteProtected } from './Routes/RouteProtected.jsx'
import  {VistaRegistrarNotasAlumno} from '../src/views/Profesor/VistaRegistrarNotasAlumno'
import { EvaluationProvider } from './context/EvaluationContext.jsx'
import { SubCompetencias } from './views/Profesor/Subcompetencias.jsx'
import { DetalleNotas } from './views/Alumno/DetalleNotas.jsx'
import {ResultadosMatricula} from './views/MatriculaAlumno/ResultadosMatricula.jsx'
import { DashboardMatricula } from './views/MatriculaAlumno/DashboardMatricula.jsx'
import { SeleccionCursos } from './views/MatriculaAlumno/SeleccionCursos.jsx'
import { MatriculaExtemporanea } from './views/MatriculaAlumno/MatriculaExtemporanea.jsx'
import { PrincipalMatriculaExtemporanea } from './views/MatriculaAlumno/PrincipalMatriculaExtemporanea.jsx'
import { CursosPermitidos } from './views/MatriculaAlumno/CursosPermitidos.jsx'
import { AlumnosPorHorario } from './views/Director/AlumnosPorHorario.jsx'
import { RetiroCursos } from './views/Alumno/RetiroCursos.jsx'
import { ResumenPreMatricula } from './views/Alumno/ResumenPreMatricula.jsx'
import { NotFoundPage } from './views/NotFound.jsx'
import { LayoutProfesor } from './components/Layout/Layout.jsx'
import { ReportesFinalDeCursos } from './views/Profesor/ReportesFinalDeCursos.jsx'
import { VisualizarCursos } from './views/Director/MainDirector.jsx'
import { VistaCompetencias } from './views/Director/VistaCompetencias.jsx'
import { CompetenciaEditar } from './views/Director/CompetenciaEditar.jsx'
import { CompetenciaRegistrar } from './views/Director/CompetenciaRegistrar.jsx'
import { DetalleCompetenciasPorCurso } from './views/Alumno/DetalleCompetenciasPorCurso.jsx'
import { DetalleCalificacionPorCompetencia } from './views/Alumno/DetalleCalificacionPorCompetencia.jsx'
import { SolicitudesRetiro } from './views/Alumno/SolicitudesRetiro.jsx'
import { LogoutProcess } from './views/Logout.jsx'
import { SubcompetenciasXComp } from './views/Director/SubcompetenciasXComp.jsx'
import { SubCompetenciaEditar } from './views/Director/SubCompetenciaEditar.jsx'
import { PanelDirector } from './views/Director/PanelDirector.jsx'
import { MainGestor } from './views/Gestor/MainGestor'
import { VisualizarHorarios } from './views/Director/VisualizarHorarios'
import { CursosInscritos } from './views/MatriculaAlumno/CursosInscritos.jsx'
import { AdministracionHorarios } from './views/Gestor/AdminHorarios.jsx'
import { EdicionCursoHorario } from './views/Gestor/EdicionCursoHorario.jsx'
import { GestionRetiros } from './views/Director/GestionRetiros.jsx'
import { AdministracionMatricula } from './views/Director/AdministracionMatricula.jsx'
import { ListadoAlumnosMatriculados } from './views/Director/ListadoAlumnosMatriculados.jsx' 
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ModoOscuro.jsx'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/all-logout" element={<LogoutProcess/>}/>
        {/* <Route path='/logout' element={} */}
        <Route element= {<RouteProtected rol="alumno"/> }>
        {/* Layout para alumno */}
          <Route element={<LayoutStudent/>}>
            {/*Pantalla principal del alumno matriculado*/}
            <Route path='/alumno/cursos' element={<MainAlumno/>}/>
            {/* Botones Navside*/}
            <Route path='/alumno/TrayectoriaAcademica' element={<VistaTrayectoriaAcademica/>}/>
            <Route path='/alumno/GenerarSolicitudRetiro' element={<RetiroCursos/>}/>
            <Route path='/alumno/CursosPermitidos' element={<CursosPermitidos/>}/>
            <Route path='/alumno/VisualizarSolicitudesRetiro' element={<SolicitudesRetiro/>}/>
            <Route path='/alumno/cursos/:idCurso/detalleCompetencias' element={<DetalleCompetenciasPorCurso/>}/>
            <Route path='/alumno/detalleNotas' element={<DetalleNotas/>}/>
            <Route path="/alumno/cursos/:idCurso/detalleCompetencias/detalle-calificacion" element={<DetalleCalificacionPorCompetencia />}/>
            <Route path='/alumno/matricula' element={<DashboardMatricula/>}/>

            <Route element={<FinalMatricula />}>
              <Route path='alumno/matricula/inscripcion' element={<CursosInscritos/>}/>
              <Route path='/alumno/matricula/inscripcion/seleccion-cursos' element={<SeleccionCursos/>}/>
            </Route>
            <Route path='/alumno/matricula/inscripcion/resultados' element={<ResultadosMatricula/>}/>
          </Route>  
        </Route>
  
        {/* Layout para profesor */}
        <Route element = {<RouteProtected rol="profesor" />}>
          <Route element={<LayoutProfesor/>}>
            <Route path='/profesor/horarios' element={<MainProfesor/>}/>
            <Route path='/profesor/horarios/reportes' element={<ReportesFinalDeCursos/>}/>
            <Route path='/profesor/horarios/:horarioId' element={<VistaListadoAlumnosXCurso />}/>
            <Route path='/profesor/horarios/:horarioId/reporte' element={<ReporteCurso/>}/>  {/*Pruebas*/}
            <Route path='/profesor/horarios/:horarioId/notas/:evaluacionId' element={<VistaRegistrarNotasAlumno />}/>
            <Route path='/profesor/horarios/:horarioId/competencias' element={<CompetenciaCurso />}/>
            <Route path='/profesor/horarios/:horarioId/competencias/:competenciaClave/subcompetencias' element={<SubCompetencias/>}/>
          </Route>
        </Route>
  
        {/* Layout administrador */}
        <Route element ={<RouteProtected  rol="Gestor"/>}>
          <Route element={<LayoutGestor/>}>
            <Route path='/gestor/principal' element={<MainGestor />}/>
            <Route path='/VisualizarHorarios' element={<VisualizarHorarios/>}/> {/*FAKE DE ANDRE*/}
            <Route path='/gestor/principal/horarios' element={<AdministracionHorarios/>}/>
            <Route path='/gestor/principal/horarios/edicion' element={<EdicionCursoHorario/>}/>
          </Route>
        </Route>

        
        <Route element = {<RouteProtected  rol="directorCarrera"/>}>
          <Route element={<LayoutDirector/>}>
            <Route path='/director' element={<PanelDirector/>}/>
            <Route path='/director/:idPeriodo/cursos/visualizar' element={<VisualizarCursos/>}/>
            <Route path='/director/:idPeriodo/matricula/administrar' element={<AdministracionMatricula/>}/>
            <Route path='/director/:idPeriodo/Alumnos' element={<ListadoAlumnosMatriculados/>}/>
            <Route path='/director/:idPeriodo/gestionarRetiros' element={<GestionRetiros/>}/>
            <Route path='/director/:idPeriodo/cursos/visualizar/:cursoId/VistaCompetencias' element={<VistaCompetencias/>}/>
            {/* <Route path='/CompetenciaEditar' element={<CompetenciaEditar/>}/> */}
            {/* <Route path='/SubCompetenciaEditar' element={<SubCompetenciaEditar/>}/>
            <Route path='/CompetenciaRegistrar' element={<CompetenciaRegistrar/>}/> */}
            <Route path='/director/:idPeriodo/cursos/visualizar/:cursoId/VistaCompetencias/:compID/vistaSubcompetencias/' element={<SubcompetenciasXComp/>}/>
            {/* <Route path='/SubCompetenciaEditar' element={<SubCompetenciaEditar/>}/> */}
          </Route>
        </Route>

        <Route path='*' element={<NotFoundPage/>} />
      </>
    )
  )
  return(
      <AuthProvider>
        <AnimatePresence mode="wait">
          <RouterProvider router={router} />
        </AnimatePresence>
      </AuthProvider>
  )
}
export default App
