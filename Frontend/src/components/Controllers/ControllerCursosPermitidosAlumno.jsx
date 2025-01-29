import React from "react";

export function ControllerCursosPermitidosAlumno({ cicloActual, userInformation, factorDesempeno, turnoDeMatricula }) {
    console.log("factor: ",factorDesempeno);
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-between">
            {/* Ciclo Section */}
            <div className="flex flex-col items-start">
                <p className="text-gray-500 text-xl font-medium leading-none mb-1">Ciclo</p>
                <p className="text-black font-bold text-sm py-1 px-0">{cicloActual || "Cargando..."}</p>
            </div>

            {/* Alumno Section */}
            <div className="flex flex-col items-start">
                <p className="text-gray-500 text-xl font-medium leading-none mb-1">Alumno</p>
                <p className="text-black font-bold text-sm py-1 px-0">
                    {userInformation?.nombre} {userInformation?.primerApellido} {userInformation?.segundoApellido} ({userInformation?.codigo})
                </p>
            </div>

            {/* Factor de Desempeño Section */}
            <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xl font-medium leading-none mb-1">Factor de desempeño</p>
                <p className="text-black font-bold text-sm py-1 px-2">{factorDesempeno !== null ? factorDesempeno.toFixed(2) : "Cargando..."}</p>
            </div>

            {/* Turno de Matrícula Section */}
            <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xl font-medium leading-none mb-1">Turno de matrícula</p>
                <p className="text-black font-bold text-sm py-1 px-2">{turnoDeMatricula || "Cargando..."}</p>
            </div>
        </div>
    );
}
