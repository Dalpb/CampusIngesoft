import { Button } from '../../components/Button/Button';
import { ButtonSpecial } from '../../components/Button/ButtonSpecial';
import PopUp from '../../components/Pop-up/NotasDisponibles/Nota';
import { getNotesList } from '../../services/coursesServices';
import { useNavigate } from 'react-router-dom';
import { useLocation} from 'react-router-dom';
import { useState} from 'react';
import { LoadingLayout } from '../Layout/Layout';

export function ControllerVistaListadoAlumnosXCurso({ cursoId, setStudents, students,horarioId ,setLocalStudents,periodo}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isPopUpOpen, setIsPopUpOpen] = useState(false); // State para controlar pop-up
    const [notas, setNotas] = useState([]); // Estado para almacenar la lista de notas
    const navigate = useNavigate();
    const location = useLocation();

    const getNotesListCourse = async () => {
        try {
            const listNotes = await getNotesList(horarioId);
            setNotas(listNotes); // Guardar la lista de notas en el estado
            console.log("listadonotas",listNotes);
        } catch (error) {
            console.error("Error en obtener los periodos");
        }
    };

    // Función para abrir/cerrar el PopUp
    const togglePopUp = () => {
        // Solo ejecuta la función al abrir el pop-up
        if (!isPopUpOpen) getNotesListCourse();
        setIsPopUpOpen(!isPopUpOpen); // Cambia el estado al contrario
    };

    const goToCompetitionSchedule = () => {
        if (location.state) {
            navigate(`/profesor/horarios/${horarioId}/competencias`, { state: { ...location.state } });
        } else {
            console.error("No se pudo navegar, falta información del curso");
        }
    };
    
    const handleSearch = () => {
        // Lógica de búsqueda para el término ingresado
        console.log(`Buscando estudiante con clave: ${searchTerm}`);
        if(!searchTerm) {
            setLocalStudents(students);
            console.log("XD")
            return
        }
        const filteredStudents = students.filter(student => student.alumno.codigo.includes(searchTerm));
        setLocalStudents(filteredStudents);
    };
    if (students === null || students.length <= 0){
        return <div/>
    }
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full flex flex-col space-y-2">
            <label htmlFor="studentCode" className="text-sm font-medium text-gray-700">
                Código
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="w-full sm:w-auto flex-grow flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                        type="text"
                        id="studentCode"
                        placeholder="Ejm: 20201646"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <ButtonSpecial type="Search" action={handleSearch} />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <Button txt="Notas" action={togglePopUp} />
                    <Button txt="Competencias" action={goToCompetitionSchedule} />
                </div>
            </div>
            <p className="text-sm text-gray-500">Ingrese el código del alumno</p>

            {/* Mostrar el pop-up si está abierto */}
            {isPopUpOpen && (
                <PopUp
                    title="Notas Disponibles"
                    buttons={notas.map((nota, index) => ({
                        id: index, // Usa la posición del arreglo como id
                        tipoNota: nota.tipo,

                        indice: nota.indice,
                    }))}
                    onClose={togglePopUp} 
                    url={`/profesor/horarios/${horarioId}/notas/`} // Pasamos la función de cerrar
                />
            )}
        </div>
    );
}