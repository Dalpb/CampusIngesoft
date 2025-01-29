import { useAuth } from "../../context/AuthContext";
import Layout, { TitleLayout } from "../../components/Layout/Layout";
import {ControllerAlumnoCursoMatriculadosMain} from '../../components/Controllers/ControllerAlumnoCursoMatriculadosMain'
import { GrillaDetalleNotas } from "../../components/grilla/GrillaDetalleNotas";
import { useState } from "react";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";

export function DetalleNotas(){
    const {userInformation} = useAuth();
    if (!userInformation) {
        return <div>Cargando datos del usuario...</div>; // until loading
    }
    const [courses, setCourses] = useState(null);
    const [periods,setPeriods] = useState(null);
    const [selectedPeriod,setSelectedPeriod]=useState(null)
    const [horariosEstado, setHorariosEstado] = useState([]); //Para manejar los retiros en la grilla
    const [refreshKey, setRefreshKey] = useState(0);

    return(
        <AnimatedContainer className='md:px-16 px-2 py-4 flex flex-col gap-6'>
            <TitleLayout title="Detalle de notas por semestre"/>
            <ControllerAlumnoCursoMatriculadosMain userInformation={userInformation}  periods={periods} setPeriods={setPeriods} setCourses={setCourses} setSelectedPeriod={setSelectedPeriod} setHorariosEstado={setHorariosEstado}  
                onPeriodChange={() => setRefreshKey((prevKey) => prevKey + 1)}
            />
            <AnimatedContainer key={refreshKey}>
                <GrillaDetalleNotas userInformation={userInformation} selectedPeriod={selectedPeriod} horariosEstado={horariosEstado}/>
            </AnimatedContainer>
        </AnimatedContainer>
    )
}