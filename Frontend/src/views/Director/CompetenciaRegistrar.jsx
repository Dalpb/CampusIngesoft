import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { Button, ButtonSecondary } from '../../components/Button/Button';
import { DatosCompetenciaRegistro } from '../../components/Datos/DatosCompetencia';
import { InputArchRubrica } from '../../components/Inputs/InputArchRubrica';
import { InputSubcompetencias } from '../../components/Inputs/InputSubcompetencias';


export const CompetenciaRegistrar = () => {
    const {userInformation,getName} = useAuth();
    const [descripcion, setDescripcion] = useState("");
    const [nombre, setNombre] = useState("");
    const [rubrica, setRubrica] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const competenciaData = {
            nombre,
            descripcion,
            rubrica
        };

        try{
            const response = await fetch('ad',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(competenciaData)
            })

            if(response.ok){
                setNombre('');
                setDescripcion('');
                setRubrica('');
            } else {
                alert("Error al registrar")
            }
        } catch (error){
            console.error("Error en el registro: ", error);
            alert("Error al conectar con el servidor")
        }
    }

    return (
        <Layout title="Registro de Competencia" back={true}>
                <div className="max-w-6xl my-4 mx-auto p-8 bg-white rounded-lg shadow-lg">
                    <div className="max-w-4xl mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-8">Competencia</h2>
                        {/*
                        <DatosCompetenciaRegistro/>
                        */}
                        
                        {/* edicion de la rubrica */}
                        <InputArchRubrica></InputArchRubrica>

                        <InputSubcompetencias></InputSubcompetencias>

                        <div className='flex gap-32'> 
                            {/* Botón de descartar */}
                            <ButtonSecondary txt={"Descartar"} tam={"medium"}/>
                            {/* Botón de Guardar */}
                            <Button txt="Guardar" tam={"medium"} action={handleSubmit}/>
                        </div>
                        
                    </div>
                </div>
        </Layout>
    )
}
