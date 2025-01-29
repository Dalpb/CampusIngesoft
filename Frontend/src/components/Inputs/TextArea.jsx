export function TextArea({label,name,placeholder,description,type= "text",value,onchange,onclick,disabled}){
    return(
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={`${name}-${label}`} className="font-semibold ">{label}</label>
            <textarea 
            placeholder={placeholder}
            type={type}
            name={name} 
            id={`${name}-${label}`} 
            className="w-full  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-48 min-h-14" 
            value={value} 
            onChange={onchange}
            onClick={onclick}
            disabled={disabled}
            
            />
            <span className="text-clrDescripInput text-sm">{description}</span>
        </div>

    )
}