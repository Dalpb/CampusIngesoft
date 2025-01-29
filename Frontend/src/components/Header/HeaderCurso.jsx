//Componente Responsivo a reutilizar
export function HeaderCurso({ codigoCurso, nombreCurso, horario, ciclo }) {
  return (
    <div className="text-center sm:text-left">
      {/* Ajuste responsivo del tamaño del título */}
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
        {codigoCurso} - {nombreCurso}
      </h1>
      {/* Texto secundario también adaptado a diferentes pantallas */}
      <p className="text-sm sm:text-base md:text-lg text-gray-700">
        Horario: {horario}
      </p>
      <p className="text-sm sm:text-base md:text-lg text-gray-700">
        Ciclo dictado: {ciclo}
      </p>
    </div>
  );
}
