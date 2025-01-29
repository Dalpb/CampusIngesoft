import { LogoNavside, ReducerNavside, RetiroCursosIcon } from "./IconNavside"
import { DashboardIcon, CloseSesionIcon, CourseIcon, TrayectoryIcon, TuitionIcon } from "./IconNavside"
import { NavItem } from "./NavItem"
import { React, useState } from "react"

const studentTuition = [
    {icon: CourseIcon,     label: "Cursos", to:"/alumno"},
    {icon: TrayectoryIcon, label: "Trayectoria", to:"/TrayectoriaAcademica"}
    
]

const solicitudOptions = [
    {label: "Solicitar", to: "/retiroCursos" },
    {label: "Ver", to: "/SolicitudesRetiro" },
];


export function Alum_ciclo_navside({isCollapsed, toggleNav, isMobile}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const sidebarClass = isMobile
        ? "fixed z-10 bottom-0 left-0 right-0 bg-clrNavSide text-white h-16"
        : `bg-clrNavSide text-white ${isCollapsed ? 'w-16' : 'w-60'} transition-all duration-300 md:flex flex-col hidden`

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };    
        
    return(
        <aside className={sidebarClass}>
            {!isMobile && 
            (
            <div className={`bg-clrNavbar w-full flex ${isCollapsed ? 'justify-center' : 'justify-between'} h-20 items-center px-4`}>
                {!isCollapsed && <LogoNavside />}
                <button onClick={toggleNav} className="text-white">
                <ReducerNavside />
                </button>
            </div>
            )
            }
            <nav className={isMobile ? "h-full" : "flex-1"}>
                <ul className={`flex ${isMobile ? 'flex-row' : 'flex-col'} justify-between h-full`}>
                    {isMobile ? (
                        studentTuition.map((option) => (
                            <NavItem key={option.label} icon={option.icon} label={option.label} isCollapsed={true} isMobile={true} to={option.to} />
                        ))
                    ) : (
                        <>
                            <div>
                                {studentTuition.map((option) => (
                                    <NavItem key={option.label} icon={option.icon} label={option.label} isCollapsed={isCollapsed} to={option.to} />
                                ))}
                                <div className="relative">
                                    <button onClick={toggleDropdown} className="flex items-center p-2 text-white w-full">
                                        <RetiroCursosIcon />
                                        {!isCollapsed && <span className="ml-2">Retiro de Cursos</span>}
                                    </button>
                                    <div className={`ml-8 mt-2 space-y-1 transition-all duration-300 ${isDropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                        {solicitudOptions.map((option) => (
                                            <NavItem
                                                key={option.label}
                                                label={option.label}
                                                isCollapsed={isCollapsed}
                                                to={option.to}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <NavItem icon={CloseSesionIcon} label="Cerrar sesión" isCollapsed={isCollapsed} />
                        </>
                    )}
                </ul>
            </nav>
        </aside>
    )
}