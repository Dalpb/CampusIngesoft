import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { DatosSubCompetenciaEditar } from '../../components/Datos/DatosSubCompetencia'
import { InputSubcompetencias } from '../../components/Inputs/InputSubcompetencias';
import { Button, ButtonSecondary } from '../../components/Button/Button';
import { InputCriteriosSubCompetencias } from '../../components/Inputs/InputCriteriosSubCompetencias';


export const SubCompetenciaEditar = () => {

  const { subcompetencia } = location.state || {};
  const sub = {nombre: "nuevo", descripcion: "miralo"}
  const [subcompetenciaTemp, setSubcompetenciaTemp] = useState(sub);

  return (
    <Layout title="Registro de Subcompetencia" back={true}>
        <div className="max-w-6xl my-4 mx-auto p-8 bg-white rounded-lg shadow-lg">
            <div className="max-w-4xl mx-auto px-4">

                {/* Datos a editar de la competencia */}
                <DatosSubCompetenciaEditar subcompetenciaTemp={subcompetenciaTemp} 
                  setSubcompetenciaTemp={setSubcompetenciaTemp} ></DatosSubCompetenciaEditar>
                
                {/* edicion de los criterios de evaluacion */}
                <InputCriteriosSubCompetencias></InputCriteriosSubCompetencias>

                <div className='flex gap-32'> 
                    {/* Botón de descartar */}
                    <ButtonSecondary txt={"Descartar"} tam={"medium"}/>
                    {/* Botón de Guardar */}
                    <Button txt="Guardar" tam={"medium"} action={() => Save()}/>
                </div>
                
            </div>
        </div>
    </Layout>
  )
}
