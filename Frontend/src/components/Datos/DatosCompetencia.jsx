import React, { useState } from 'react'

export const DatosCompetenciaEditar = ({competenciaTemp, setCompetenciaTemp}) => {

    /*
    const [descripcion, setDescripcion] = useState("conjunto de conocimientos, habilidades, actitudes, valores y rasgos" + 
        " que permiten a una persona desempeñarse de manera óptima en diferentes contextos, como el académico, social o profesional");
    const [nomb, setNombre] = useState("Matias sulca"); */

    
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-8">Competencia</h2>
            <div>
                <label className="block text-gray-700">Nombre:</label>
                <input
                    type="text"
                    value={competenciaTemp.nombre}
                    onChange={(e) => setCompetenciaTemp({ ...competenciaTemp, nombre: e.target.value })}
                    className="w-1/2 border border-black-300 rounded-md p-2 my-2 "
                />
            </div>


            <div className="mt-6">
                <label className="block text-gray-700">Descripcion:</label>
                <textarea
                    value={competenciaTemp.descripcion}
                    onChange={(e) => setCompetenciaTemp({ ...competenciaTemp, descripcion: e.target.value })}
                    placeholder="Ingresa la descripcion de la competencia"
                    className="w-full border border-gray-300 rounded-md p-2 pb-4 my-2 focus:border-indigo-500"
                />
            </div>
        </div>
    )
}


export const DatosCompetenciaRegistro = () => {

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-8">Competencia</h2>
            <div>
                <label className="block text-gray-700">Nombre:</label>
                <input
                    type="text"
                    className="w-1/2 border border-black-300 rounded-md p-2 pb-4 mt-2"
                    placeholder='Ej: Trabajo en equipo'
                />
            </div>
            <div>
                <label className='text-xs text-gray-400'>Ingrese el nombre de la competencia</label>
            </div>


            <div className="mt-6 mb-0">
                <label className="block text-gray-700">Descripcion:</label>
                <textarea
                    placeholder="Ej: Se evaluará las habilidades relacionadas con ..."
                    className="w-full border border-gray-300 rounded-md p-2 pb-4 mt-2 focus:border-indigo-500"
                />
            </div>
            <div className='mt-0'>
                <label className='text-xs text-gray-400'>Ingrese la descripción de la competencia</label>
            </div>
        </div>
    )
}

