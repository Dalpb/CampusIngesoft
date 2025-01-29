//Input Responsivo
import React from 'react';

export function InputTextSearchTable({ value, onChange, placeholder, helperText }) {
  return (
    <div className="w-full sm:max-w-xs"> {/* Usamos un máximo ancho en pantallas pequeñas */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-300 p-2 rounded-lg w-full text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ padding: '8px' }}
      />
      <p className="mt-1 text-sm text-gray-500 pl-3">
        {helperText}  {/* Aquí colocas "Ingrese el código del alumno" */}
      </p>
    </div>
  );
}
