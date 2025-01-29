import { useState, useEffect } from "react";
import { notesCoursesByStudent } from "../../services/studentServices";
import { LoadingLayout } from "../Layout/Layout";

export function GrillaDetalleNotas({ userInformation, selectedPeriod, horariosEstado }) {
  const [coursesNotes, setCoursesNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para la carga de datos

  console.log("Estados de los cursos: ", horariosEstado);
  // Función para mostrar las notas según su valor
  function mostrarNota(nota, esRetirado) {
    if (esRetirado) {
      return <span className="text-gray-400">--</span>; // Mostrar guion si el curso está retirado
    }
    
    if (nota === -3) {
      return <span className="text-gray-400">NT</span>; // "No Tiene"
    }
    if (nota === -1) {
      return <span className="text-gray-400"> - </span>; // Sin nota aún
    }
    if (nota === -2) {
      return <span className="text-red-500">Falta</span>; // Falta
    }

    // Condición para notas menores a 11
    const notaColor = nota < 11 ? "text-red-500" : "text-black";
    return <span className={`${notaColor}`}>{nota}</span>;
  }

  // Función para construir la fórmula de evaluación
  function construirFormula({ pesoParciales, pesoFinales, pesoPracticas }) {
    // Si los pesos son todos 0, mostramos "Nota Única"
    if (pesoParciales === 0 && pesoFinales === 0 && pesoPracticas === 0) {
      return "Nota Única";
    }

    // Construimos la fórmula excluyendo evaluaciones con peso 0
    const partes = [];
    if (pesoParciales > 0) partes.push(`${pesoParciales}*Parcial`);
    if (pesoFinales > 0) partes.push(`${pesoFinales}*Final`);
    if (pesoPracticas > 0) partes.push(`${pesoPracticas}*Prom. Prácticas`);

    return partes.join(" + ");
  }

  // Procesar cursos y evaluaciones
  function procesarCursos(cursos) {
    cursos["cursos"].forEach((curso) => {
      const { pesoParciales, pesoFinales, pesoPracticas } = curso.formula;

      // Manejo para prácticas (PCS)
      if (pesoPracticas === 0) {
        for (let i = 1; i <= 5; i++) {
          curso.evaluaciones.push({
            tipo: "Practica",
            indice: i,
            valor: -3, // NT
          });
        }
      } else {
        const practicasExistentes = new Set();
        curso.evaluaciones
          .filter((evaluacion) => evaluacion.tipo === "Practica")
          .forEach((evaluacion) => practicasExistentes.add(evaluacion.indice));
        for (let i = 1; i <= 5; i++) {
          if (!practicasExistentes.has(i)) {
            curso.evaluaciones.push({
              tipo: "Practica",
              indice: i,
              valor: -1, // Sin nota aún
            });
          }
        }
      }

      // Manejo para Parciales
      if (pesoParciales === 0) {
        curso.evaluaciones.push({
          tipo: "Parcial",
          indice: 1,
          valor: -3, // NT
        });
      } else if (!curso.evaluaciones.some((ev) => ev.tipo === "Parcial" && ev.indice === 1)) {
        curso.evaluaciones.push({
          tipo: "Parcial",
          indice: 1,
          valor: -1, // Sin nota aún
        });
      }

      // Manejo para Finales
      if (pesoFinales === 0) {
        curso.evaluaciones.push({
          tipo: "Final",
          indice: 1,
          valor: -3, // NT
        });
      } else if (!curso.evaluaciones.some((ev) => ev.tipo === "Final" && ev.indice === 1)) {
        curso.evaluaciones.push({
          tipo: "Final",
          indice: 1,
          valor: -1, // Sin nota aún
        });
      }
    });

    return cursos;
  }

  const getStudentsCourses = async () => {
    setIsLoading(true); // Activa el estado de carga antes de obtener los datos
    try {
      const studentCoursesNotes = await notesCoursesByStudent(userInformation.id, selectedPeriod.id);
      const processedCourses = procesarCursos(studentCoursesNotes);
      setCoursesNotes(processedCourses);
      console.log("Cursos Notes: ", coursesNotes);
    } catch (error) {
      console.error("Error al obtener los cursos:", error);
    } finally {
      setIsLoading(false); // Desactiva el estado de carga después de obtener los datos
    }
  };

  useEffect(() => {
    if (selectedPeriod) {
      getStudentsCourses();
    }
  }, [selectedPeriod]);

  // Mostrar indicador de carga mientras se obtienen los datos
  // if (isLoading) {
  //   return (
  //     <div className="mt-20">
  //       <LoadingLayout msg="Cargando las notas de los cursos..." />
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto rounded-t-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Encabezado con dos niveles */}
          <thead className="bg-clrTableHead">
            <tr>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-white tracking-wider w-3/12"
              >
                Nombre del curso
              </th>
              <th colSpan={5} className="text-center text-xs font-medium text-white tracking-wider w-6/12">
                Pa
              </th>
              <th colSpan={2} className="text-center text-xs font-medium text-white tracking-wider w-2/12 border-l border-gray-300">
                Ex
              </th>
              <th className="text-xs font-medium text-white tracking-wider w-1/12 border-l border-gray-300">
                Nota Final
              </th>
            </tr>
            <tr>
              <th colSpan={9}>
                <hr style={{ border: "1px solid white", width: "100%" }} />
              </th>
            </tr>
            <tr>
              <th className="px-2 py-3 text-left"></th>
              <th className="text-center text-white w-1/12">1</th>
              <th className="text-center text-white w-1/12">2</th>
              <th className="text-center text-white w-1/12">3</th>
              <th className="text-center text-white w-1/12">4</th>
              <th className="text-center text-white w-1/12">5</th>
              <th className="text-center text-white w-1/12 border-l border-gray-300">1</th>
              <th className="text-center text-white w-1/12">2</th>
              <th className="text-center w-1/12 border-l border-gray-300"></th>
            </tr>
          </thead>

          {/* Cuerpo de la tabla */}
          <tbody className="bg-white divide-y divide-gray-300">
            {console.log("Cursos: ", coursesNotes)}
            {console.log("HorariosEstado: ", horariosEstado)}
            {coursesNotes?.cursos?.slice().reverse().map((curso, index) => {
              const esRetirado = horariosEstado[index]?.estadoRetiro; // Verificar si el curso está retirado

              return (
              <tr key={curso.curso_clave} className={`${esRetirado ? "bg-gray-100" : ""}`}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-black-900 w-3/12">
                  <span className="text-gray-500 ">{curso.curso_nombre}</span> 
                  {esRetirado && (
                    <span className="ml-2 px-2 py-1 text-xs font-bold text-gray-600 bg-gray-200 rounded-md">
                      Retirado
                    </span>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{construirFormula(curso.formula)}</p>
                </td>

                {/* Notas para prácticas */}
                {Array.from({ length: 5 }).map((_, i) => {
                  const evaluacion = curso.evaluaciones.find(
                    (ev) => ev.tipo === "Practica" && ev.indice === i + 1
                  );
                  return (
                    <td key={`practica-${i + 1}`} className="text-center text-sm w-1/12">
                      {mostrarNota(evaluacion?.valor, esRetirado)}
                    </td>
                  );
                })}

                {/* Notas para exámenes */}
                <td className="text-center text-sm w-1/12 border-l border-gray-300">
                  {mostrarNota(curso.evaluaciones.find((ev) => ev.tipo === "Parcial" && ev.indice === 1)?.valor, esRetirado)}
                </td>
                <td className="text-center text-sm w-1/12">
                  {mostrarNota(curso.evaluaciones.find((ev) => ev.tipo === "Final" && ev.indice === 1)?.valor, esRetirado)}
                </td>

                {/* Resultado con color según la condición */}
                {/* Nota final */}
                <td
                  className={`text-center text-sm font-bold w-1/12 border-l border-gray-300 ${
                    esRetirado
                      ? "text-gray-400"
                      : Math.round(curso.promedioFinal) < 11
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {esRetirado 
                    ? "--" 
                    : curso.promedioFinal === -1 
                      ? "--" 
                      : Math.round(curso.promedioFinal)}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Leyenda de Calificación</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    <span className="font-bold text-black"> NT   : </span> No tiene evaluaciones
                  </li>
                  <li>
                    <span className="font-bold text-black"> "--" :</span> Aun no evaluado
                  </li>
                </ul>
        </div>
      </div>
    </div>
  );
}
