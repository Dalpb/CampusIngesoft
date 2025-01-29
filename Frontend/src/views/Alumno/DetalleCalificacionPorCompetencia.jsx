import { useAuth } from "../../context/AuthContext";
import Layout, { TitleLayout } from "../../components/Layout/Layout";
import { useState, useEffect } from "react";
import { GrillaDetalleCalificacion } from "../../components/grilla/GrillaDetalleCalificacion";
import { ControllerAlumnoCalificacionCompetencia } from "../../components/Controllers/ControllerAlumnoCalificacionCompetencia";
import { FeedbackSection } from "../../components/Datos/FeedbackSection";
import { useLocation } from "react-router-dom"
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";

export function DetalleCalificacionPorCompetencia(){
    const {userInformation} = useAuth();

    const location = useLocation();
    const {cursoClave,
          cursoNombre,
          periodo ,
          horarioNum,
          alumnoId,
          competenciaSeleccionada
        } = location.state || {};
    console.log("Subcompetencias",location.state);
    console.log("Competencia: ", competenciaSeleccionada)  ;
    console.log("Ciclo: ", periodo)  ;
    
    // Validación de competencia seleccionada
    if (!competenciaSeleccionada) {
        return <div>No se encontró información para la competencia seleccionada.</div>;
    }

    if (!userInformation) {
        return <div>Cargando datos del usuario...</div>; // until loading
    }

    // Extraer datos de competenciaSeleccionada
    const { valor: calificacionFinal, retroalimentacion: feedback, subcompetencias,
            indice: numero} = competenciaSeleccionada;

    return(
        <AnimatedContainer>
        <div className='md:px-16 px-2 py-4 flex flex-col gap-6 max-w-5xl mx-auto'>
            <TitleLayout title={`${cursoClave} - ${cursoNombre}`}/>
            <ControllerAlumnoCalificacionCompetencia 
                clave={competenciaSeleccionada.clave} 
                nombre={competenciaSeleccionada.nombre} 
                horario={horarioNum} 
                ciclo={periodo.periodo} 
            />
            <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-6">
                <FeedbackSection indice = {numero} calificacion={calificacionFinal} feedback={feedback}/>                
                {/* Tabla de subcompetencias */}
                <GrillaDetalleCalificacion subcompetencias={subcompetencias} />
            </div>
        </div>
        </AnimatedContainer>
    )
}