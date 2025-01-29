import { Button } from '../Button/Button';
import { ButtonSpecial } from '../Button/ButtonSpecial';
import { getNotesList } from '../../services/coursesServices';
import { useNavigate } from 'react-router-dom';
import { useLocation} from 'react-router-dom';
import { useState} from 'react';
import { InputTextSearchTable } from '../Inputs/InputTextSearchTable';
import { InputText } from '../Inputs/InputText';

export function ControllerCompetencias({setCompetencias, competenciasInv}) {
    const [searchTermNombre, setSearchTermNombre] = useState('');
    const handleSearch = () => {
        const CompetenciasFiltradas = competenciasInv.filter(competencia => competencia.nombre.toLowerCase().includes(searchTermNombre.toLowerCase()));
        setCompetencias(CompetenciasFiltradas);
    };

    const onClickA = () => {
        // Evento
        
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full flex flex-col space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="w-full sm:w-auto gap-8 flex-grow flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className='min-w-80'>
                        <InputText label={"Nombre de la competencia"} name={"Nombre"} placeholder={"Ej: Tecnica"} description={"Ingrese el nombre de la competencia"} value={searchTermNombre} onchange={(e) => setSearchTermNombre(e.target.value)} onclick={onClickA}/>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <ButtonSpecial type="Search" action={handleSearch} />
                    </div>
                </div>

            </div>


        </div>
    );
}
