import React, {useState, useEffect} from 'react';
import { FileText, ClipboardList, Calendar, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActionButton } from '../../components/Button/ButtonPanel';
import { getPeriodCourses } from '../../services/coursesServices';
import { useAuth } from "../../context/AuthContext";
import { AnimatedContainer } from '../../components/Layout/AnimatedContainer';

export function PanelDirector(){
  const {userInformation} = useAuth();
  const [ultimoPeriodo, setUltimoPeriodo] = useState(null); // Estado para el último período.
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchPeriodos() {
      try {
        const data = await getPeriodCourses();
        const sortedPeriodos = data.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)); // Ordena los períodos por fecha.
        setUltimoPeriodo(sortedPeriodos[0]); // Selecciona el último período.
      } catch (err) {
        console.error("Error al cargar los periodos:", err);
        setError("No se pudo cargar la información de los periodos.");
      }
    }
    fetchPeriodos();
  }, []);

  if (!userInformation) {
    return <div>Cargando datos del usuario...</div>; // until loading
  }

  return(
    <AnimatedContainer>
      <div className="flex justify-center items-start min-h-screen bg-gray-100 mt-16">
        <div className="w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="bg-clrNavbar text-white p-3">
            <div className="mt-2 flex items-center space-x-4">
              {error ? (
                <h2 className="text-red-500 text-2xl font-bold">No se pudo cargar el periodo.</h2>
              ) : (
                <h2 className="text-xl font-bold">
                  Temporada del ciclo: {ultimoPeriodo ? ultimoPeriodo.periodo : "Cargando..."}
                </h2>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <ActionButton
              to={`/director/${ultimoPeriodo?.id || ""}/cursos/visualizar`}
              icon={FileText}
              title="Visualización de Cursos a Dictar Previo a la Matricula"
              description="Ver lista de cursos asignados para el ciclo actual"
            />
            <ActionButton
              to={`/director/${ultimoPeriodo?.id || ""}/matricula/administrar`}
              icon={UserCheck}
              title="Administración de Matrícula"
              description="Gestionar todo el proceso de matrícula de estudiantes"
            />
            <ActionButton
              to={`/director/${ultimoPeriodo?.id || ""}/gestionarRetiros`}
              icon={ClipboardList}
              title="Gestión de Retiro de Cursos"
              description="Administrar solicitudes de retiro de cursos"
            />
          </div>
        </div>
      </div>
    </AnimatedContainer>
  )
}

