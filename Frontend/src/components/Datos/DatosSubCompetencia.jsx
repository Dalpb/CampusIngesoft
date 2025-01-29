import React from 'react'

export const DatosSubCompetenciaEditar = ({subcompetenciaTemp, setSubcompetenciaTemp}) => {
    return (
        <div className="mb-6">
            <h1>Competencia C1</h1>
            <h2 className="text-2xl font-bold mb-8">Sub Competencia</h2>
            <div>
                <label className="block text-gray-700">Nombre:</label>
                <input
                    type="text"
                    value={subcompetenciaTemp.nombre}
                    onChange={(e) => setSubcompetenciaTemp({ ...subcompetenciaTemp, nombre: e.target.value })}
                    className="w-1/2 border border-black-300 rounded-md p-2 my-2 "
                />
            </div>


            <div className="mt-6">
                <label className="block text-gray-700">Descripcion:</label>
                <textarea
                    value={subcompetenciaTemp.descripcion}
                    onChange={(e) => setSubcompetenciaTemp({ ...subcompetenciaTemp, descripcion: e.target.value })}
                    placeholder="Ingresa la descripcion de la subcompetencia"
                    className="w-full border border-gray-300 rounded-md p-2 pb-4 my-2 focus:border-indigo-500"
                />
            </div>
        </div>
    )
}
