import { useAuth } from "../../context/AuthContext";
import Layout, { TitleLayout } from "../../components/Layout/Layout";
import { DatosProfe } from "../../components/Datos/DatosProfe";
import { DatosVisualizarHorarios } from "../../components/Datos/DatosVisualizarHorarios";
import { ControllerVisualizarHorarios } from "../../components/Controllers/ControllerVisualizarHorarios";
import { GrillaListaCursosVisualizarHorarios } from "../../components/grilla/GrillaListaCursosVisualizarHorarios";
import { getHorariosPeriodo, getPeriodos } from "../../services/gestorServices";
import { useEffect, useState } from "react";

const transformHorarios = (horariosLists) => {
    // Agrupa y transforma los datos
    return Object.values(
        horariosLists.reduce((acc, item) => {
        const clave = item.claveCurso;
        if (!acc[clave]) {
            acc[clave] = {
            clave: item.claveCurso,
            nombre: item.nombreCurso,
            matriculados: item.numAlumnosInscritos,
            creditos: item.creditos,
            horarios: [],
            };
        }
        acc[clave].horarios.push({
            hora: item.claveHorario,
            profesor: `${item.apellidoProfesor}, ${item.nombreProfesor.charAt(0)}`,
        });
        return acc;
        }, {})
    );
    };



export const VisualizarHorarios = () => {
    const {userInformation,getName} = useAuth();
    const [horarios,setHorarios]=useState([]);
    const [periodos,setPeridoso]=useState([]);
    const [selectedPeriod,setSelectedPeriod]=useState(null);
    const [isLoading,setIsLoading]=useState(true);
    console.log(userInformation)

    const getAllPeriods = async () =>{
        try{
            const peridosGet = await getPeriodos(); // Llama al endpoint
            console.log(peridosGet)
            setPeridoso(peridosGet)
            // Selecciona el primer período por defecto
            if (peridosGet && peridosGet.length > 0) {
                setSelectedPeriod(peridosGet[0].id);
            }
        } catch (error) {
            console.error("Error en obtener los cursos");

        }
    }
    const getHorarios = async () => {
        try {
            const horariosLists = await getHorariosPeriodo(selectedPeriod); // Llama al endpoint
            console.log(horariosLists)
            const transformedHorarios = transformHorarios(horariosLists); // Transforma los datos
            console.log(transformedHorarios); // Visualiza el resultado
            setHorarios(transformedHorarios); // Actualiza el estado con los datos transformados
        } catch (error) {
            console.error("Error en obtener los cursos");
        } finally {
            setIsLoading(false); // Setea isLoading a false al finalizar la solicitud
        }
    }; 
    useEffect(() => {
        getAllPeriods();
    }, []);
    useEffect(() => {
        if(selectedPeriod){
            console.log(selectedPeriod)
            getHorarios();
        }
    }, [selectedPeriod]);
    
    return (
            <div className='md:px-16 px-2 py-4 flex flex-col gap-6'>
                <TitleLayout 
                    title="Informacion General"
                />
                <DatosVisualizarHorarios/>
                <TitleLayout 
                    title="Filtro de cursos"
                />
                <ControllerVisualizarHorarios
                    periodos={periodos}
                    selectedPeriod={selectedPeriod}
                    onPeriodChange={setSelectedPeriod} // Pasa el actualizador de estado
                />
                <TitleLayout 
                    title="Cursos y horarios registrados"
                />
                <GrillaListaCursosVisualizarHorarios horarios={horarios} />

            </div>
    );
};