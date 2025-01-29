import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function NavItem({icon: Icon, label, isSelected, isCollapsed, goTo, extraClass,desplegable = false,otherAction}){

    const navigate = useNavigate();
    const {logout} = useAuth();
    const [isOpen,setIsOpen] = useState(false);
    const handleNavigation = () =>{
        if(goTo === "/all-logout")logout();
        
        console.log("me voy a ", goTo);
        navigate(goTo);
    } 
    const manejarFlecha = () =>{
        setIsOpen(!isOpen);
        otherAction();
    }
    return(
        <li
            onClick={desplegable ? manejarFlecha : handleNavigation}
            className={`bg-clrNavSide w-full h-16 border-b-4 border-solid border-brdNavItem cursor-pointer flex ${isCollapsed ? 'justify-center' : 'justify-start'} items-center px-5 transform transition-transform duration-100 hover:bg-brdNavItem active:scale-95 hover:font-bold  ${extraClass}`}
        >
            <div className={`flex items-center ${isCollapsed ? 'w-8 h-8 justify-center' : 'gap-3'}`}>
                {Icon && <Icon className="w-6 h-6" />}
                {!isCollapsed && 
                    <>
                    <p className={isSelected ? 'font-bold' : 'font-normal'}>{label}</p>
                    {
                        desplegable &&(
                            <ChevronDown
                            className={
                                `w-4 h-4 ml-auto transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`
                            }
                              
                            />
                        )
                    }
                    </>
                }
            </div>
        </li>
    )
}