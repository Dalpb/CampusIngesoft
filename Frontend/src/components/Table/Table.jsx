
export const Table = ({children,className = ""}) =>{
    return(
        <table className={` w-full text-sm text-left ${className}`}>
            {children}
        </table>
    )
}
export const TableBody = ({children,className= ""}) =>{
    return(
        <tbody className={`${className}`}>
            {children}
        </tbody>
    )
}
export const TableHead = ({children,className= ""}) =>{
    return(
        <thead className={`text-white bg-clrTableHead ${className}`}>
            {children}
        </thead>
    )
}

export const TableRow =({children,className ="",type = ""}) =>{
    return(
        <tr className={`${className} ${type=="body"? "bg-white shadow-sm border-[#DDDEEE] border-2 border-solid border-t-0 box-border": ""}` }>
            {children}
        </tr>
    )
}
export const TableCell = ({children,className = "",type})=>{
    let cell;
    switch(type){
        case "head":
            cell = (
                <th scope="col" className={`px-4 py-3 text-left ${className} `}>
                    {children}
                </th>
            )
        break;
        default:
            cell = (
                <td className={`px-4 py-3 ${className}` }>
                   {children} 
                </td>
            )
        break;
    }
    return cell;
}
export const TableContainer = ({children,className=""}) =>{
    return (
        <div className={`overflow-x-auto rounded-t-2xl shadow-md ${className}`}>
            {children}
        </div>
    )
}