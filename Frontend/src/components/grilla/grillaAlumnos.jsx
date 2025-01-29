import React from 'react'


export const GrillaAlumnos = () => {

  const alumnos = [ {codigo: "20201334", 
    "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
    {codigo: "20201334", "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
    {codigo: "20201334", "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
    {codigo: "20201334", "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
    {codigo: "20201334", "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
    {codigo: "20201334", "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
    {codigo: "20201334", "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
    {codigo: "20201334", "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
    {codigo: "20201334", "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
    {codigo: "20201334", "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
    {codigo: "20201334", "Nombre completo" : "Levano Cuzcano, Kevin Luis", correo:"a20201664@utc.edu.com", estado: "matriculado"},
  ]; 
 
  return (

    <div className='h-full w-2/3 bg-white mr-[100px] ml-[200px] mt-10 mb-10 flex justify-center'>
        <div className='h-[90%] w-[90%] m-auto'>
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-2 rounded-lg">
                    <thead>
                        <tr className='bg-indigo-500 rounded-t-lg'> 
                            <th className="text-left p-3 text-white font-bold">Codigo</th>
                            <th className="text-left p-3 text-white font-bold">Nombre Completo</th>
                            <th className="text-left p-3 text-white font-bold">Correo</th>
                            <th className="text-left p-3 text-white font-bold">Estado</th>
                        </tr>
                    </thead>
                    <tbody className='mb-4'>
                        {alumnos.map((alumno, index) => (
                        <tr key={index} className="bg-white shadow">
                            <td className="p-3">{alumno.codigo}</td>
                            <td className="p-3">{alumno["Nombre completo"]}</td>
                            <td className="p-3">{alumno.correo}</td>
                            <td className="p-3">{alumno.estado}</td>
                        </tr>
                        ))}
                    </tbody>
                    
                </table>
            </div>
            
        </div>
    </div>
  );
}


export default GrillaAlumnos

