import { Header } from "../Header/Header"
import { Navside } from "../Navside/Navside"
import { useResponseLayout } from '../../hooks/useResponseLayout'

import { Prof_matricula_navside } from "../Navside/Prof_matricula_navside";
import { Alum_ciclo_navside } from "../Navside/Alum_ciclo_navside";
import { Alum_matricula_navside } from "../Navside/Alum_matricula_navside";
import { WelcomeAnimation } from "../Welcome/WelcomeAnimation";

import { useAuth } from "../../context/AuthContext";
import { useLocation,Outlet, useNavigate } from "react-router-dom";
import { BreadCrumbAlumno, BreadCrumbProfesor,BreadCrumbGestor, BreadCrumbDirector } from "../BreadCrumb/BreadCrumb";
import { ScheduleTeacherProvider } from "../../context/ScheduleTeacherContext";
import { EvaluationProvider } from "../../context/EvaluationContext";
import { useEffect, useState } from "react";
import { MatriculaProvider } from "../../context/MatriculaContext";
import { MatriculaDirectorProvider } from "../../context/DirectorContext";
import { loginUser } from "../../services/userServices";
import { getEstadoMatricula } from "../../services/matricula.service";
import { PopUpError } from "../Pop-up/Response/Errror";

//SE planea un Layout distinto por usuario, que varia por su navside y breadcrum
export default function Layout({title,userName,back,children}){
    const {isNavCollapsed,isMobile,toggleNav} = useResponseLayout();
    const location = useLocation();
    //Esta estatico, hacerlo funcional de acuerdo a las vistas de cada usuario
    const NavComponent = location.pathname === "/profesor" || location.pathname === "/reporteXCurso"
                        || location.pathname === "/reporteTotal"
                        || location.pathname === "/listadoAlumnosXCurso"
                        || location.pathname === "/VistaRegistrarNotasAlumno" ? Prof_ciclo_navside: Alum_ciclo_navside;

    return (
        <div className="flex h-screen bg-bgMain">
            <NavComponent isCollapsed={isNavCollapsed} toggleNav={toggleNav} isMobile={isMobile} />
            <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isNavCollapsed ? 'collapsed-class' : 'expanded-class'}`}>
                
                <div className="sticky top-0 z-10 bg-white shadow-md">
                    <Header 
                        title={title || "Titulo de la pantalla"} 
                        userName={userName || "Diego Palomino"} 
                        itsBack={back || false}
                    />
                </div>
                {children}
            </main>
        </div>
    )
}


export const LayoutProfesor = () => {
    const {getName} = useAuth();
    const {isNavCollapsed,isMobile,toggleNav} = useResponseLayout();
    const [showWelcome, setShowWelcome] = useState(
        () => !localStorage.getItem("welcomeShown") // Mostrar solo si no existe la clave
    ); 

    useEffect(() => {
        if (!showWelcome) {
            // Guardar en localStorage cuando se complete
            localStorage.setItem("welcomeShown", "true");
        }
    }, [showWelcome]);

    const handleWelcomeComplete = () => {
        setShowWelcome(false);
    };

    const content = (
        <div className="flex h-screen bg-bgMain">
            <Navside 
            isCollapsed={isNavCollapsed}
            toggleNav={toggleNav}
            isMobile={isMobile}
            role="teacher" />
            <main className={`flex-1 overflow-y-auto transition-all duration-300  ${isNavCollapsed }`}>
                
                <div className="sticky top-0 z-10 bg-white shadow-md">
                    <Header 
                    title={""} 
                    userName={getName() || ""} 
                    itsBack={false}>

                    <BreadCrumbProfesor/>

                    </Header>
                </div>
                <Outlet /> 
            </main>
        </div>
    );

    if (showWelcome) {
        return (
            <WelcomeAnimation 
                userName={getName()} 
                onComplete={handleWelcomeComplete} 
            />
        );
    }

    return (
        <ScheduleTeacherProvider>
            <EvaluationProvider>
                {content}
            </EvaluationProvider>
        </ScheduleTeacherProvider>
    );
}
export const LayoutStudent = () =>{
    const {getName,isMatricula,userInformation,modificarEstadoMatricula} = useAuth();
    const {isNavCollapsed,isMobile,toggleNav} = useResponseLayout();   
    const [showWelcome, setShowWelcome] = useState(
        () => !localStorage.getItem("welcomeShown") // Mostrar solo si no existe la clave
    ); 

    useEffect(() => {
        // Guardar en localStorage cuando se complete
        if (!showWelcome) 
            localStorage.setItem("welcomeShown", "true");
        
    }, [showWelcome]);
    const handleWelcomeComplete = () => setShowWelcome(false);

    useEffect(() => {
        if (!userInformation)return;
        
        const pulling = setInterval( async () => { 
            try{
                const estadoMatricula = (await getEstadoMatricula()).Estado; //aquin seria la api del estado de matricula
                modificarEstadoMatricula(estadoMatricula);
                console.log("Se consultó el estado", estadoMatricula);
            }catch(error){
                console.error("Errror en la consulta de matricua");
            }         
        }, 5000);
    
        return () => clearInterval(pulling);
    }, [userInformation]);


    const content=(
        <div className="flex h-screen bg-bgMain">
            <Navside 
            isCollapsed={isNavCollapsed}
            toggleNav={toggleNav}
            isMobile={isMobile}
            role="student"
            matricula={isMatricula}
            />
            
            <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isNavCollapsed }`}>
                <div className="sticky top-0 z-10 bg-white shadow-md">
                    <Header 
                    title={""} 
                    userName={getName() || ""} 
                    itsBack={false}>
                        <BreadCrumbAlumno/>
                    </Header>
                </div>

                <Outlet /> 
            </main>
        </div>
    )

    if (showWelcome) {
        return (
            <WelcomeAnimation userName={getName()} onComplete={handleWelcomeComplete} />
        );
    }

    return isMatricula  ?( //solo tendra acceso al proveedor cuando el estado sea de matricula
         <MatriculaProvider>
            {content}
         </MatriculaProvider>)
          :content
}

export const LayoutDirector = () => {
    const { getName } = useAuth();
    const { isNavCollapsed, isMobile, toggleNav } = useResponseLayout();
    
    const [showWelcome, setShowWelcome] = useState(
        () => !localStorage.getItem("welcomeShown") // Mostrar solo si no existe la clave específica
    );

    useEffect(() => {
        if (!showWelcome) {
            // Guardar en localStorage cuando el mensaje de bienvenida se haya mostrado
            localStorage.setItem("welcomeShown", "true");
        }
    }, [showWelcome]);

    const handleWelcomeComplete = () => {
        setShowWelcome(false);
    };
  
    const content = (
      <div className="flex h-screen bg-bgMain">
        <Navside
          isCollapsed={isNavCollapsed}
          toggleNav={toggleNav}
          isMobile={isMobile}
          role="director"
        />
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isNavCollapsed ? "collapsed-class" : "expanded-class"
          }`}
        >
          <div className="sticky top-0 z-10 bg-white shadow-md">
            <Header
                title="Panel de Gestión Director de carrera"
                userName={getName() || "Nombre del Director"}
                itsBack={false}
                >
                <BreadCrumbDirector/>
            </Header>
          </div>

          <MatriculaDirectorProvider>
            <Outlet />
          </MatriculaDirectorProvider>
        </main>
      </div>
    );

    // Mostrar mensaje de bienvenida si `showWelcome` es verdadero
    if (showWelcome) {
        return (
            <WelcomeAnimation
                userName={getName()}
                onComplete={handleWelcomeComplete}
            />
        );
    }

    return content;
  };


  export const LayoutGestor = ()=>{
    const {getName,userInformation} = useAuth();
    const {isNavCollapsed,isMobile,toggleNav} = useResponseLayout();  
    const [showWelcome, setShowWelcome] = useState(
        () => !localStorage.getItem("welcomeShown") // Mostrar solo si no existe la clave específica
    );

    useEffect(() => {
        if (!showWelcome) {
            // Guardar en localStorage cuando se complete
            localStorage.setItem("welcomeShown", "true");
        }
    }, [showWelcome]);

    const handleWelcomeComplete = () => {
        setShowWelcome(false);
    };

    const content = (
        <div className="flex h-screen bg-bgMain">
            <Navside 
            isCollapsed={isNavCollapsed}
            toggleNav={toggleNav}
            isMobile={isMobile}
            role="gestor"
            matricula={userInformation?.estado !== null && userInformation?.tipo_usuario === "alumno"}
            />
            
            <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isNavCollapsed }`}>
                <div className="sticky top-0 z-10 bg-white shadow-md">
                    <Header 
                    title={""} 
                    userName={getName() || ""} 
                    itsBack={false}>
                    <BreadCrumbGestor />
                    </Header>
                </div>
                <Outlet /> 
            </main>
        </div>
    );

    if (showWelcome) {
        return (
            <WelcomeAnimation
                userName={getName()}
                onComplete={handleWelcomeComplete}
            />
        );
    }

    return content;
}

export const LoadingLayout = ({msg = "Espere hasta que se carguen los datos."}) =>{
    const [dots, setDots] = useState('')

    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prevDots => {
          if (prevDots.length >= 3) return ''
          return prevDots + '.'
        })
      }, 400)
  
      return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex items-center min-h-full justify-center "> 
            <div className="flex items-center justify-center flex-col">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="70"
                    height="70"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4B57DB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-spin"
                    >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
            <div className="text-center">
                <h2 className="mt-4 text-xl font-semibold text-gray-700 text-foreground">Cargando{dots}</h2>
                <p className="mt-2 text-lg text-muted-foreground text-gray-700">{msg}</p>
            </div>
        </div>
        </div>
    )
}

export const TitleLayout = ({title = "",subtitle="",cicle="",schedule=""}) =>{
    return(
        <div className="flex flex-col items-start  font-semibold text-clrTitle self-start gap-1">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text">{title}</h1>
        <h2 className="md:text-3xl text-2xl">{subtitle}</h2>
        <div className="flex flex-col font-normal">
            <span className="text-lg">{schedule !== "" ? `Ciclo dictado: ${cicle}` : ""}</span>
            <span className="text-lg">{cicle !== "" ? `Horario: ${schedule}` : ""}</span>
        </div>
        </div>
    ) 
}

export const FinalMatricula = () =>{
    const {obtenerEstado} = useAuth();
    const estado = obtenerEstado();
    const [endMatricula,setEndMatricula] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const goToCursos = () => {
        navigate("/alumno/matricula",{state:{...location.state}});
        setEndMatricula(false);
    }
    useEffect(()=>{
        if(estado !== "Matricula" && estado !== "Matricula Extemporanea")setEndMatricula(true);
    },[estado])
    return(
        <>
        <Outlet/>
        <PopUpError isOpen={endMatricula} text="Lo sentimos, el tiempo de inscripción de matrícula finalizó." onContinue={goToCursos}/>
        </>
    )
}