
export function InputText({label,name,placeholder,description,type= "text",value,onchange,onclick,itsError = false,size='full', disabled, className = ""}){

    return(
        <div className={`flex flex-col gap-1 ${className}`}>
            <label htmlFor={`${name}-${label}`} className="font-semibold ">{label}</label>
            <input 
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            name={name} 
            id={`${name}-${label}`} 
            className={`w-${size} px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 h-11
                ${itsError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
                ${disabled && "bg-gray-100"}`} 
            value={value} 
            onChange={onchange}
            onClick={onclick}/>
            <span className={`text-sm
                ${itsError ? "text-red-500": "text-clrDescripInput"}`}>{itsError ? "Por favor, ingrese un código válido": description}</span>
        </div>
    )
}

export function InputNumber({label,name,placeholder,description,type= "number",value,onchange,onclick,itsError = false,size='full', disabled, className = "", min, max}){

    return(
        <div className={`flex flex-col gap-1 ${className}`}>
            <label htmlFor={`${name}-${label}`} className="font-semibold ">{label}</label>
            <input 
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            name={name}
            id={`${name}-${label}`} 
            className={`w-${size} px-3 py-2 border rounded-md focus:outline-none focus:ring-2 h-11
                ${itsError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
                ${disabled && "bg-gray-100"}`} 
            value={value} 
            onChange={onchange}
            onClick={onclick}
            min={min}
            max={max}/>
            
        </div>
    )
}

export function SelectInput({ children, label='', value, name, description, itsError, msgError, className, onchange }) {
    return (
        <div className="flex flex-col gap-1 w-full">
        <label htmlFor={`${name}-${label}`} className="font-semibold ">{label}</label>

        <select className={`border border-solid border-[#CBD5E1] rounded-md px-2 py-1  text-black text-sm bg-white ${className}`} onChange={onchange} value={value}>
            {children}
        </select>
        <span className={`text-sm
                ${itsError ? "text-red-500": "text-clrDescripInput"}`}>{itsError ? msgError: description}</span>
        </div>
    )
}

export function SelectInputProfPopUpHorario({children,label,value,name,description,itsError,msgError,className,onchange}) {
    return(
        <div className="flex flex-col gap-1 w-full">
            <span className={`text-sm
                    ${itsError ? "text-red-500": "text-clrDescripInput"}`}>{itsError ? msgError: description}
            </span>
            <label htmlFor={`${name}-${label}`} className="font-semibold">{label}</label>
            <select
                className={`px-3 py-2 h-11 border border-solid border-[#CBD5E1] rounded-md text-black text-sm bg-white ${className}`}
                onChange={onchange}
                value={value}
                name={name}
                id={`${name}-${label}`}
            >
                {children}
            </select>
            <span className={`text-sm ${itsError ? "text-red-500" : "text-clrDescripInput"}`}>
                {itsError ? msgError : description}
            </span>
        </div>
    )
}

export function SelectInput2({
    children,
    label,
    value,
    name,
    description,
    itsError,
    msgError,
    className,
    onchange,
    disabled // Nueva prop
}) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={`${name}-${label}`} className="font-semibold">{label}</label>

            <select
                className={`border border-solid border-[#CBD5E1] rounded-md px-2 py-1 text-black text-sm bg-white ${className}`}
                onChange={onchange}
                value={value}
                disabled={disabled} // Aplicamos la propiedad disabled
            >
                {children}
            </select>
            <span className={`text-sm ${itsError ? "text-red-500" : "text-clrDescripInput"}`}>
                {itsError ? msgError : description}
            </span>
        </div>
    );
}
