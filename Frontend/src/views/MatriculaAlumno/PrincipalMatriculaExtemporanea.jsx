import React, { useState, useEffect } from 'react';
import { getNotesList } from '../../services/coursesServices';
import { getNotesByEvaluation } from '../../services/coursesServices';
import { useLocation } from 'react-router-dom';
import { EvaluacionDropdown } from '../../components/Inputs/Dropdown';
import { Statistics } from '../../components/Dashboard/Statistics'; // Importamos el componente de estadísticas
import Layout from '../../components/Layout/Layout';
import { useAuth } from "../../context/AuthContext";
import { PieChart } from '../../components/Dashboard/GraficoPastel';
import { Users, UserCheck, UserX, Calculator } from 'lucide-react';

export function PrincipalMatriculaExtemporanea() {
  const eventos = [
    { evento: "Publicación de las cursos y horarios", fecha: "Jueves, 16 agosto de 2024" },
    { evento: "Inicio y cierre de la prematrícula", fecha: "Desde el lunes 5 hasta el jueves 8 de agosto del 2024" },
    { evento: "Publicación de cursos matriculados en prematrícula", fecha: "Viernes, 9 de agosto del 2024" },
    { evento: "Inicio y cierre de la matrícula extemporánea", fecha: "Desde el lunes 12 hasta el martes 13 de agosto del 2024" },
    { evento: "Publicación de cursos matriculados en matrícula extemporánea", fecha: "Jueves, 16 de agosto del 2024" },
  ];

  const { userInformation, getName } = useAuth();
  const location = useLocation();
  const { cursoId, cursoNombre, horarioId, horarioNumero, periodo } = location.state || {};
  const [totalStudents, setTotalStudents] = useState(0);
  const [approved, setApproved] = useState(0);
  const [disapproved, setDisapproved] = useState(0);
  const [finalAverage, setFinalAverage] = useState(0);
  const [evaluaciones, setEvaluaciones] = useState([]); // Estado para almacenar todas las evaluaciones
  const [selectedEvaluation, setSelectedEvaluation] = useState(null); // Estado para la evaluación seleccionada

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
          if (evaluationsWithIndex.length > 0) {
            setSelectedEvaluation(evaluationsWithIndex[0].value);
            handleFilter(evaluationsWithIndex[0].value);
          }
        })
        .catch(error => {
          console.error("Error fetching evaluations:", error);
        });
    }
  }, [horarioId]);

  if (!userInformation) {
    return <div>Cargando datos del usuario...</div>; // until loading 
  }


  return (
    <Layout title="Matrícula Extemporánea" userName={`${userInformation.nombre} ${userInformation.primerApellido} ${userInformation.segundoApellido}`}>
      <div className="p-6 mt-0 px-0 rounded-lg w-full max-w-6xl mx-auto">
        <h1 className="text-3xl text-center font-bold mb-4">Matrícula 2024 -2</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="bg-clrTableHead text-white font-semibold px-4 py-4 rounded-t-md mb-6">
            Inicio de matrícula y resultados
          </div>

          <div className="flex justify-around">

            {/* Tarjeta de Ver mi trayectoria Académica */}
            <div className="bg-white rounded-lg shadow p-4 w-1/4 flex flex-col items-center justify-center hover:shadow-lg cursor-pointer border-2 border-clrTableHead">
              <svg xmlns="http://www.w3.org/2000/svg" width="68" height="120" viewBox="0 0 68 65" fill="none">
                <path d="M52.3031 6.69761C52.3031 5.10648 51.4886 3.58051 50.0388 2.45542C48.589 1.33032 46.6227 0.698242 44.5723 0.698242C42.522 0.698242 40.5557 1.33032 39.1059 2.45542C37.6561 3.58051 36.8416 5.10648 36.8416 6.69761C36.8416 8.28874 37.6561 9.8147 39.1059 10.9398C40.5557 12.0649 42.522 12.697 44.5723 12.697C46.6227 12.697 48.589 12.0649 50.0388 10.9398C51.4886 9.8147 52.3031 8.28874 52.3031 6.69761ZM21.0096 22.6334C22.6041 21.3961 24.7784 20.6961 27.0493 20.6961C27.3553 20.6961 27.6613 20.7086 27.9512 20.7336L22.9262 32.4449C21.4284 35.9445 23.2 39.7941 27.2425 41.7564L41.1257 48.4932L37.0348 59.592C36.2457 61.7168 37.8401 63.9291 40.5781 64.5415C43.3161 65.1539 46.1668 63.9166 46.956 61.7918L51.5784 49.2431C52.5286 46.6684 51.1596 43.9187 48.2445 42.5063L39.0964 38.0693L44.0731 27.7704L44.8945 29.3077C47.3103 33.7822 52.9312 36.6944 59.1803 36.6944H62.6108C65.4615 36.6944 67.7646 34.9071 67.7646 32.6949C67.7646 30.4826 65.4615 28.6953 62.6108 28.6953H59.1803C57.1026 28.6953 55.2183 27.7204 54.4291 26.233L53.4144 24.3582C51.063 19.9712 46.3118 16.6216 40.4493 15.2217L32.6058 13.3469C30.818 12.9219 28.9497 12.697 27.0654 12.697C22.0726 12.697 17.2731 14.2343 13.7459 16.984L10.0094 19.8712C7.99614 21.4335 7.99614 23.9708 10.0094 25.5331C12.0226 27.0954 15.2921 27.0954 17.3053 25.5331L21.0257 22.6459L21.0096 22.6334ZM15.4531 44.6936H5.91849C3.06777 44.6936 0.764648 46.4809 0.764648 48.6932C0.764648 50.9054 3.06777 52.6927 5.91849 52.6927H17.1281C20.1882 52.6927 22.9584 51.2929 24.1985 49.1306L26.0507 45.8935L24.5207 45.1435C21.7021 43.7812 19.6084 41.7939 18.4166 39.5316L15.4531 44.6936Z" fill="#545CDC" />
              </svg>
              <h3 className="text-lg font-medium text-center">Ver mi trayectoria Académica</h3>
            </div>

            {/* Tarjeta de Iniciar pre matrícula */}
            <div className="bg-white rounded-lg shadow p-4 w-1/4 flex flex-col items-center justify-center hover:shadow-lg cursor-pointer border-2 border-clrTableHead">
              <svg xmlns="http://www.w3.org/2000/svg" width="67" height="120" viewBox="0 0 67 60" fill="none">
                <path d="M14.3571 0C6.4308 0 0 5.03906 0 11.25V48.75C0 54.9609 6.4308 60 14.3571 60H57.4286H62.2143C64.8614 60 67 58.3242 67 56.25C67 54.1758 64.8614 52.5 62.2143 52.5V45C64.8614 45 67 43.3242 67 41.25V3.75C67 1.67578 64.8614 0 62.2143 0H57.4286H14.3571ZM14.3571 45H52.6429V52.5H14.3571C11.71 52.5 9.57143 50.8242 9.57143 48.75C9.57143 46.6758 11.71 45 14.3571 45ZM19.1429 16.875C19.1429 15.8438 20.2196 15 21.5357 15H50.25C51.5661 15 52.6429 15.8438 52.6429 16.875C52.6429 17.9062 51.5661 18.75 50.25 18.75H21.5357C20.2196 18.75 19.1429 17.9062 19.1429 16.875ZM21.5357 22.5H50.25C51.5661 22.5 52.6429 23.3438 52.6429 24.375C52.6429 25.4062 51.5661 26.25 50.25 26.25H21.5357C20.2196 26.25 19.1429 25.4062 19.1429 24.375C19.1429 23.3438 20.2196 22.5 21.5357 22.5Z" fill="#515EDC" />
              </svg>
              <h3 className="text-lg font-medium text-center">Iniciar pre matrícula</h3>
            </div>

            {/* Tarjeta de Ver resultados de matrícula */}
            <div className="bg-white rounded-lg shadow p-4 w-1/4 flex flex-col items-center justify-center hover:shadow-lg cursor-pointer border-2 border-clrTableHead">
              <svg xmlns="http://www.w3.org/2000/svg" width="67" height="120" viewBox="0 0 67 60" fill="none">
                <path d="M60.7188 60H6.28125C2.81348 60 0 57.1205 0 53.5714V6.42857C0 2.87946 2.81348 0 6.28125 0H60.7188C64.1865 0 67 2.87946 67 6.42857V53.5714C67 57.1205 64.1865 60 60.7188 60ZM16.75 11.7857C13.858 11.7857 11.5156 14.183 11.5156 17.1429C11.5156 20.1027 13.858 22.5 16.75 22.5C19.642 22.5 21.9844 20.1027 21.9844 17.1429C21.9844 14.183 19.642 11.7857 16.75 11.7857ZM16.75 24.6429C13.858 24.6429 11.5156 27.0402 11.5156 30C11.5156 32.9598 13.858 35.3571 16.75 35.3571C19.642 35.3571 21.9844 32.9598 21.9844 30C21.9844 27.0402 19.642 24.6429 16.75 24.6429ZM16.75 37.5C13.858 37.5 11.5156 39.8973 11.5156 42.8571C11.5156 45.817 13.858 48.2143 16.75 48.2143C19.642 48.2143 21.9844 45.817 21.9844 42.8571C21.9844 39.8973 19.642 37.5 16.75 37.5ZM54.4375 19.2857V15C54.4375 14.1161 53.7309 13.3929 52.8672 13.3929H26.6953C25.8316 13.3929 25.125 14.1161 25.125 15V19.2857C25.125 20.1696 25.8316 20.8929 26.6953 20.8929H52.8672C53.7309 20.8929 54.4375 20.1696 54.4375 19.2857ZM54.4375 32.1429V27.8571C54.4375 26.9732 53.7309 26.25 52.8672 26.25H26.6953C25.8316 26.25 25.125 26.9732 25.125 27.8571V32.1429C25.125 33.0268 25.8316 33.75 26.6953 33.75H52.8672C53.7309 33.75 54.4375 33.0268 54.4375 32.1429ZM54.4375 45V40.7143C54.4375 39.8304 53.7309 39.1071 52.8672 39.1071H26.6953C25.8316 39.1071 25.125 39.8304 25.125 40.7143V45C25.125 45.8839 25.8316 46.6071 26.6953 46.6071H52.8672C53.7309 46.6071 54.4375 45.8839 54.4375 45Z" fill="#515EDC" />
              </svg>
              <h3 className="text-lg font-medium text-center">Ver resultados de matrícula</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-900">Acerca de la matrícula</h2>

          {/* Encabezado y filas de la tabla */}
          <div className="rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 bg-clrTableHead text-white font-semibold text-lg px-4 py-2 rounded-t-lg">
            <div className="px-4 py-2 flex items-center justify-center">Eventos</div>
            <div className="px-4 py-2 flex items-center justify-center">Fechas</div>
            </div>
            <div className="grid grid-cols-2 divide-y divide-gray-200">
              {eventos.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="px-4 py-3 font-semibold text-gray-800 bg-gray-50">{item.evento}</div>
                  <div className="px-4 py-3 text-gray-600 bg-gray-50">{item.fecha}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
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