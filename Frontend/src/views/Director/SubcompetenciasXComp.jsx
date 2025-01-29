import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Layout, { TitleLayout } from '../../components/Layout/Layout';
import { ControllerSubcompetencia } from '../../components/Controllers/ControllerSubcompetencia';
import { GrillaSubCompetenciaXComp } from '../../components/grilla/grillaSubCompetenciaXComp';
import { ButtonSpecial } from '../../components/Button/ButtonSpecial';
import { useNavigate } from 'react-router-dom';
import { LoadingLayout } from '../../components/Layout/Layout';
import { AnimatedContainer } from '../../components/Layout/AnimatedContainer';

export const SubcompetenciasXComp = () => {
    const navigate = useNavigate();

    const {userInformation,getName} = useAuth();
    const location = useLocation();
    const { compID, compNombre, compClave} = location.state || {};

    const [subcompetencias, setSubCompetencias] = useState([]); 
    const [subcompetenciasInv, setSubCompetenciasInv] = useState([]); 

    const agregaSubCompetencia = () => {
        navigate("/SubCompetenciaRegistrar")
    };

    return (
        <AnimatedContainer>
            <div className='md:px-16 px-2 py-4 flex flex-col gap-6'>
                <TitleLayout 
                    title={`${compClave} ${" - "} ${compNombre}`}
                />

                <ControllerSubcompetencia setSubcompetencias={setSubCompetencias} subcompetenciasInv={subcompetenciasInv} />

                <div>
                    <div className='my-4  flex justify-end'>
                        {/* <div className="max-w-36">
                            <ButtonSpecial type="Add" action={agregaSubCompetencia}/>
                        </div> */}
                    </div>
                    <GrillaSubCompetenciaXComp compID={compID}  setSubCompetencias={setSubCompetencias} subcompetencias={subcompetencias} setSubCompetenciasInv={setSubCompetenciasInv}/>
                </div>
            </div>
        </AnimatedContainer>
    );
}
