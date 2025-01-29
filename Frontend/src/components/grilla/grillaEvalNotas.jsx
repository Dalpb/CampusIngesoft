import React, { useState, useEffect } from 'react';
import { TableIndex } from '../../components/Table/TableIndex';
import { useTableFilter } from '../../hooks/useTableFilter';
import { ButtonSpecial } from '../Button/ButtonSpecial';
import { useLocation} from 'react-router-dom';
import { postStudentsNotesXCourseList } from '../../services/coursesServices';
import  PopupSuccess from "../../components/Pop-up/Response/Success"
import { EmptyState } from './grillaEmpty';
import { Oval } from 'react-loader-spinner';

export function GrillaEvalNotas({ listNotes,isSaved ,setIsSaved,setListNotes}) {
    const location = useLocation();
    const {cursoId, cursoNombre, horarioNumero,periodo,horarioId,tipoNota,indice } = location.state || {};
    const ITEMS_PER_PAGE = 10; // Número de elementos por página
    const [currentPage, setCurrentPage] = useState(0);
    const [showPopup, setShowPopup] = useState(false); // Estado para mostrar el popup
    const [isLoading, setIsLoading] = useState(false); // Estado de carga
    const [showPopupError, setShowPopupError] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    // Función para manejar el caso de longitud desigual
    const validateNotesLength = (listNotes, alumnosParaGuardar) => {
        if (listNotes.length !== alumnosParaGuardar.length) {
            setPopupMessage('La cantidad de notas no coincide con la cantidad de alumnos para guardar.');
            setShowPopupError(true); // Mostrar el pop-up de error
            return false;
        }
        return true;
    };
    const { actualIndex, totalIndex, tablePartContent, getIndexContent } = useTableFilter({ content: listNotes, rowsShow: ITEMS_PER_PAGE });

    // Calcular la cantidad total de páginas
    const totalPages = Math.ceil((listNotes.length || 0) / ITEMS_PER_PAGE);

    // Obtener la parte del contenido que se mostrará en la página actual
    const currentItems = listNotes.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

    // Función para cambiar de página
    const handlePageChange = (newPageIndex) => {
        setCurrentPage(newPageIndex);
    };

    // Función para guardar las notas
    const handleSaveNotes = () => {
        
        // Asegurarse de que `listNotes` tiene los datos necesarios
        if (!listNotes || listNotes.length === 0) {
            console.error("No hay notas para guardar");
            return;
        }
        setIsLoading(true); // Activar el loader

        // Convertir valores "F" a -2 en el estado `listNotes` antes de guardarlos
        const notes2 = listNotes.map(alumno => ({
            ...alumno,
            notas: alumno.notas.map(nota => ({
                ...nota,
                valor: nota.valor === "F" ? -2 : nota.valor,
            })),
        }));
        // Filtrar las notas que no están bloqueadas
        const alumnosParaGuardar = notes2 // Si no esta bloqueado o Si no esta vacio o Si el valor es -1
        .filter((alumno) => 
        alumno.notas[0]?.isLocked !== true &&                // La nota no está bloqueada
        alumno.notas[0]?.valor !== null &&                   // La nota no es nula
        (alumno.notas[0]?.valor === -2 ||                    // Permite el valor -2
         alumno.notas[0]?.valor !== -1)                      // Excluye el valor -1
        ).map((alumno) => ({
                "alumno_x_horario": alumno.idAlumnoXHorario,
                "valor": alumno.notas[0]?.valor || -1, // Si la nota es indefinida, se establece en -1
            }));
        console.log("ENVIADO DE DATOS POST")
        if(listNotes.length!=alumnosParaGuardar.length){
            validateNotesLength(listNotes,alumnosParaGuardar)
            setIsLoading(false); // Desactivar el loader
            return
        }
        // Si no hay notas para guardar, salir de la función
        if (alumnosParaGuardar.length === 0) {
            console.warn("No hay notas editables para guardar");
            setIsLoading(false); // Desactivar el loader

            return;
        }
        // Construir el objeto de salida
        const dataToSave = {
            "tipoDeNota": tipoNota,
            "indice": indice,
            "horario": horarioId,
            "alumnos": alumnosParaGuardar,
        };
        console.log("dataToSave", dataToSave);
        
        postStudentsNotesXCourseList(dataToSave)
            .then(() => {
                setIsSaved(true)
                console.log("notas enviadas correctamente");
                // Actualizar las notas para que se bloqueen después de guardar
                const updatedNotes = listNotes.map((alumno) => ({
                    ...alumno,
                    notas: alumno.notas.map(nota => ({
                        ...nota,
                    }))
                }));
                setListNotes(updatedNotes); // Actualizar el estado de `listNotes`
                setShowPopup(true); // Mostrar el popup después de guardar
                setIsLoading(false); // Desactivar el loader al finalizar

            })
            .catch((error) => {
                console.error("Error al enviar notas:", error);
                setIsLoading(false); // Desactivar el loader al finalizar

            });
    };


    // Función para manejar el cambio del valor de la nota
    const handleConfirm = () => {
        setShowPopup(false); // Mostrar el popup después de guardar
    };

    // Función para manejar el cambio del valor de la nota
    const handleNoteChange = (index, newValue) => {
        const updatedNotes = [...listNotes];
        updatedNotes[index].notas[0].valor = newValue;
        setListNotes(updatedNotes);
    };
    const closePopupError = () => {
        setShowPopupError(false);
        setPopupMessage('');
    };
    
    return (
        <div>
        <div className={`transition-all duration-300`}>
          <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto rounded-t-2xl shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-clrTableHead">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tl-lg hidden sm:table-cell">
                      Código
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                      Nombre Completo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider rounded-tr-lg">
                      Nota
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((alumnoNota, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden">
                          {alumnoNota.idAlumnoXHorario}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden sm:table-cell">
                          {alumnoNota.alumno_codigo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {alumnoNota.alumno_nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="text"
                            value={
                              alumnoNota.notas[0]?.valor === -1 ? '' : 
                              alumnoNota.notas[0]?.valor === -2 ? 'F' : 
                              alumnoNota.notas[0]?.valor
                            }
                            onChange={(e) => {
                              const inputValue = e.target.value.toUpperCase()
                              if (inputValue === '') {
                                handleNoteChange(currentPage * ITEMS_PER_PAGE + index, -1)
                                return
                              }
                              if (inputValue === "F") {
                                handleNoteChange(currentPage * ITEMS_PER_PAGE + index, -2)
                                return
                              }
                              const newValue = parseInt(inputValue, 10)
                              if (!isNaN(newValue) && newValue >= 0 && newValue <= 20) {
                                handleNoteChange(currentPage * ITEMS_PER_PAGE + index, newValue)
                              }
                            }}
                            pattern="[0-9F]*"
                            className="px-2 w-16 text-xs leading-5 font-semibold rounded-full border border-gray-300"
                            placeholder="0-20 o F"
                            disabled={alumnoNota.notas[0]?.isLocked}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>
                        <EmptyState mainMessage="Actualmente, no tiene horarios dictados en este periodo" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center mt-4">
              <div className="order-2 md:order-1 w-full md:w-auto flex justify-center md:justify-start mb-4 md:mb-0">
                <TableIndex count={totalPages} actionSelection={handlePageChange} />
              </div>
              <div className="order-1 md:order-2 w-full md:w-auto flex justify-end">
                <ButtonSpecial type="Save" className="w-full md:w-auto px-4 py-2 text-center" action={handleSaveNotes} disable={isSaved} />
              </div>
            </div>
            {showPopup && <PopupSuccess text="Notas guardadas" onContinue={handleConfirm} />}
            {showPopupError && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <p className="text-gray-700 mb-4">{popupMessage}</p>
            <button 
                onClick={closePopupError}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
                Cerrar
            </button>
        </div>
    </div>
            )}
          </div>
        </div>
        {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <Oval 
                height={100} 
                width={100} 
                color="#4a90e2" // Un tono de azul principal
                secondaryColor="#b0d0e6" // Un azul más claro para el contraste                
                strokeWidth={5} // Ajusta el grosor del borde
            />
        </div>

        )}
      </div>
    );
}
