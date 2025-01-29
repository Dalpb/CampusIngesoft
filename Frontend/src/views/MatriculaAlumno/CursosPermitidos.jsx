import { ControllerCursosPermitidosAlumno } from "../../components/Controllers/ControllerCursosPermitidosAlumno";
import { useAuth } from "../../context/AuthContext";
import React, { useState, useEffect } from "react";
import { LoadingLayout, TitleLayout } from "../../components/Layout/Layout";
import { CursosPermitidosTable } from "../../components/grilla/GrillaCursosPermitidos";
import { getCursosPermitidos, getCicloActual } from "../../services/studentServices";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";

export function CursosPermitidos() {
    const { userInformation } = useAuth(); // Contexto para obtener datos del alumno
    const [courses, setCourses] = useState(null); // Cursos permitidos
    const [cicloActual, setCicloActual] = useState(null); // Ciclo actual
    const [factorDesempeno, setFactorDesempeno] = useState(null); // Factor de desempeño
    const [turnoDeMatricula, setTurnoDeMatricula] = useState(null); // Turno de matrícula
    const [isLoading, setIsLoading] = useState(true); // Control de carga

    // Efecto para obtener datos al cargar la página
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener el ciclo actual
                const ciclo = await getCicloActual();
                setCicloActual(ciclo[0]?.periodo || "Sin ciclo actual");

                // Obtener el JSON completo de cursos permitidos
                const cursosPermitidos = await getCursosPermitidos(userInformation.id);

                // Separar datos generales y cursos
                const generalData = cursosPermitidos[0];
                const courseData = cursosPermitidos.slice(1);

                // Actualizar estados con datos generales
                setFactorDesempeno(generalData.factorDesempeno);
                setTurnoDeMatricula(`${generalData.turnoDeMatricula} de ${generalData.totalAlumnos}`);
                setCourses(courseData);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setIsLoading(false); // Finalizar estado de carga
            }
        };

        fetchData();
    }, [userInformation.id]);

    // Mientras se cargan los datos
    if (isLoading || !userInformation) {
        return <LoadingLayout msg="Cargando cursos permitidos" />;
    }

    return (
        <AnimatedContainer>
        <div className="md:px-16 px-2 py-4 flex flex-col gap-6">
            {/* Título */}
            <TitleLayout title="Cursos permitidos" />

            {/* Barra superior con ciclo y datos del alumno */}
            <ControllerCursosPermitidosAlumno
                userInformation={userInformation}
                cicloActual={cicloActual}
                factorDesempeno={factorDesempeno}
                turnoDeMatricula={turnoDeMatricula}
            />

            {/* Grilla con los cursos permitidos */}
            <CursosPermitidosTable courses={courses} />
        </div>
        </AnimatedContainer>
    );
}
