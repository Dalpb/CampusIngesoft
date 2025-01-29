import { useState } from "react";
import { InputText } from "../Inputs/InputText";
import { ButtonSpecial } from "../Button/ButtonSpecial";

export function ControllerSubcompetencia({setSubcompetencias, subcompetenciasInv }) {
    const [searchTermNombre, setSearchTermNombre] = useState('');
    const handleSearch = () => {
        const SubCompetenciasFiltradas = subcompetenciasInv.filter(subcompetencia => subcompetencia.nombre.toLowerCase().includes(searchTermNombre.toLowerCase()));
        setSubcompetencias(SubCompetenciasFiltradas);
    };

    const onClickA = () => {
        // Evento
        
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full flex flex-col space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="w-full sm:w-auto gap-8 flex-grow flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className='min-w-80'>
                        <InputText label={"Nombre"} name={"nombreSub"} placeholder={"Ej: Habilidad de hablar bajo presión"} description={"Ingrese el nombre de la subcompetencia"} value={searchTermNombre} onchange={(e) => setSearchTermNombre(e.target.value)} onclick={onClickA}/>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <ButtonSpecial type="Search" action={handleSearch} submit={false} />
                    </div>
                </div>

            </div>

        </div>
    );
}
