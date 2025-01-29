import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import Layout, { TitleLayout } from "../../components/Layout/Layout";
import { ControllerCursos } from "../../components/Controllers/ControllerCursos";
import { GrillaListaCursos } from "../../components/grilla/grillaListaCursos";
import { LoadingLayout } from "../../components/Layout/Layout";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";
import { useParams } from "react-router-dom";

export function VisualizarCursos() {
    const { idPeriodo } = useParams(); // Obtener el periodo desde la URL
    const [cursos, setCursos] = useState([]); // Lista de cursos
    const [clave, setClave] = useState(""); // Filtro por clave
    const [nombre, setNombre] = useState(""); // Filtro por nombre
    const [nivel, setNivel] = useState(""); // Filtro por nivel

    return (
        <AnimatedContainer>
            <div className="md:px-16 px-2 py-4 flex flex-col gap-6">
                <TitleLayout title="Cursos Dictados" />
                {/* Controlador para filtros */}
                <ControllerCursos
                    setClave={setClave}
                    setNombre={setNombre}
                    setNivel={setNivel}
                    setCursos={setCursos}
                />
                {/* Grilla para mostrar cursos */}
                <GrillaListaCursos
                    periodo={idPeriodo}
                    cursos={cursos}
                    clave={clave}
                    nombre={nombre}
                    nivel={nivel}
                    setCursos={setCursos}
                />
            </div>
        </AnimatedContainer>
    );
}