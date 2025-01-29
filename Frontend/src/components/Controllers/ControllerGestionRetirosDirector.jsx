import React, { useState } from 'react';
import { InputText } from '../Inputs/InputText';
import { CicloDropdown, NivelDropdown } from '../Inputs/Dropdown';
import { ButtonSpecial } from '../Button/ButtonSpecial';

export function ControllerGestionRetirosDirector({ onFiltrar, onCleanFilters }) {
  const [nombreOCodigoAlumno, setNombreOCodigoAlumno] = useState(''); // Entrada para nombre/código de alumno
  const [nombreOClaveCurso, setNombreOClaveCurso] = useState(''); // Entrada para nombre/clave de curso

  // Manejar el evento de filtrado
  const handleFiltrar = () => {
    onFiltrar({
      curso: nombreOClaveCurso.trim(), // Filtra por nombre o clave del curso
      alumno: nombreOCodigoAlumno.trim(), // Filtra por nombre o código del alumno
    });
  };

  // Manejar el evento de limpiar filtros
  const handleCleanFilters = () => {
    setNombreOCodigoAlumno('');
    setNombreOClaveCurso('');
    onCleanFilters(); // Llama al método externo para restablecer la grilla
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">

        {/* Filtro por nombre del alumno */}
        <InputText
          label="Nombre o Código del Alumno"
          name="Alumno"
          placeholder="Ej: Maria Fernanda / 123456"
          description="Ingrese el nombre o código del alumno"
          value={nombreOCodigoAlumno}
          onchange={(e) => setNombreOCodigoAlumno(e.target.value)}
          className="w-96" 
        />

        {/* Filtro por nombre del curso */}
        <InputText
          label="Nombre o Clave del Curso"
          name="Curso"
          placeholder="Ej: Física 1 / FIS101"
          description="Ingrese el nombre o clave del curso"
          value={nombreOClaveCurso}
          onchange={(e) => setNombreOClaveCurso(e.target.value)}
          className="w-96"
        />

        {/* Botones de acción */}
        <div className="col-span-full flex justify-end gap-4 mt-1">
          <ButtonSpecial
            type="Clean"
            action={handleCleanFilters}
            variant="secondary"
            className="w-auto px-4"
          />
          <ButtonSpecial
            type="Search"
            action={handleFiltrar}
            className="w-auto px-2"
          />
        </div>
      </div>
    </div>
  );
}
