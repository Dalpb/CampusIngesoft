import React, { useState } from 'react';

export function InputArchRubrica() {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Manejador para cuando se selecciona un archivo
    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    // Manejadores para el arrastre y soltar
    const handleDragOver = (event) => {
        event.preventDefault(); // Evita que el navegador abra el archivo
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault(); // Evita que el navegador abra el archivo
        setIsDragging(false);
        
        const droppedFile = event.dataTransfer.files[0];
        setFile(droppedFile);
    };

    return (
        <div className="mb-6">
            <label className="block text-gray-700 mb-2">Rubrica</label>
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer 
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()} // Abre el selector al hacer clic
            >
                {file ? (
                    <p className="text-gray-700">{file.name}</p>
                ) : (
                    <div>
                        <svg
                            className="mx-auto h-8 w-8 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 26"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M5 12l7-7 7 7M12 5v14"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M3 21a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2"
                                
                            />
                        </svg>
                        <p className="mt-2 text-gray-400">Arrastra la rúbrica de la competencia<br/>
                        Formato: PDF, DOC, CSV</p>
                    </div>
                )}
            </div>
            {/* Input oculto para seleccionar archivo */}
            <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileSelect}
            />
            
            {
                file !== null?  (<div>
                <label className='text-xs text-gray-400'>Adjunte una rubrica en caso desea reemplazar la actual</label>
                </div>) : <br/>
            }
            
        </div>
    );
}
