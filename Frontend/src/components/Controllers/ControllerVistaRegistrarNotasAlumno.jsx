import { ButtonSpecial } from '../Button/ButtonSpecial';
import PopUp from '../Pop-up/NotasDisponibles/Nota';
import { useLocation} from 'react-router-dom';
import { useState} from 'react';
import FileUploadPopup from '../Pop-up/UploadFile/File';
import  PopupSuccess from "../../components/Pop-up/Response/Success"

export function ControllerVistaRegistrarNotasAlumno({ tipoNota, indice, setListNotes,isSaved ,listNotes,periodo}) {
    const [isPopUpOpen, setIsPopUpOpen] = useState(false); // State para controlar pop-up
    const [showPopup, setShowPopup] = useState(false); // Estado para mostrar el popup
    const location = useLocation();
    // Función para abrir/cerrar el PopUp
    const togglePopUp = () => {
        // Solo ejecuta la función al abrir el pop-up
        setIsPopUpOpen(!isPopUpOpen); // Cambia el estado al contrario
    };
    const confirmUpload = () => {
        // Solo ejecuta la función al abrir el pop-up
        setIsPopUpOpen(!isPopUpOpen); // Cambia el estado al contrario
        setShowPopup(true);
    };
    
    // Callback para manejar la carga del archivo
    const handleFileUpload = (uploadedNotes) => {
        setListNotes((prevNotes) => {
            // Crear una copia de las notas existentes
            const updatedNotes = [...prevNotes];

            // Recorrer cada una de las notas subidas
            uploadedNotes.forEach((newNote) => {
                // Encontrar el índice del alumno en las notas existentes usando el código
                const index = updatedNotes.findIndex(note => note.alumno_codigo === newNote.codigo);

                if (index !== -1) {
                    // Si el alumno ya existe, actualizar la nota
                    updatedNotes[index].notas[0].valor = newNote.nota;
                } else {
                    // Si el alumno no existe, opcionalmente podrías agregarlo (depende de la lógica de la aplicación)
                    console.warn(`El alumno con código ${newNote.codigo} no fue encontrado en la lista actual.`);
                }
            });

            return updatedNotes;
        });

        setIsPopUpOpen(false); // Cerrar el pop-up después de la carga
    };
    // Función para manejar el cambio del valor de la nota
    const handleConfirm = () => {
        setShowPopup(false); // Mostrar el popup después de guardar
    };
    const handleCancel = () => {
        setIsPopUpOpen(!isPopUpOpen);
    }

    const exportToCSV = () => {
        if (!listNotes || listNotes.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }
    
        // Crear las cabeceras
        const headers = "codigo,nota\n";
    
        const csvData = listNotes
        .map(note => {
            const valor = note.notas[0]?.valor;
            let nota;

            if (valor === -1) {
                nota = ""; // Nota vacía para -1
            } else if (valor === -2) {
                nota = "F"; // "F" para -2
            } else {
                nota = valor; // Valor normal en otros casos
            }

            return `${note.alumno_codigo},${nota}`;
        })
        .join("\n");
        // Combinar las cabeceras y los datos
        const csvContent = headers + csvData;
    
        // Crear un archivo Blob con el contenido CSV
        const blob = new Blob([csvContent], { type: "text/csv" });
    
        // Crear un enlace para descargar el archivo
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Notas.csv";
    
        // Simular un clic en el enlace para iniciar la descarga
        link.click();
    
        // Limpiar el objeto URL
        URL.revokeObjectURL(url);
    };
    


    if (setListNotes === null || setListNotes.length <= 0){
        return <div/>
    }
    if (listNotes === null || listNotes.length <= 0){
        return <div/>
    }
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full flex flex-col space-y-2">
            <label htmlFor="studentCode" className="text-xl font-medium text-gray-400">
                Evaluación
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="w-full sm:w-auto flex-grow flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <p className="text-xl font-semibold text-black">
                    {tipoNota} {indice}
                </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <ButtonSpecial type="Export" action={exportToCSV}/>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <ButtonSpecial type="Import" action={togglePopUp} disable={isSaved}/>
                </div>
            </div>

            {isPopUpOpen && (
               <FileUploadPopup onCancel={handleCancel} onClose={confirmUpload} onUpload={handleFileUpload} listNotes={listNotes}  />
            )}
            {showPopup && <PopupSuccess text="Notas guardadas"  onContinue={handleConfirm}/>}
        </div>
    );
}






