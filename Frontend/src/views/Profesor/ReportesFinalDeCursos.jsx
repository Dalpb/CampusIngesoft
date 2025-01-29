import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DropdownGenerico , EvaluacionDropdown } from '../../components/Inputs/Dropdown';
import { useAuth } from "../../context/AuthContext";
import { ChartSwitcher } from '../../components/Dashboard/GraficoPastel';
import { Users, UserCheck, UserX, Calculator } from 'lucide-react';
import { EmptyState } from '../../components/grilla/grillaEmpty';
import { ButtonSpecial } from '../../components/Button/ButtonSpecial';
import { getNotesList, coursesByTeacher } from '../../services/coursesServices';
import { getNotesByEvaluation, getPeriodCourses } from '../../services/coursesServices';
import { motion } from 'framer-motion';

export function ReportesFinalDeCursos() {
  const {userInformation,getName} = useAuth();
  const location = useLocation();
  const { cursoId, cursoNombre, horarioId, horarioNumero, periodo } = location.state || {};

  // Estados para los dropdowns
  const [ciclos, setCiclos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);

  // Estado para selección de tipo de gráfico
  const [chartType, setChartType] = useState('pie');

  // Estados para las selecciones
  const [selectedCiclo, setSelectedCiclo] = useState('');
  const [selectedCurso, setSelectedCurso] = useState('');
  const [selectedHorarioId, setSelectedHorarioId] = useState(null); // Guarda el ID del horario
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  // Estados para estadísticas
  const [totalStudents, setTotalStudents] = useState(0);
  const [absent, setAbsent] = useState(0); // Nuevo estado para alumnos ausentes
  const [approved, setApproved] = useState(0);
  const [disapproved, setDisapproved] = useState(0);
  const [finalAverage, setFinalAverage] = useState(0);
  const [hasData, setHasData] = useState(false); //Estado en caso no haya datos para realizar el grafico
  //const [userHasSelected, setUserHasSelected] = useState(false); // Nuevo estado para rastrear si el usuario hizo una selección

  // Estados de carga
  const [loadingCiclos, setLoadingCiclos] = useState(false);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [loadingEvaluaciones, setLoadingEvaluaciones] = useState(false);

  // Estados de errores
  const [error, setError] = useState(null);

  // Cargar ciclos al montar el componente
  useEffect(() => {
    setLoadingCiclos(true);
    getPeriodCourses()
      .then((data) => {
        setCiclos(data.map(({ id, periodo }) => ({ value: id, label: periodo })));
      })
      .catch(() => setError('Error al cargar ciclos'))
      .finally(() => setLoadingCiclos(false));
  }, []);

  // Cargar cursos al seleccionar un ciclo
  useEffect(() => {
    if (selectedCiclo) {
      setLoadingCursos(true);
      coursesByTeacher(userInformation.id, selectedCiclo)
        .then((data) => {
          setCursos(data.map(({ id, nombre, horarios }) => ({ value: id, label: nombre, horarios })));
        })
        .catch(() => setError('Error al cargar cursos'))
        .finally(() => setLoadingCursos(false));
    } else {
      setCursos([]);
    }
  }, [selectedCiclo]);

  // Cargar evaluaciones al seleccionar un curso(por medio del id horario)
  useEffect(() => {
    console.log("Horario Selected: ", selectedHorarioId);
    if (selectedHorarioId) {
      setLoadingEvaluaciones(true);
      getNotesList(selectedHorarioId)
        .then(data => {
          console.log("Evaluaciones del horario: ", data);
          const evaluationsWithIndex = data.map(({ tipo, indice }) => ({
            value: `${tipo} ${indice}`,
            label: `${tipo} ${indice}`, // Esto se mostrará en el dropdown
            tipo,
            indice,
          }));
          setEvaluaciones(evaluationsWithIndex);
          console.log("Evaluaciones para el dropdown: ", evaluaciones);
        })
        .catch(() => setError('Error al cargar evaluaciones'))
        .finally(() => setLoadingEvaluaciones(false));
    }
  }, [selectedHorarioId]);
  

  // Llamar directamente al handlefilter al seleccionar en el dropdown
  const handleEvaluationSelect = (value) => {
    setSelectedEvaluation(value);
    handleFilter(value);
  };

  const handleFilter = (selectedEvaluation) => {
    if (selectedEvaluation && selectedHorarioId) {
        // Reiniciar los estados al iniciar la nueva búsqueda
        setHasData(undefined);
        setTotalStudents(0);
        setApproved(0);
        setDisapproved(0);
        setFinalAverage(0);
        setAbsent(0);
        
        // Buscar el objeto de evaluación seleccionada
        const selectedEvalObject = evaluaciones.find(e => e.value === selectedEvaluation);
        console.log("selectedEvalObject")
        console.log(selectedEvalObject)
        if (!selectedEvalObject) {
            console.warn("No se encontró una evaluación con el valor proporcionado.");
            return;
        }
        const { tipo, indice } = selectedEvalObject;
        getNotesByEvaluation(selectedHorarioId, tipo, indice,selectedCiclo)
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
  // Limpiar filtros
  const clearFilters = () => {

    setTimeout(() => {
      setSelectedCiclo('');
      setSelectedCurso('');
      setSelectedHorarioId(null);
      setSelectedEvaluation('');
      setCursos([]);
      setEvaluaciones([]);
      setHasData(false);
      setTotalStudents(0);
      setApproved(0);
      setDisapproved(0);
      setFinalAverage(0);
      setAbsent(0);
      setChartType("");
    }, 300);
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
    <motion.div
            className='md:px-16 px-2 py-4 flex flex-col gap-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
    >
      <div className="p-6 mt-0 px-0 rounded-lg w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-start space-y-4 mb-6">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
            Análisis Estadístico de Calificaciones
          </h1>
          
          <div className="bg-white p-4 rounded-lg shadow-md w-full">
            <div className="flex flex-wrap gap-4 mb-4 items-end">
              {/* Dropdown Ciclo */}
              
              <div className="flex-1 min-w-[200px]">
                <DropdownGenerico
                  label="Ciclo"
                  value={selectedCiclo}
                  options={ciclos}
                  onChange={setSelectedCiclo}
                  loading={loadingCiclos}
                  className=""
                />
              </div>

              {/* Dropdown Curso */}
              <div className="flex-1 min-w-[200px]">
                <DropdownGenerico
                  label="Curso"
                  value={selectedCurso}
                  options={cursos}
                  onChange={(cursoId) => {
                    setSelectedCurso(cursoId);
                    const cursoSeleccionado = cursos.find((curso) => curso.value === Number(cursoId));
                    const horarioId = cursoSeleccionado?.horarios?.[0]?.id || null;
                    setSelectedHorarioId(horarioId);
                    setSelectedEvaluation(''); // Reinicia el estado de evaluación al cambiar el curso
                    setEvaluaciones([]); // Limpia las evaluaciones al cambiar el curso
                  }}
                  loading={loadingCursos}
                  disabled={!selectedCiclo}
                  className=""
                />
              </div>

              {/* Dropdown Evaluación */}
              <div className="flex-1 min-w-[200px]">
                <DropdownGenerico
                  label="Evaluación"
                  value={selectedEvaluation}
                  options={evaluaciones}
                  onChange={(value) => {
                    setSelectedEvaluation(value); // Actualiza el estado global
                    if (value) handleFilter(value); // Llama al filtro si se seleccionó una evaluación
                  }}
                  loading={loadingEvaluaciones}
                  disabled={!selectedCurso || evaluaciones.length === 0}
                  className=""
                />
              </div>

              {/* Dropdown Tipo de Gráfico */}
              <div className="flex-1 min-w-[200px]">
                <DropdownGenerico
                  label="Tipo de Gráfico"
                  value={chartType}
                  options={[
                    { value: '', label: 'Seleccione gráfico' },
                    { value: 'pie', label: 'Gráfico de Pastel' },
                    { value: 'bar', label: 'Gráfico de Barras' },
                  ]}
                  onChange={setChartType}
                />
              </div>

              {/* Botón Limpiar Filtros */}
              <div className="flex-shrink-0">
                <ButtonSpecial
                  type="Clean"
                  action={clearFilters}
                  disable={!selectedCiclo && !selectedCurso && !selectedEvaluation}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="my-6 flex flex-col lg:flex-row items-stretch lg:space-x-6 w-full">
          <div className="w-full lg:w-5/6 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gray-100 border-b">
              <h3 className="text-xl font-bold">Distribución de Rendimiento Académico</h3>
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
                  <div className="w-64 h-64 mb-4 md:mb-0 flex justify-center">
                    <ChartSwitcher approved={approved} disapproved={disapproved} type={chartType}/>
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
    </motion.div>
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