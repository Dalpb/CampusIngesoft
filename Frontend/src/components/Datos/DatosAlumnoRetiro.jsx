export function DatosAlumnoRetiro({ studentData }) {
  return (
    <div className="mb-6">
      <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text mb-4">Solicitud de Retiro de Cursos</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Nombre:</label>
          <input
            type="text"
            value={`${studentData.nombre || ""} ${studentData.primerApellido || ""} ${studentData.segundoApellido || ""}`}
            disabled
            className="w-full border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500" // Texto en gris
          />
        </div>
        <div>
          <label className="block text-gray-700">Código:</label>
          <input
            type="text"
            value={studentData.codigo || ""}
            disabled
            className="w-full border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500" // Texto en gris
          />
        </div>
        <div>
          <label className="block text-gray-700">Correo:</label>
          <input
            type="text"
            value={studentData.correo || ""}
            disabled
            className="w-full border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500" // Texto en gris
          />
        </div>
        <div>
          <label className="block text-gray-700">Periodo:</label>
          <input
            type="text"
            value={studentData.periodo || ""}
            disabled
            className="w-full border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500" // Texto en gris
          />
        </div>
      </div>
    </div>
  );
}
