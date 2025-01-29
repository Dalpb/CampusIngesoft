import { useAuth } from "../../context/AuthContext";
import Layout, { TitleLayout } from "../../components/Layout/Layout";
import {ControllerAlumnoCursoMatriculadosMain} from '../../components/Controllers/ControllerAlumnoCursoMatriculadosMain'
import { GrillaMainAlumno } from '../../components/grilla/GrillaMainAlumno'
import {Button} from '../../components/Button/Button'
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeAnimation } from "../../components/Welcome/WelcomeAnimation";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";
import { useTheme } from "../../context/ModoOscuro";
import { getStudentFactorDesempeno } from "../../services/studentServices";
import { ModalErrorVisualizarCursos } from "../../components/Pop-up/Modal";


export function MainAlumno(){
    const {userInformation} = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState(null);
    const [periods,setPeriods] = useState(null);
    const [selectedPeriod,setSelectedPeriod] = useState(null)
    const [horariosEstado, setHorariosEstado] = useState([]); //Para manejar los retiros en la grilla
    const [refreshKey, setRefreshKey] = useState(0);
    const [factorDesempeno, setFactorDesempeno] = useState()

    const goToDetalleNotas = () => {
        navigate('/alumno/detalleNotas');
    };
    
    if (!userInformation) {
        return <div>Cargando datos del usuario...</div>; // until loading
    }

    const getFactorDesempeno = async (id) => {
        const factor = await getStudentFactorDesempeno(id)
        setFactorDesempeno(factor)
    }

    useEffect(() => {
        if (userInformation) {
            getFactorDesempeno(userInformation.id)
            console.log(userInformation)
        } else {
            console.log("No se cargo la informacion correctamente")
        }
    }, [userInformation]);

    const handleCerrar = () => {
        navigate('/all-logout'); // Reemplaza '/otra-pantalla' con la ruta deseada
    };
   
    return(
        <>{(factorDesempeno >= 100.0 && (userInformation.estado === "Prematricula" || userInformation.estado === "Matricula"
        ))? 
            (<ModalErrorVisualizarCursos isOpen={true} onClose={handleCerrar} children={
                <div className="space-y-6 text-center">
                    {/* Encabezado */}
                    <h2 className="text-2xl font-semibold text-gray-800">
                        🎉 ¡Bienvenido, Cachimbo! 🎓
                    </h2>

                    {/* Ícono animado (Lottie u otro interactivo) */}
                    <div className="flex justify-center">
                        <motion.div
                        className="bg-red-100 rounded-full p-6"
                        initial={{ scale: 0.8 }}
                        animate={{ rotate: [0, 10, -10, 0], scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                        <svg
                            className="w-16 h-16 text-red-500 animate-bounce"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.516 11.607c.765 1.36-.191 3.043-1.742 3.043H3.483c-1.55 0-2.507-1.683-1.742-3.043L8.257 3.1zm.743 8a1 1 0 111.999 0 1 1 0 01-2 0zm.999 2a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75z"
                            clipRule="evenodd"
                            />
                        </svg>
                        </motion.div>
                    </div>

                    {/* Texto descriptivo */}
                    <p className="text-gray-600 text-sm m-4 p-5">
                        Estamos preparando todo para que pronto disfrutes del portal estudiantil. ✨ Muy pronto podrás explorar tus cursos y recursos universitarios. 🚀
                    </p>
                </div>
            }/>)
            :
            (
            <AnimatedContainer className='md:px-16 px-2 py-4 flex flex-col gap-6'>
                <TitleLayout title="Datos del alumno"/>
                <ControllerAlumnoCursoMatriculadosMain userInformation={userInformation}  periods={periods} setPeriods={setPeriods} setCourses={setCourses} setSelectedPeriod={setSelectedPeriod} setHorariosEstado={setHorariosEstado} 
                    onPeriodChange={() => setRefreshKey((prevKey) => prevKey + 1)}
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="w-full sm:w-auto flex-grow flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <Button txt="Detalle Notas" action={goToDetalleNotas}/>
                    </div>
                </div>
                <AnimatedContainer key={refreshKey}>
                    <GrillaMainAlumno courses={courses} period={selectedPeriod} />
                </AnimatedContainer>
            </AnimatedContainer>)
        }  
        </>
    )    
}


{/* <div className="w-full sm:w-auto flex-grow flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
<p className="text-xl font-semibold text-black">
    {tipoNota} {indice}
</p>
</div>
<div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
    <ButtonSpecial type="Import" action={togglePopUp}/>
</div> */}

/* VERSION PREVIA:

import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
export function MainAlumno(){
    const {userInformation} = useAuth();

    if (!userInformation) {
        return <div>Cargando datos del usuario...</div>; // until loading
    }
    return(
        <Layout title="Cursos matriculados" back={false} userName={`${userInformation.nombre} ${userInformation.primerApellido} ${userInformation.segundoApellido}`}>

            <div className="mt-7 mx-12 flex flex-col gap-6 items-center">
                <h1 className="text-clrTitle md:text-5xl text-4xl font-semibold self-start">Datos del alumno</h1>

                <div className="bg-white h-16 w-9/12 rounded-2xl shadow-xl flex justify-between items-center px-10">
                    <div className="flex gap-6">
                        <div className="flex flex-col text-[#A3A3A3] font-semibold">
                            Ciclo
                            <select id="cicle"
                             className="border border-solid border-[#CBD5E1] rounded-md px-2 py-1 font-bold text-black text-sm bg-white">
                                
                            </select>
                        </div>
                        <div className="flex flex-col text-[#A3A3A3] font-semibold ">
                            Alumno
                            <span className="text-black">{`${userInformation.nombre} ${userInformation.primerApellido} ${userInformation.segundoApellido}`}</span>
                        </div>
                    </div>
                    <div className="flex gap-7">
                        <div className="flex flex-col text-[#A3A3A3] font-semibold items-center">
                            Cursos
                            <span className="text-black">{horarios}</span>
                        </div>
                        <div className="flex flex-col text-[#A3A3A3] font-semibold items-center">
                            Créditos
                            <span className="text-black">{credits}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )    
}
*/