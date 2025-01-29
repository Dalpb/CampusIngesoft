import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Layout, { TitleLayout } from "../../components/Layout/Layout";
import { ControllerCompetencias } from "../../components/Controllers/ControllerCompetencias";
import { GrillaCompetenciasXCurso } from "../../components/grilla/grillaCompetenciasXCurso";
import { ButtonSpecial } from '../../components/Button/ButtonSpecial';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/grilla/grillaEmpty';
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";
import { useParams } from "react-router-dom";

export const VistaCompetencias = () => {
    const { idPeriodo } = useParams(); // Obtener el periodo desde la URL
    const {userInformation,getName} = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const { cursoId, cursoNombre, cursoClave} = location.state || {}; 

    const [competencias, setCompetencias] = useState([]); 
    const [competenciasInv, setCompetenciasInv] = useState([]);


    const agregaCompetencia = () => {
        navigate("/CompetenciaRegistrar")
    };


    return (
        <AnimatedContainer>
            <div className='md:px-16 px-2 py-4 flex flex-col gap-6'>
                <TitleLayout 
                    title={`${cursoClave} ${" - "} ${cursoNombre}`}
                />

                <ControllerCompetencias setCompetencias={setCompetencias} competenciasInv={competenciasInv}/>
                <GrillaCompetenciasXCurso periodo = {idPeriodo} cursoId={cursoId}  setCompetencias={setCompetencias} competencias={competencias} setCompetenciasInv={setCompetenciasInv}/>

            </div>
        </AnimatedContainer>
    );
};