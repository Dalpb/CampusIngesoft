import { LogoNavside, ReducerNavside, RetiroCursosIcon } from "./IconNavside"
import { DashboardIcon, CloseSesionIcon, CourseIcon, TrayectoryIcon, TuitionIcon,GradesIcon, ReturnArrowIcon, DocumentIcon } from "./IconNavside"
import { NavItem } from "./NavItem"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { HomeIcon } from "./IconNavside"

//Cuando el alumno este en el proceso de matricula
const studentTuition = [
    {icon: TuitionIcon,    label: "Matrícula", to:"/alumno/matricula"},
]

const studentOngoing = [
    {icon: CourseIcon,     label: "Cursos", to:"/alumno/cursos"},
    {icon: TrayectoryIcon, label: "Trayectoria", to:"/alumno/TrayectoriaAcademica"}
]

const teacherOngoing = [
    {icon: CourseIcon,     label: "Cursos",         to: "/profesor/horarios"},
    {icon: DashboardIcon,  label: "Reportes",       to: "/profesor/horarios/reportes"},
]
const GestorOngoing = [
    {icon: CourseIcon ,label: "Principal", to : "/gestor/principal"}
]//Iconos del director en su navside
const panelDirectorOptions = [
    { label: "Adm. Matrícula", to: "/matricula/administrar" },
    { label: "Vis. Cursos", to: "/director/cursos/visualizar" },
    { label: "Gest. Retiro", to: "/director/gestionarRetiros" },
  ];
const directorOptions = [
    { icon: HomeIcon, label: "Inicio", to: "/director" }, // Botón para ir al inicio
  ];

//podria colocar un campo que detecte cuando se está en matricula
export function Navside({isCollapsed, toggleNav, isMobile,role,matricula = false}) {
    // const [isPanelOpen, setIsPanelOpen] = useState(false); // Estado para controlar el despliegue del "Panel"
    const [isRetiroOpen, setIsRetiroOpen] = useState(false); // Estado para controlar el despliegue
    const {userInformation,isLoadingUser} = useAuth();
    
    let tuitionOptions = [];

    switch(role) {
        case "teacher": 
            tuitionOptions = teacherOngoing;
            break;
        case "student":
            tuitionOptions = studentOngoing;
            if(matricula)tuitionOptions = [...studentTuition,...studentOngoing]; //cambiar al estado dependiendo si es null o no
            break;
        case "gestor":
            tuitionOptions = GestorOngoing;
            break;
        case "director":
            tuitionOptions = directorOptions;
            break;
    }
    
    const sidebarClass = isMobile
        ? "fixed z-10 bottom-0 left-0 right-0 bg-clrNavSide text-white h-16"
        : `bg-clrNavSide text-white ${isCollapsed ? 'w-16' : 'w-60'} transition-all duration-300 md:flex flex-col hidden`

    return(
        <aside className={sidebarClass}>
            {!isMobile && (
                <div
                className={`bg-clrNavbar w-full flex ${
                    isCollapsed ? "justify-center" : "justify-between"
                } h-20 items-center px-4`}
                >
                {!isCollapsed && <LogoNavside />}
                <button onClick={toggleNav} className="text-white">
                    <ReducerNavside />
                </button>
                </div>
            )}
            <nav className={isMobile ? "h-full" : "flex-1"}>
                <ul className={`flex ${isMobile ? "flex-row" : "flex-col"} justify-between h-full`}>
                {isMobile ? (
                    <>
                    {tuitionOptions.map((option) => (
                        <NavItem
                        key={option.label}
                        icon={option.icon}
                        label={option.label}
                        isCollapsed={true}
                        isMobile={true}
                        goTo={option.to}
                        />
                    ))}
                    {role === "student" && (
                        <li key="Retiro de Cursos" className="flex items-center">
                        <NavItem
                            icon={RetiroCursosIcon}
                            label="Retiro de Cursos"
                            isCollapsed={true}
                            isMobile={true}
                            goTo="/alumno/GenerarSolicitudRetiro"
                        />
                        </li>
                    )}
                    </>
                ) : (
                    <>
                    <div>
                        {tuitionOptions.map((option) => (
                        <NavItem
                            key={option.label}
                            icon={option.icon}
                            label={option.label}
                            isCollapsed={isCollapsed}
                            goTo={option.to}
                        />
                        ))}
                        {role === "student" && (<>
                        <NavItem 
                        desplegable= {true}
                        isCollapsed={isCollapsed}
                        label="Retiro de Cursos"
                        icon={RetiroCursosIcon}
                        otherAction={()=> setIsRetiroOpen(!isRetiroOpen)}
                        />
                        <div
                            className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
                                isRetiroOpen ? "max-h-40" : "max-h-0"
                            }`}>
                            <NavItem
                                icon={ReturnArrowIcon}
                                label="Solicitar"
                                isCollapsed={isCollapsed}
                                goTo="/alumno/GenerarSolicitudRetiro"
                                />
                            <NavItem
                                icon={DocumentIcon}
                                label="Ver"
                                isCollapsed={isCollapsed}
                                goTo="/alumno/VisualizarSolicitudesRetiro"
                                />
                            </div>
                        </>
                        )}
                        
                    </div>
                    <NavItem
                        icon={CloseSesionIcon}
                        label="Cerrar sesión"
                        isCollapsed={isCollapsed}
                        goTo="/all-logout"
                    />
                    </>
                )}
                </ul>
            </nav>
        </aside>
    )
}