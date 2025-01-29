import { useScheduleTeacher } from "../../context/ScheduleTeacherContext";
import { MoreCourseIcon, ReportIcon } from "./GridIcons";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "./grillaEmpty";
export default function CursosGrid({ cursos ,activos}) {

    const navigate = useNavigate();
    const {periodo,periodoId,
        selectSchedule} = useScheduleTeacher();

    const changeButton = (curso, horario,periodo) => {
        const shedule = {...horario,
                        cursoClave:curso.clave,
                        cursoNombre:curso.nombre,
                        creditos: curso.creditos}
        selectSchedule(shedule);

        
        navigate(`/profesor/horarios/${horario.id}`, {
            state: { 
                cursoId: curso.id,
                cursoClave:curso.clave,
                cursoNombre: curso.nombre,
                horarioId: horario.id,
                horarioNumero: horario.claveHorario,
                periodo: periodo,
                periodoId:periodoId
            }
        });
    };

    const handleReportClick = (curso, horario, periodo) => {
        console.log("PERIDO ID")
        console.log(periodoId)
        navigate(`/profesor/horarios/${horario.id}/reporte`,{
            state: { 
                cursoClave:curso.clave,
                cursoId: curso.id,
                cursoNombre: curso.nombre,
                horarioId: horario.id,
                horarioNumero: horario.claveHorario,
                periodo: periodo,
                periodoId:periodoId
            }
        });
    };
    console.log("Cursos", cursos);
    return (
        <div className='w-full p-4 bg-white rounded-lg mb-2'>
            <div className='w-full border-grey'>
                <div className="overflow-x-auto w-full max-w-6xl mx-auto bg-white rounded-t-2xl shadow-md overflow-hidden" >
                    <table className="w-full ">
                        <thead className='rounded-lg'>
                            <tr className='bg-clrTableHead h-11 '> 
                                <th className="px-6 py-3 text-left text-white font-medium">Clave</th>
                                <th className="px-6 py-3 text-left text-white font-medium">Nombre del curso</th>
                                <th className="px-6 py-3 text-center text-white font-medium">Horario</th>
                                <th className="px-6 py-3 text-center text-white font-medium">Créditos</th>
                                <th className="px-6 py-3 text-center text-white font-medium">Sesiones</th>
                                <th className="px-6 py-3 text-center text-white font-medium">Más</th>
                            </tr>
                        </thead>
                        <tbody>
                            {console.log("Cursos: ", cursos)}
                            {cursos.length > 0 ? (cursos.map(curso => (
                                curso.horarios.map(horario => (
                                    
                                    <tr key={`${curso.id}-${horario.id}`} className='bg-white shadow-sm border-[#DDDEEE] border-2 border-solid border-t-0 box-border'>
                                        {console.log("horario")}
                                        {console.log(horario)}
                                        <td className="px-6 py-4 text-sm text-gray-900">{curso.clave}</td>
                                        <td className="px-6 py-6 text-sm text-gray-900 flex items-center gap-4">
                                            <span className="flex items-center">
                                                {curso.nombre}
                                            </span>
                                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="16px"
                                                    viewBox="0 -960 960 960"
                                                    width="16px"
                                                    fill="#6b7280"
                                                >
                                                    <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                                                </svg>

                                                {activos|| 0 } 
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center  text-sm text-gray-900">{horario.claveHorario}</td> 
                                        <td className="px-6 py-4 text-center text-sm text-gray-900">{curso.creditos.toFixed(1)}</td>
                                        <td className="px-6 py-4 text-center  text-sm text-gray-900">{`${curso.numHoras} hrs`}</td>
                                        <td className="px-6 py-4 text-center  text-sm text-gray-900" >
                                            <div className="flex justify-center space-x-4">
                                                <button className="transform transition-transform duration-100 active:scale-95 hover:scale-105" onClick={() => handleReportClick(curso, horario, periodo)}>
                                                    <ReportIcon/>
                                                </button>
                                                <button className="transform transition-transform duration-100 active:scale-95 hover:scale-105" onClick={() => changeButton(curso, horario, periodo)}>
                                                    <MoreCourseIcon/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr> 
                                ))
                            )))
                            :(
                                <tr>
                                    <td colSpan={6}>
                                        <EmptyState mainMessage="Actualmente, no tiene horarios dictados en este periodo" />
                                    </td>
                                </tr>
                            )
                        } 
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}