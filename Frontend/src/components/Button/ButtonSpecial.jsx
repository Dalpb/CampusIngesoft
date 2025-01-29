import { AddIcon,DiscardIcon,FilterIcon,PrintIcon,ImportIcon,SaveIcon,SearchIcon, CleanIcon, DirectIcon,ExportIcon } from "./ButtonImage"
import { Link } from "react-router-dom"

const typeButton ={
    "Add": {txt:"Agregar",icon:<AddIcon />},
    "Discard": {txt:"Descartar",icon:<DiscardIcon/>},
    "Save": {txt:"Guardar",icon:<SaveIcon/>},
    "Search": {txt:"Buscar",icon:<SearchIcon/>},
    "Import": {txt:"Importar",icon:<ImportIcon/>},
    "Print": {txt:"Imprimir",icon:<PrintIcon/>},
    "Filter": {txt:"Filtrar",icon:<FilterIcon/>},
    "Clean": {txt:"Limpiar Filtros", icon: <CleanIcon/>},
    "Export": {txt:"Exportar", icon: <ExportIcon/>},


}

export function ButtonSpecial({type, variant = "primary", disable = false,action,submit,className }){
    // Estilos condicionales basados en la variante
    const variantStyles =
        variant === "primary"
            ? "bg-bgLoginOne text-white hover:bg-clrhoverButton"
            : "bg-white text-black border border-gray-300 hover:bg-gray-100";
    return(
        <button
            className={`w-full font-semibold text-center px-4 py-2 h-11 rounded-md flex gap-5 justify-center items-center 
                ${disable ? "bg-opacity-50 cursor-not-allowed" : "active:scale-95"} 
                ${variantStyles} 
                transition-colors duration-300 ease-in-out ${className}`}
            onClick={!disable ? action : null}
            type={submit ? "submit" : "button"}
        >
            {/* Contenedor del icono */}
            <div
                className={`rounded-md ${
                    variant === "primary" ? "bg-white bg-opacity-30" : "bg-transparent"
                } p-1 flex justify-center items-center`}
            >
                {typeButton[type].icon}
            </div>
            {typeButton[type].txt}
        </button>
    )
}

export function ButtonAnchor({title,subtitle="",goTo="",children,state,disable=false, extraClasse=""}) {
    return (
        <Link to={disable ? "" : goTo } state={state} 
        className={`col-span-full flex h-24 items-center justify-between rounded-lg border-2 border-clrNavbar bg-white p-4 text-clrNavbar duration-300 transition-colors transition-transform ${disable ?  "opacity-50 cursor-default" : "hover:bg-clrNavbar hover:text-white hover:scale-[1.02]"}`}>
            <div className="flex items-center space-x-4">
            {children}
            <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm opacity-80">{subtitle}</p>
            </div>
            </div>
            <DirectIcon/>
        </Link>
    )
}

