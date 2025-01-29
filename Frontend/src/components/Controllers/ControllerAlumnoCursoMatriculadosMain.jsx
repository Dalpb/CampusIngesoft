import { useEffect, useState } from "react";
import { coursesByStudent, periodByStudent } from "../../services/studentServices";

export function ControllerAlumnoCursoMatriculadosMain({ userInformation, periods, setPeriods, setCourses,setSelectedPeriod, setHorariosEstado, onPeriodChange}) {
    const [numCursos, setNumCursos] = useState(null);
    const [numCreditos, setNumCreditos] = useState(null);

    const getStudentsCourses = async (firstPeriod) => {
        try {
            const studentCourses = await coursesByStudent(userInformation.id, firstPeriod.id);
            setCourses(studentCourses); // Guardar la lista de estudiantes en el estado
            setSelectedPeriod(firstPeriod);
            console.log("Student courses: ", studentCourses);

            const arregloRetiroHorarios = studentCourses.map((curso) => curso.retiroHorarios || { estadoRetiro: false });
            setHorariosEstado(arregloRetiroHorarios); // Pasar solo el arreglo de retiroHorarios
            console.log("Retiros: ", arregloRetiroHorarios);
            return studentCourses; // Retornar los cursos para su uso posterior
        } catch (error) {
            console.error("Error en obtener los cursos");
        }
    };

    const getStudentsPeriods = async () => {
        try {
            const studentPeriods = await periodByStudent(userInformation.id);
            const sortedPeriods = studentPeriods.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));
            setPeriods(sortedPeriods); // Guardar la lista de períodos en el estado
            // Obtener los cursos del primer período y calcular los valores correspondientes
            const cursos = await getStudentsCourses(sortedPeriods[0]);   
            if (cursos) {
                const localNumCursos = obtenerNumCursos(cursos);
                const localNumCreditos = obtenerNumCreditos(cursos);
                setNumCursos(localNumCursos);
                setNumCreditos(localNumCreditos);
            }
        } catch (error) {
            console.error("Error en obtener los períodos");
        }
    };

    useEffect(() => {
        if (userInformation) {
            getStudentsPeriods();
        }
    }, [userInformation]);

    const handlePeriodChange = async (event) => {
        const selectedPeriodId = parseInt(event.target.value, 10);  // Extrae el id del período seleccionado
        console.log("periodo seleccionado: ", selectedPeriodId);
        const selectedPeriod = periods.find((period) => period.id === selectedPeriodId); // Busca el objeto completo
        console.log("periodo seleccionado otro: ", periods);
        if (selectedPeriod) {
            const cursos = await getStudentsCourses(selectedPeriod); // Pasa el objeto del período seleccionado
            console.log("cursos: ", cursos);
            setSelectedPeriod(selectedPeriod);
            if (cursos) {
                const localNumCursos = obtenerNumCursos(cursos);
                const localNumCreditos = obtenerNumCreditos(cursos);
                setNumCursos(localNumCursos);
                setNumCreditos(localNumCreditos);
            }
            if (onPeriodChange) {
                onPeriodChange(); // Notifica al componente padre
            }
        } else {
            console.error("Período seleccionado no encontrado");
        }
    };

    // Función para obtener el número de cursos
    const obtenerNumCursos = (cursos) => {
        if (!cursos) return 0;
        const cursosValidos = cursos.filter((curso) => !curso.retiroHorarios?.estadoRetiro);
        return cursosValidos.length;
    };

    // Función para obtener el número total de créditos
    const obtenerNumCreditos = (cursos) => {
        if (!cursos) return 0;
        // Filtrar cursos que no estén retirados y sumar los créditos
        return cursos.reduce((total, curso) => {
        if (!curso.retiroHorarios?.estadoRetiro) {
            return total + (curso.curso?.creditos || 0);
        }
        return total; // No sumar si está retirado
    }, 0);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-between">
            {/* Ciclo Section */}
            <div className="flex flex-col items-start">
                <p className="text-gray-500 text-xl font-medium leading-none mb-1">Ciclo</p>
                <select
                    id="cycle"
                    className="border rounded py-1 px-2 text-sm font-bold text-black"
                    defaultValue={periods && periods.length > 0 ? periods[0].id : ""}
                    onChange={handlePeriodChange}
                >
                    {periods &&
                        periods.map((period) => (
                            <option value={period.id} key={period.id}>
                                {period.periodo}
                            </option>
                        ))}
                </select>
            </div>

            {/* Alumno Section */}
            <div className="flex flex-col items-start">
                <p className="text-gray-500 text-xl font-medium leading-none mb-1">Alumno</p>
                <p className="text-black font-bold text-sm py-1 px-0">
                    {userInformation?.nombre} {userInformation?.primerApellido} {userInformation?.segundoApellido} ({userInformation?.codigo})
                </p>
            </div>

            {/* Cursos Section */}
            <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xl font-medium leading-none mb-1">Cursos</p>
                <p className="text-black font-bold text-sm py-1 px-2">{numCursos !== null ? numCursos :     "Cargando..."}</p>
            </div>

            {/* Créditos Section */}
            <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xl font-medium leading-none mb-1">Créditos</p>
                <p className="text-black font-bold text-sm py-1 px-2">{numCreditos !== null ? numCreditos : "Cargando..."}</p>
            </div>
        </div>
    );
}
