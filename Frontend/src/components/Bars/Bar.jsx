export const Bar = ({children,className = ""}) =>{
    return (
        <section className={`bg-white overflow-hidden p-4 rounded-lg shadow-md w-full flex grid ${className}` }>
            {children}
        </section>
    )
}
export const BarOption = ({title,result = ""}) =>{
    return(
        <div className=" bg-gray-100 rounded-lg p-3 flex flex-col items-center justify-center m-0 text-[#757576]">
            {title}
            <strong className="text-center text-black">{result}</strong>
        </div>   
     )
}