import React from 'react';

export function ControllerAlumnoCalificacionCompetencia({ clave, nombre, horario, ciclo }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0 md:space-x-8">
            
            {/* Clave y Nombre del Curso */}
            <div className="flex flex-col w-full md:w-auto">
                <h1 className="text-gray-500 text-xl font-medium leading-none mb-1">Competencia:</h1>
                <p className="text-black font-semibold text-lg">{clave} - {nombre}</p>
            </div>

            {/* Horario Section */}
            <div className="flex flex-col w-full md:w-auto">
                <p className="text-gray-500 text-xl font-medium leading-none mb-1">Horario:</p>
                <p className="text-black font-semibold text-lg">{horario}</p>
            </div>

            {/* Ciclo Section */}
            <div className="flex flex-col w-full md:w-auto">
                <p className="text-gray-500 text-xl font-medium leading-none mb-1">Ciclo dictado:</p>
                <p className="text-black font-semibold text-lg">{ciclo}</p>
            </div>
        </div>
    );
}
