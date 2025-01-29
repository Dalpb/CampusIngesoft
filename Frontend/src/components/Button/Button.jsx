

export function Button({txt,action,type,disable, extraClasses = "", tam}){

    // definir el tamaño con: mediano, largo, corto
    let size = ""
    if (tam==="medium"){
        size = "w-1/2"
    } else if (tam==="large"){
        size = "w-full"
    } else {
        size = ""
    }

    return(
        <button className={`font-medium bg-bgLoginOne text-white  px-4 py-2 h-11 rounded-md
             ${size} flex justify-center
        ${disable ? "opacity-50" : "hover:bg-clrhoverButton transform transition-transform duration-75 active:scale-95"} ${extraClasses}`} 
             onClick={action}  type={type}>
            {txt}
        </button>
    )
}




export function ButtonSecondary({txt,action,type, tam}){

    // definir el tamaño con: mediano, largo, corto
    let size = ""
    if (tam==="medium"){
        size = "w-1/2"
    } else if (tam==="large"){
        size = "w-full"
    } else {
        size = ""
    }

    return(
        <button className={`font-medium text-bgLoginOne bg-white text-center border-solid border-bgLoginOne border-2
          px-4 py-2 h-11 rounded-md hover:bg-bgLoginOne hover:text-white
        transform transition-transform duration-75 active:scale-95 ${size}`} onClick={action}  type={type}>
            {txt}
        </button>
    )
}
