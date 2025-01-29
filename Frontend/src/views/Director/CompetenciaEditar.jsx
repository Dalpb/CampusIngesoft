import React from 'react'
import Layout, { TitleLayout } from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { Button, ButtonSecondary } from '../../components/Button/Button';
import { DatosCompetenciaEditar } from '../../components/Datos/DatosCompetencia';
import { InputArchRubrica } from '../../components/Inputs/InputArchRubrica';
import { useLocation } from 'react-router-dom';
import { updateCompetencia } from '../../services/evaluationServices';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const CompetenciaEditar = () => {
    const {userInformation,getName} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { competencia , cursoId} = location.state || {};
    const data = [competencia.nombre, competencia.descripcion]
    const [competenciaTemp, setCompetenciaTemp] = useState(competencia);

    const updateComp = async () => {
        try {
            const reponse = await updateCompetencia(competenciaTemp);
            console.log(reponse)
        } catch (error) {
            console.error("Error en actualizar las competencias");
        }
    };

    const Save = () => {
        updateComp()
        //navigate("/vistaCompetencias")
    };

    const Discard = () => {
        navigate("/vistaCompetencias", {
            state: {
                cursoId: cursoId
            }
        })

    };


    return (
        <Layout title="Edicion de Competencia" back={true}>
                <div className="max-w-6xl my-4 mx-auto p-8 bg-white rounded-lg shadow-lg">
                    <div className="max-w-4xl mx-auto px-4">
                        {/* Datos a editar de la competencia */}
                        <DatosCompetenciaEditar competenciaTemp={competenciaTemp} setCompetenciaTemp={setCompetenciaTemp}/>
                        
                        {/* edicion de la rubrica 
                        <InputArchRubrica></InputArchRubrica>
                         */}     
                        <div className='flex gap-32'> 
                            {/* Botón de descartar */}
                            <ButtonSecondary txt={"Descartar"} tam={"medium"} action={() => Discard()}/>
                            {/* Botón de Guardar */}
                            <Button txt="Guardar" tam={"medium"} action={() => Save()}/>
                        </div>
                        

                        
                    </div>
                </div>
        </Layout>
    )
}
