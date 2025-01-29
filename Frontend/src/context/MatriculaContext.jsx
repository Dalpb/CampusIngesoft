import {
    createContext,
    useContext,
    useEffect,
    useState
 } from "react";
import { useAuth } from "./AuthContext";
import { trayectoryByStudent, getCursosPermitidos } from "../services/studentServices";
import { getCursosyHorarios, getInscripciones, postRetirarseCurso, postLineasInscripcion,getUltimoPeriodo} from "../services/matricula.service";
const MatriculaContext = createContext(null);


export const MatriculaProvider =({children}) =>{
    const {userInformation,getName,obtenerEstado,estado} = useAuth();


    const [periodoActual,setPeriodoActual] = useState(null);
    const [cursosMatricula,setCursosMatricula] = useState(null); //cursos y horarios a mostrar en matricula
    const [horarioSelect,setHorariosSeleccionados] = useState(null); //almacena que horario de cada curso es seleccionado para usar el dropdown
    const [trayectoria,setTrayectoria] = useState(null);//trayectoria
    const [cursosMatriculaTodos,setCursosMatriculaTodos] = useState(null);

    const [cursosInscritos,setCursosInscritos] = useState(null); //almacena tanto los cursos que se inscribio y está matriculado el alumno
    const [cantidadCursosMat,setCantidadCursosMat]= useState(0);
    const [creditosMatriculados,setCreditosMatriculados] =useState(0); 
    const [creditosInscritos,setCreditosInscritos] = useState(0);
    const [cantidadCursosIns,setCantidadCursosIns] = useState(0);

    const [cursosPermitidos,setCursosPermitidos] = useState([]); //cursos permitidos

    const [cursosSeleccionados,setCursosSeleccionados] = useState([]); //almacena los cursos que selecciona el alumno en la matricula
    const [cantidadCursosSelec,setCantidadCursosSelec] = useState(0); 
    const [creditosSelec,setCreditosSelec] = useState(0);

    const [isCursosInsLoaded,setIsCursosInsLoaded] = useState(false); //para conocer que se está cargando de la bd
    const [isCursosSelecLoaded,setIsCursosSelecLoaded] = useState(false);
    const [isCursosHorariosLoaded,setIsCursosHorariosLoaded] = useState(false);

    //trayectoria del usuario
    const getTrayectory = async () => {
        try {
            const studentTrayectoryInfo = await trayectoryByStudent(userInformation.id);
            setTrayectoria(studentTrayectoryInfo)
        } catch (error) {
            console.error("Error en obtener los periodos");
        }
    };

    //cursos permitidos del alumno
    const obtenerCursosPermitidos = async () => {
        try {
            const studentCursosPermitidos = await getCursosPermitidos(userInformation.id);
            // Excluir el primer elemento basado en la presencia de "factorDesempeno"
            const cursos = studentCursosPermitidos.slice(1);
            setCursosPermitidos(cursos);
        } catch (error){
            console.error("Error en obtener los cursos permitidos");
        }
    }

    //informacion de matricula del usuario
    const getCursosInformation = async () =>{
        try{
            const cursos = await getInscripciones(userInformation.id,periodoActual[0].id);
            console.log("seteamos",cursos);
            setCursosInscritos(cursos);
            calcularCantidadesInscritos(cursos.lineas);
            calcularCantidadesMatriculados(cursos.lineas);
        }catch(error){
            console.error("Errror");
        }
    }

    //obtengo los cursos y horarios para mostrar en matricula
    // const obtenerCursosMatricula = async (page = 1) =>{
    //     try{
    //         setIsCursosHorariosLoaded(true);
    //         const cursosMatricula = await getCursosyHorarios(page);
    //         setCursosMatricula(cursosMatricula);
    //         console.log(cursosMatricula);
    //         setHorariosSeleccionados(cursosMatricula.results.map(curso => curso.horarios[0]));
    //         setIsCursosHorariosLoaded(false);
    //         return cursosMatricula
    //     }catch(error){
    //         console.log("Se obtuvo error en obtener los cursos de matrícula");
    //     }
    // }
    // matriculaContext.jsx
    const obtenerCursosMatricula = async ({ page = 1, clave = '', nombre = '', nivel = '' }) => {
        try {
            console.log("Entrando a obtenerCursosMatricula");
            setIsCursosHorariosLoaded(true);
            const cursosMatricula = await getCursosyHorarios({ page, clave, nombre, nivel }); // Usa filtros dinámicos
            setCursosMatricula(cursosMatricula);
            setHorariosSeleccionados(cursosMatricula.results.map(curso => curso.horarios[0]));
            setIsCursosHorariosLoaded(false);
            return cursosMatricula;
        } catch (error) {
            console.error("Error al obtener los cursos de matrícula:", error);
        }
    };

    const obtenerCursosMatriculaTodos = async ({ clave = '', nombre = '', nivel = '' }) => {
        try {
            console.log("Entrando a obtenerCursosMatriculaTodos");
            setIsCursosHorariosLoaded(true); // Indicar que se está cargando
            const resultadosTotales = []; // Acumulador de resultados
    
            for (let page = 1; page <= 6; page++) {
                const respuesta = await getCursosyHorarios({ page, clave, nombre, nivel }); // Llamada API por página
                resultadosTotales.push(...respuesta.results); // Combinar resultados de cada página
            }
    
            setCursosMatriculaTodos(resultadosTotales); // Guardar resultados combinados en el estado
            setIsCursosHorariosLoaded(false); // Indicar que terminó la carga
            //console.log("Resultados totales",resultadosTotales);
            return resultadosTotales; // Devolver resultados por si se necesita usar después
        } catch (error) {
            console.error("Error al obtener todos los cursos de matrícula TODOS:", error);
        }
    };
    
    

    //calculo de cantidades de cursos inscritos
    const calcularCantidadesInscritos = (cursos) =>{
        const inscritos = cursos.filter(curso => !curso.seleccionado);
        const cantIns = inscritos.length;
        const credIns = inscritos.reduce((acum,curr) => acum + curr.creditos,0);
        console.log(cantIns);
        console.log(credIns);
        setCantidadCursosIns(cantIns);
        setCreditosInscritos(credIns);
    }

    //calculo de cantidades de cursos matriculados
    const calcularCantidadesMatriculados = (cursos) =>{
        const matriculados = cursos.filter(curso => curso.seleccionado);
        const cantMat = matriculados.length;
        const credMat = matriculados.reduce((acum,curr) => acum+curr.creditos,0);
        console.log(cantMat);
        console.log(credMat);
        setCantidadCursosMat(cantMat);
        setCreditosMatriculados(credMat);
    }

    useEffect(() => {
        const obtenerUltimoPeriodo = async () => {
          const infoPeriodo = await getUltimoPeriodo();
          console.log(infoPeriodo);
          setPeriodoActual(infoPeriodo);
        }
        obtenerUltimoPeriodo();
      },[]);  

    //para recargar los datos la inicio de inscripcion
    useEffect(()=>{
        const extraerInformacion = async () =>{
            setIsCursosInsLoaded(true);
            await getTrayectory();
            await getCursosInformation();
            await obtenerCursosPermitidos();
            setIsCursosInsLoaded(false);
        }

        if(userInformation && periodoActual)
            extraerInformacion();
        
    },[userInformation,periodoActual])


    //cuando haya una actualización de los cursos inscritos, aumenta o disminuye
    useEffect(() =>{
        if(!cursosInscritos)return ;
        calcularCantidadesInscritos(cursosInscritos.lineas);
        calcularCantidadesMatriculados(cursosInscritos.lineas);
    },[cursosInscritos]);


    //sacar a aun algumno de un curso que se inscribio
    const desInscribirCurso = async (idLineaInscripcion) =>{
        try{
            //tengo miedo de probar si funciona
            const status = await postRetirarseCurso(userInformation.id,idLineaInscripcion);
            console.log(status);
            const inscritos =  cursosInscritos.lineas.filter(curso => curso.idLinea !== idLineaInscripcion);
            const nuevos = {...cursosInscritos};
            nuevos.lineas = inscritos;
            setCursosInscritos(nuevos);
        }catch(error){
            console.log("Error al retirarse");
            throw error;
        }
    }
    //funcion para evitar a que se matricule con más de 22 creditos
    const verificaCantidadCreditos = (horarios,creidtosIncritos) => {
        // = await funcion();
        const totalCreditos = horarios.reduce((sum, horario) => sum + horario.creditos, 0);
        console.log("creditosData.credMat")
        console.log(creidtosIncritos)
        return totalCreditos <= 22 - creidtosIncritos;
    };
      

    //funcion para verificar que se inscriba solo en cursos permitidos
    const verificaPermitidos = (horarios) => {
        console.log("verificaPermitidos: ", horarios);
        console.log("cursosPermitidos: ", cursosPermitidos);
        return horarios.every((horario) =>
          cursosPermitidos.some((cursoPermitido) => cursoPermitido.clave === horario.cursoClave)
        );
      };
      
      
    //función para inscribirse
    const inscribirCursos = async (idAlumno, horariosConDetalles,creidtosIncritos) => {
        console.log("entro en inscribirCursos");
        try {
          // Validar créditos
          if (!verificaCantidadCreditos(horariosConDetalles,creidtosIncritos)) {
            throw new Error("La suma de créditos excede el límite permitido (22 créditos).");
          }
      
          // Validar cursos permitidos
          if (!verificaPermitidos(horariosConDetalles)) {
            throw new Error("Se están seleccionando cursos no permitidos.");
          }
      
          // Formatear horarios para el servicio
          const lineas = horariosConDetalles.map(({ idHorario }) => ({ idHorario }));
      
          // Llamar al servicio para guardar los horarios seleccionados
          const response = await postLineasInscripcion(idAlumno, lineas);
          console.log("Respuesta del backend:", response);
      
          // Actualizar la lista de cursos inscritos
          await getCursosInformation();
          console.log("Cursos inscritos actualizados.");
        } catch (error) {
          console.error("Error al inscribir cursos:", error.message);
          throw error; // Reenviar error para que sea manejado en el componente
        }
    };


    //cambiar los horarios mostrados por el SELECT
    const actualizarHorariosSeleccionados = (indexCurso,idHorario)=>{
        const horarios = cursosMatricula.results[indexCurso].horarios;
        const horarioIndex = horarios.findIndex(hor => hor.id === parseInt(idHorario));
        const horario = horarios[horarioIndex];
        let nuevosHorarios = [...horarioSelect];
        nuevosHorarios[indexCurso] = horario;
        setHorariosSeleccionados(nuevosHorarios);
    }



    //información comprimida
    const matriculaData ={
        cursosInscritos,
        cursosPermitidos,
        cursosSeleccionados,
        cursosMatricula,
        cursosMatriculaTodos,
        horarioSelect,
    }
    const creditosData = {
        credIns:creditosInscritos,
        credSel:creditosSelec,
        credMat:creditosMatriculados
    }
    const cantidaData ={
        cantIns:cantidadCursosIns,
        cantSel:cantidadCursosSelec,
        cantMat:cantidadCursosMat,
    }
    const loadingData ={
        inscritos: isCursosInsLoaded,
        selec:isCursosSelecLoaded,
        cursosHorarios:isCursosHorariosLoaded,
    }
    const userInfo= {
        userInformation,
        getName,
        estado
    }
    const matriculaFunctions = {
        desInscribirCurso,
        obtenerCursosMatricula,
        actualizarHorariosSeleccionados,
        inscribirCursos,
        obtenerCursosMatriculaTodos
    }

    return(
        <MatriculaContext.Provider value={{
            matriculaData,
            creditosData,
            cantidaData,
            trayectoria,
            loadingData,
            userInfo,
            matriculaFunctions
        }}>
            {children}
        </MatriculaContext.Provider>
    )
}




export const useMatricula =() =>{
    return useContext(MatriculaContext);
}