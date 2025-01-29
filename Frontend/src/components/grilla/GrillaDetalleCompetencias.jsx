import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
export function GrillaDetalleCompetencias({claveCurso, clave, nombre, calificaciones, period}) {
    const navigate = useNavigate();
    const location = useLocation();
    const handleCalificacionClick = (comp) => {
        navigate(`/alumno/cursos/${claveCurso}/detalleCompetencias/detalle-calificacion`, {
          state:{
            ...location.state,
            periodo: period,
            competenciaSeleccionada: {
              clave,
              nombre,
              ...comp
            }
          }});
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow mb-6 w-full">
        <div className="overflow-x-auto rounded-t-2xl shadow-md">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-clrTableHead text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs tracking-wider w-1/12">Clave</th>
                <th className="px-4 py-3 text-left text-xs tracking-wider w-2/12">Nombre</th>
                {calificaciones.map((comp, index) => (
                  <th key={comp.indice} className="text-center text-xs tracking-wider">
                    {/* {calificaciones.length - 1 !== index ? `${comp.indice}° Calificación` : "Calificación final"} */}
                    {`${comp.indice}° Calificación`}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-300">
              <tr>
                <td className="px-4 py-4 text-left text-sm text-black-900">{clave}</td>
                <td className="px-4 py-4 text-left text-sm text-black-900">{nombre}</td>
                {calificaciones.map((comp, index) => (
                  <td
                  key={index}
                  className={`px-4 py-4 text-center text-sm underline cursor-pointer ${
                      comp.valor === 'C' || comp.valor === 'D' ? 'text-red-500' : 'text-black'
                    }
                    ${calificaciones.length-1 === index && "font-bold" }`}
                    onClick={comp.valor === "."? ()=>{}: () => handleCalificacionClick(comp)}
                  >
                    {comp.valor === "." ? "-": comp.valor}
                  </td>
                ))}
              </tr>
            </tbody>

            
          </table>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Leyenda de Calificación</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                    <span className="font-bold text-black">A: </span> Sobresaliente
                    <span className="font-bold text-black"> | B: </span> Satisfactorio
                    <span className="font-bold text-black"> | C: </span> En proceso
                    <span className="font-bold text-black"> | D: </span> Inicial
                    </li>
                    <span className="font-bold text-black">  - : </span> Aún no se tiene la nota

                </ul>
            </div>
        </div>

      </div>
    );
}
