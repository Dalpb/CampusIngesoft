  //Bar responsivo para reutilizar
  import React, { useState } from 'react';
  // import {BotonBuscar} from '../Button/SearchButton'; // Importa el botón separado
  import { InputTextSearchTable } from './InputTextSearchTable';
  import { ButtonSpecial } from '../Button/ButtonSpecial';

  export function SearchBar2({ onSearch }) {
    const [codigoAlumno, setCodigoAlumno] = useState("");

    const handleSearch = () => {
      onSearch(codigoAlumno);  // Pasamos el código ingresado al prop onSearch
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center space-x-4 w-full sm:max-w-md">
      {/* Input con ajuste para mantener la alineación */}
      <div className="w-full sm:max-w-xs mt-5">
        <InputTextSearchTable 
          value={codigoAlumno}
          onChange={(e) => setCodigoAlumno(e.target.value)}
          placeholder="Ejm: 20117890"
          helperText="Ingrese el código del alumno"
        />
      </div>
      
      {/* Botón de búsqueda */}
      <ButtonSpecial 
        type="Search" 
        action={handleSearch} 
        className="h-11"  // Mantén la altura del botón
      />
    </div>
    );
  }
