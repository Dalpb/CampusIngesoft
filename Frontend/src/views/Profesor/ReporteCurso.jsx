import React, { useState, useEffect } from 'react';
import {getNotesList} from '../../services/coursesServices';
import { getNotesByEvaluation } from '../../services/coursesServices';
import { useLocation } from 'react-router-dom';
import { EvaluacionDropdown } from '../../components/Inputs/Dropdown';
import { useAuth } from "../../context/AuthContext";
import { PieChart } from '../../components/Dashboard/GraficoPastel';
import { Users, UserCheck, UserX, Calculator } from 'lucide-react';
import { EmptyState } from '../../components/grilla/grillaEmpty';
import { ChartSwitcher } from '../../components/Dashboard/GraficoPastel';

export function ReporteCurso() {
  const {userInformation,getName} = useAuth();
  const location = useLocation();
  const { cursoId, cursoNombre, horarioId, horarioNumero, periodo,periodoId } = location.state || {};
  const [totalStudents, setTotalStudents] = useState(0);
  const [absent, setAbsent] = useState(0); // Nuevo estado para alumnos ausentes
  const [approved, setApproved] = useState(0);
  const [disapproved, setDisapproved] = useState(0);
  const [finalAverage, setFinalAverage] = useState(0);
  const [evaluaciones, setEvaluaciones] = useState([]); // Estado para almacenar todas las evaluaciones
  const [selectedEvaluation, setSelectedEvaluation] = useState(null); // Estado para la evaluación seleccionada
  const [hasData, setHasData] = useState(false); //Estado en caso no haya datos para realizar el grafico
  const [userHasSelected, setUserHasSelected] = useState(false); // Nuevo estado para rastrear si el usuario hizo una selección
  const [chartType, setChartType] = useState("pie");

  useEffect(() => {
    if (horarioId) {
      getNotesList(horarioId)
        .then(data => {
          const evaluationsWithIndex = data.map((evaluation, index) => ({
            key: `${evaluation.tipo}-${evaluation.indice}`,
            value: `${evaluation.tipo} ${evaluation.indice}`,
            tipo: evaluation.tipo,
            indice: evaluation.indice,
          }));
          setEvaluaciones(evaluationsWithIndex);
          console.log("evaluaciones: ", evaluationsWithIndex)
        })
        .catch(error => {
          console.error("Error fetching evaluations:", error);
        });
    }
  }, [horarioId]);

  if (!userInformation) {
    return <div>Cargando datos del usuario...</div>; // until loading 
  }

  // Llamar directamente al handlefilter al seleccionar en el dropdown
  const handleEvaluationSelect = (value) => {
    setUserHasSelected(true); // El usuario ha seleccionado una evaluación
    setSelectedEvaluation(value);
    handleFilter(value);
  };

  const handleFilter = (selectedEvaluation) => {
    if (selectedEvaluation && horarioId) {
        // Reiniciar los estados al iniciar la nueva búsqueda
        setHasData(undefined);
        setTotalStudents(0);
        setApproved(0);
        setDisapproved(0);
        setFinalAverage(0);
        setAbsent(0);
        
        // Buscar el objeto de evaluación seleccionada
        const selectedEvalObject = evaluaciones.find(e => e.value === selectedEvaluation);
        if (!selectedEvalObject) {
            console.warn("No se encontró una evaluación con el valor proporcionado.");
            return;
        }
        const { tipo, indice } = selectedEvalObject;
        getNotesByEvaluation(horarioId, tipo, indice,periodoId)
            .then(data => {
                // Filtrar las notas válidas para evitar casos donde están vacías o con valores inválidos
                // Se tiene a alumnos con nota y con Falta
                const validStudents = data.filter(student => 
                student.notas && 
                student.notas.some(nota => nota.valor !== -1)
                );

                // Validaciones
                console.log("Datos recibidos de la API:", validStudents.length); // Verifica lo que se recibe de la API
                if (validStudents.length === 0) {
                  setHasData(false); // No hay datos
                  console.warn("No se encontraron notas para la evaluación seleccionada.");
                }
                else {
                  console.log("Si se encuentra datos");
                  setHasData(true);

                  const absentCount = data.filter(student => 
                    student.notas.some(nota => nota.valor === -2)
                  ).length;
                  console.log("Cantidad de faltantes: ", absentCount);

                  // Filtrar las notas para ignorar aquellas con valor -1
                  const validNotes = data.flatMap(student => 
                      student.notas.filter(nota => nota.valor !== -1 && nota.valor !== -2)
                  );

                  const total = validNotes.length; //Solo alumnos con nota
                  const approvedCount = validNotes.filter(nota => nota.valor >= 11).length;
                  const disapprovedCount = total - approvedCount;
                  const average = total > 0 
                      ? validNotes.reduce((sum, nota) => sum + nota.valor, 0) / total 
                      : 0;

                  setTotalStudents(total + absentCount);
                  setApproved(approvedCount);
                  setDisapproved(disapprovedCount);
                  setFinalAverage(average.toFixed(2));
                  setAbsent(absentCount); // Actualizar el estado de ausentes
                }
            })
            .catch(error => {
                console.error("Error fetching notes for the evaluation:", error);
                setHasData(false);
            });
    } else {
        console.warn("Faltan datos necesarios para filtrar: evaluación o horarioId");
    }
  };

  // Porcentajes
  const approvedPercentage =
  totalStudents > absent && totalStudents > 0
    ? (approved / (totalStudents - absent) * 100).toFixed(2)
    : 0;

  const disapprovedPercentage =
  totalStudents > absent && totalStudents > 0
    ? (disapproved / (totalStudents - absent) * 100).toFixed(2)
    : 0;

  return (
      <div className="p-6 mt-0 px-0 rounded-lg w-full max-w-6xl mx-auto">
        {/* Contenedor para el título, nombre del curso y dropdown */}
        <div className="flex flex-col items-start space-y-4 mb-6">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text">Análisis Estadístico de Calificaciones</h1>
          <h1 className="text-2xl font-semibold text-muted-foreground mt-2">{cursoNombre}</h1>
          
          {/* Dropdown alineado a la izquierda */}
          <div className='bg-white p-4 rounded-lg shadow-md w-full flex flex-col space-y-2'>
            <div className="w-full sm:w-[250px]"> {/* Ajustamos el ancho aquí */}
              <EvaluacionDropdown 
                evaluaciones={evaluaciones} 
                onSelect={handleEvaluationSelect} 
              />
            </div>
          </div>
        </div>

        {/* Contenedor del reporte y las tarjetas */}
        <div className=" my-6 flex flex-col lg:flex-row items-stretch lg:space-x-6 w-full">
          <div className="w-full lg:w-5/6 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gray-100 border-b">
              <h3 className="text-xl font-bold w-full lg:w-5/6">Distribución de Rendimiento Académico</h3>
            </div>
            <div className="p-6 flex flex-col md:flex-row items-center justify-around flex-grow">
              {hasData === undefined ? (
                <div className="text-center text-gray-500">
                  <p className="text-lg font-semibold">Cargando datos...</p>
                </div>
              ): !selectedEvaluation ? (
                <div className="text-center text-gray-500">
                  <p className="text-lg font-semibold">Seleccione una evaluación para mostrar el gráfico.</p>
                  <p className="text-sm">Utilice el menú desplegable para elegir una evaluación y visualizar los datos correspondientes.</p>
                </div>
              ) : !hasData ? (
                <tr>
                  <td colSpan="5">
                    <EmptyState
                      mainMessage="Aún no hay notas registradas para esta evaluación."
                      secondaryMessage="Tan pronto como se suban al sistema, se mostrarán los datos y 
                                        gráficos correspondientes aquí."
                    />
                  </td>
                </tr>
              ) : (
                <>
                  <div className="w-64 h-64 mb-4 md:mb-0">
                    <PieChart approved={approved} disapproved={disapproved} />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg font-semibold mb-2">Porcentajes:</p>
                    <p className="text-green-600 font-semibold">Aprobados: {approvedPercentage}%</p>
                    <p className="text-red-600 font-semibold">Desaprobados: {disapprovedPercentage}%</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full lg:w-auto max-w-xs ml-auto">
            <div className="grid grid-cols-1 gap-4">
              <StatCard icon={<Users className="w-6 h-6 text-blue-500" />} title="Alumnos" value={totalStudents} />
              <StatCard icon={<UserCheck className="w-6 h-6 text-green-500" />} title="Aprobados" value={approved} />
              <StatCard icon={<UserX className="w-6 h-6 text-red-500" />} title="Desaprobados" value={disapproved} />
              <StatCard icon={<Users className="w-6 h-6 text-yellow-500" />} title="Ausentes" value={absent} />
              <StatCard icon={<Calculator className="w-6 h-6 text-purple-500" />} title="Promedio final" value={finalAverage} />
            </div>
          </div>
        </div>
      </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-start text-left">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}