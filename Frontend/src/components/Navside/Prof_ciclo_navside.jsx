import { DashboardIcon, CloseSesionIcon, CourseIcon, TuitionIcon, LogoNavside, ReducerNavside, GradesIcon } from "./IconNavside"
import { NavItem } from "./NavItem"


const studentTuition = [
    {icon: CourseIcon,     label: "Cursos",         to: "/profesor"},
    {icon: DashboardIcon,  label: "Reportes",      to: "/reporteTotal"},
    {icon: GradesIcon,     label: "Calificaciones", to:"/calificaciones"}
]



export function Prof_ciclo_navside({isCollapsed, toggleNav, isMobile}){
    
    const sidebarClass = isMobile
    ? "fixed z-10 bottom-0 left-0 right-0 bg-clrNavSide text-white h-16"
    : `bg-clrNavSide text-white ${isCollapsed ? 'w-16' : 'w-60'} transition-all duration-300 md:flex flex-col hidden`

    
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
                    studentTuition.map(option => (
                        <NavItem key={option.label} icon={option.icon} label={option.label} isCollapsed={true} isMobile={true} to={option.to}/>
                    ))
                    ) : (
                    <>
                        <div>
                        {studentTuition.map(option => (
                            <NavItem key={option.label} icon={option.icon} label={option.label} isCollapsed={isCollapsed} to={option.to} />
                        ))}
                        </div>
                        <NavItem icon={CloseSesionIcon} label="Cerrar sesión" isCollapsed={isCollapsed} />
                    </>
                    )}
                </ul>
            </nav>
        </aside>
    )
}

