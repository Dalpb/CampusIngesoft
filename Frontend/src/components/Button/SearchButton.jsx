import React from 'react';

export function BotonBuscar({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-bgLoginOne text-white px-2 py-2 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors w-10 sm:w-auto"  // Botón ajustado al tamaño de la lupa en pantallas pequeñas
    >
      {/* Ícono de lupa en SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"  // Tamaño fijo de la lupa
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm6-2l4 4"
        />
      </svg>
      {/* Texto "Buscar", oculto en pantallas pequeñas */}
      <p className="hidden sm:inline text-sm sm:text-base ml-2">Buscar</p> 
    </button>
  );
}
