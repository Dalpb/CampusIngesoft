import { InputText } from "../Inputs/InputText";
import { ButtonSpecial } from "../Button/ButtonSpecial";

export function ControllerVisualizarHorarios({ periodos, selectedPeriod, onPeriodChange }) {
    return (
<div className="bg-white p-4 rounded-lg shadow-md w-full flex flex-col space-y-2">
    <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="w-full sm:w-1/4 min-w-30">
            <div className="flex flex-col gap-1 w-full">
                <label className="font-semibold">Cursos</label>
                <input 
                    placeholder="Ej: INF257"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-300 focus:ring-500" />
                <span className="text-sm text-500"> "Ingrese el código del curso"</span>
            </div>
        </div>
        
        <div className="w-full sm:w-1/4 min-w-40">
            <div className="flex flex-col gap-1 w-full">
                <label className="font-semibold">Nombre</label>
                <input 
                    placeholder="Ej: Habilidad de hablar bajo presión"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-300 focus:ring-500" />
                <span className="text-sm text-500"> "Ingrese el nombre del curso"</span>
            </div>
        </div>
        
        <div className="w-full sm:w-1/4 min-w-40">
            <div className="flex flex-col gap-1 w-full">
                <label className="font-semibold">Ciclo</label>
                <select
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-300 focus:ring-500"
                    value={selectedPeriod || ''} // Asigna el estado como valor actual
                    onChange={(e) => onPeriodChange(e.target.value)} // Actualiza el estado al cambiar
                    >
                    {periodos.map((item) => (
                        <option key={item.id} value={item.id}>
                        {item.periodo}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        <div className="w-full sm:w-1/4  min-w-40 flex items-center justify-center">
            <div className="w-full md:w-auto">
                <ButtonSpecial type="Filter" submit={false} />
            </div>
        </div>
    </div>
</div>


    );
}
