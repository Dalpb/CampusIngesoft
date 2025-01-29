import React, { useState } from 'react'
import { Button } from '../../Button/Button'
import { ButtonSec } from '../../Button/ButtonSec'
import { json } from 'react-router-dom';

const FileUploadPopup = ({ onClose,onCancel, onUpload ,listNotes}) => {
  const [file, setFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'text/csv') {
      validateAndSetFile(droppedFile)
    } else {
      setErrorMessage('Por favor, suelte un archivo CSV.')
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      validateAndSetFile(selectedFile)
    } else {
      setErrorMessage('Por favor, seleccione un archivo CSV.')
    }
  }

  const validateAndSetFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const [firstLine, ...lines] = text.trim().split('\n');
      
      if (!(firstLine.trim() === 'codigo,nota' || firstLine.trim() === 'codigo;nota')) {
        setErrorMessage('El archivo CSV debe tener las cabeceras "codigo,nota" o "codigo;nota".');
        return;
      }
  
      const jsonData = csvToJson(text);
      const invalidCodes = [];
      const missingNotes = [];
  
      // Nueva validación: verifica que la cantidad de registros coincida
      if (jsonData.length !== listNotes.length) {
        setErrorMessage(`La cantidad de registros en el archivo (${jsonData.length}) no coincide con la cantidad esperada (${listNotes.length}).`);
        return;
      }
  
      jsonData.forEach((item) => {
        if (!listNotes.some(student => student.alumno_codigo === item.codigo)) {
          invalidCodes.push(item.codigo);
        }
        if (item.nota === undefined || item.nota === '') {
          missingNotes.push(item.codigo);
        }
      });
  
      if (invalidCodes.length > 0 || missingNotes.length > 0) {
        let errorMsg = '';
        if (invalidCodes.length > 0) {
          errorMsg += `Los siguientes códigos no existen: ${invalidCodes.join(', ')}. `;
        }
        if (missingNotes.length > 0) {
          errorMsg += `Los siguientes códigos no tienen nota: ${missingNotes.join(', ')}.`;
        }
        setErrorMessage(errorMsg);
      } else {
        setFile(file);
        setErrorMessage('');
      }
    };
    reader.readAsText(file);
  };
  

  const handleSubmit = () => {
    if (!file) {
      setErrorMessage('Por favor, seleccione un archivo primero.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const jsonData = csvToJson(text)
      setFile(null)
      onUpload(jsonData)
      onClose()
    }
    reader.readAsText(file)
  }

  const csvToJson = (csvText) => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(/[,;]/)
    return lines.slice(1).map(line => {
      const values = line.split(/[,;]/)
      const obj = {}
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index] ? values[index].trim() : ''
      })
      return obj
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 relative">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Importar calificaciones</h2>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer"
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <div className={`w-12 h-12 mx-auto mb-2 border-2 rounded-full flex items-center justify-center transition-colors duration-300 ${file ? 'text-green-500 border-green-500' : 'text-gray-400 border-gray-400'}`}>
              <span className="text-2xl">↑</span>
            </div>
            <p className={`${file ? 'text-green-500' : 'text-gray-500'}`}>
              {file ? file.name : 'Arrastra el archivo CSV'}
            </p>
          </label>
        </div>
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
        <p className="text-sm text-gray-600 mb-4">Campos CSV: &lt;codigo&gt;,&lt;nota&gt;</p>
        <div className="flex justify-center gap-2">
          <Button txt="Cancelar" action={onCancel} />
          <Button txt="Continuar" action={handleSubmit} disabled={!file || !!errorMessage} />
        </div>
      </div>
    </div>
  )
}

export default FileUploadPopup