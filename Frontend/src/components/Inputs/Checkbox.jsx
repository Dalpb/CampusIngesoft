import React from "react";

export function EstadoRetiroCheckbox({ estadoRetiro, estadoSolicitud, isSelected, onChange }) {
  if (estadoRetiro === true) {
    // Aprobado
    return (
      <span
        className="text-green-600 text-lg cursor-default"
        title="Retiro aprobado"
      >
        ✔️
      </span>
    );
  } else if (estadoSolicitud === true && estadoRetiro === false) {
    // En proceso
    return (
      <span
        className="text-gray-500 text-lg cursor-default"
        title="Solicitud en proceso"
      >
        ⏳
      </span>
    );
  } else if (estadoSolicitud === false && estadoRetiro === false) {
    // Rechazado
    return (
      <span
        className="text-red-600 text-lg cursor-default"
        title="Solicitud rechazada"
      >
        ❌
      </span>
    );
  } else {
    // Sin solicitud previa
    return (
      <span
        className={`text-black-600 text-lg cursor-pointer`}
        onClick={onChange}
        title={isSelected ? "Desmarcar solicitud" : "Marcar para solicitar retiro"}
      >
        {isSelected ? "☑️" : "⬜"}
      </span>
    );
  }
}

