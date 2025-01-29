import { InputText } from "../Inputs/InputText";
import { ButtonSpecial } from "../Button/ButtonSpecial";

export function DatosVisualizarHorarios() {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-between">
            {/* Alumno Section */}
            <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xl font-medium leading-none">Cursos Registrados</p>
                <p className="text-black font-bold text-sm py-1 px-2">
                    CR 
                </p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xl font-medium leading-none">Alumnos Totales</p>
                <p className="text-black font-bold text-sm py-1 px-2">
                    AT 
                </p>
            </div>
            {/* Cursos Section */}
            <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xl font-medium leading-none">Profesores Totales</p>
                <p className="text-black font-bold text-sm py-1 px-2">
                    PT
                </p>
            </div>

            {/* Créditos Section */}
            <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xl font-medium leading-none">Horarios Totales</p>
                <p className="text-black font-bold text-sm py-1 px-2">
                    HT
                </p>
            </div>
        </div>
    );
}
