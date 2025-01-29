
const rubric = [
        { 
            subCompetencia: "Habilidad tecnológica", 
            inicial: "El alumno tiene dificultad para operar herramientas tecnológicas básicas.", 
            enProceso: "El alumno muestra cierta capacidad para manejar herramientas con ayuda.", 
            satisfactorio: "El alumno maneja las herramientas asignadas de forma autónoma.", 
            sobresaliente: "El alumno domina ampliamente todas las herramientas asignadas.", 
            calificacion: "A" 
        },
        { 
            subCompetencia: "Adaptación", 
            inicial: "El alumno enfrenta dificultades para adaptarse a cambios en el entorno de trabajo.", 
            enProceso: "El alumno puede adaptarse con apoyo y guía constante.", 
            satisfactorio: "El alumno se adapta a los cambios con mínima supervisión.", 
            sobresaliente: "El alumno se adapta de manera proactiva y sugiere mejoras.", 
            calificacion: "B" 
        },
        { 
            subCompetencia: "Trabajo en equipo", 
            inicial: "El alumno tiende a trabajar de forma individual y no colabora con sus compañeros.", 
            enProceso: "El alumno colabora ocasionalmente cuando se le solicita.", 
            satisfactorio: "El alumno trabaja bien en equipo y apoya a sus compañeros.", 
            sobresaliente: "El alumno fomenta la colaboración y lidera iniciativas de grupo.", 
            calificacion: "A" 
        }
];

export function GrillaDetalleCalificacion({ subcompetencias }) {
    return (
        <div className="w-full mx-auto">
            <div className="overflow-x-auto rounded-t-2xl shadow-md">
                <table className="min-w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-clrTableHead text-white">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold">Sub Competencia</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold">Inicial</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold">En proceso</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold">Satisfactorio</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold">Sobresaliente</th>
                            <th className="px-4 py-2 text-center text-xs font-semibold">Calificación</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {subcompetencias.map((subcomp, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                    {subcomp.subcompetencia_info.nombre}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                    {subcomp.subcompetencia_info.nivelInicial}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                    {subcomp.subcompetencia_info.nivelEnProceso}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                    {subcomp.subcompetencia_info.nivelSatisfactorio}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                    {subcomp.subcompetencia_info.nivelSobresaliente}
                                </td>
                                <td
                                    className={`px-4 py-2 text-sm font-semibold text-center ${
                                        subcomp.valor === 'C' || subcomp.valor === 'D'
                                            ? 'text-red-500'
                                            : 'text-black'
                                    }`}
                                >
                                    {subcomp.valor}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Leyenda de Calificación</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                    <span className="font-bold text-black">A: </span> Sobresaliente
                    <span className="font-bold text-black"> | B: </span> Satisfactorio
                    <span className="font-bold text-black"> | C: </span> En proceso
                    <span className="font-bold text-black"> | D: </span> Inicial
                    </li>
                </ul>
            </div>
        </div>
    );
}

