import { 
    Bar,
    BarOption
} from "../../components/Bars/Bar"
import { useEffect, useReducer, useState } from "react"
import { ButtonSpecial } from "../../components/Button/ButtonSpecial"
import { InputText, SelectInput } from "../../components/Inputs/InputText"
import { EmptySchedulesIcon } from "../../components/grilla/GridIcons"
import { Button } from "../../components/Button/Button"
import {HorariosTableGestor } from "../../components/Table/HorariosTableGestor"
import { Modal, TitleModal } from "../../components/Pop-up/Modal"
import { ButtonSecondary } from "../../components/Button/Button"
import PopupSuccess from "../../components/Pop-up/Response/SucessPopUp"
import { getCourses, getCursosYHorarios, getHorarios } from "../../services/coursesServices"
import { getAlumCount, getProfCount } from "../../services/studentServices"
import { getCursosyHorarios } from "../../services/matricula.service"
import { use } from "framer-motion/client"
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer"

const initStatePopUp = {
    popupSubmit: false,
    popupSuccess : false,
}
const reducer = (state,action) =>{
    switch(action.type){
        case "OPEN_SUBMIT":
            return {...state, popupSubmit:true};
        case "CLOSE_SUBMIT":
            return {...state, popupSubmit:false};
        case "OPEN_SUCCESSS":
            return {...state,popupSuccess: true};
        case "CLOSE_SUCCESS":
            return {...state,popupSuccess:false};
    }
}


export const AdministracionHorarios = () =>{

    const [cursos,setCursos] = useState([]);
    const [cursosInv,setCursosInv] = useState([]);
    const [cantAl, setCantAl] = useState(0);
    const [cantCur, setCantCur] = useState(0);
    const [cantProf, setCantProf] = useState(0);
    const [cantHorario, setCantHorario] = useState(0);
    const [searchTermNombre, setSearchTermNombre] = useState('');
    const [searchTermClave, setSearchTermClave] = useState('');
    const [selectedNivel, setSelectedNivel] = useState('');

    const [file,setFile] = useState(null); //archivo
    const [error,setError] = useState(null); //error del archivo
    const [loadingFile,setLoadingFile] =useState(false);
    const [state,dispath] = useReducer(reducer,initStatePopUp);

    const openSubmit = () =>dispath({type:"OPEN_SUBMIT"});
    const closeSubmit = () => dispath({type: "CLOSE_SUBMIT"});
    const openSuccess = () => dispath({type:"OPEN_SUCCESSS"});
    const closeSuccess = () => dispath({type:"CLOSE_SUCCESS"});

    let cantA
    const fetchCountAlum = async () => {
        cantA = await getAlumCount()
        setCantAl(cantA.count)
    }

    const fetchCountProf = async () => {
        let cantP = await getProfCount()
        setCantProf(cantP.count)
    }

    const fetchCursosyHorarios = async () => {

        const data = await getCursosYHorarios()
        console.log("===")
        console.log(data)
        /* desglosar data*/
        const cantCursos = data.length
        const bloque = data
        setCantCur(cantCursos)
        let sumHorarios = 0
        for(const cur of data){
            if (cur && cur.horarios && Array.isArray(cur.horarios)) {
                sumHorarios += cur.horarios.length;
            }
        }
        setCantHorario(sumHorarios)
        setCursos(bloque) // cada curso viene con horarios incluidos
        setCursosInv(bloque)
    }


    useEffect(() => {
        fetchCursosyHorarios()
        fetchCountAlum()
        fetchCountProf()
        setSelectedNivel("0")
    }, [])
    
    const onClickA = () => {};

    const filterCursos = () => {
        let filteredCursos = cursosInv;
    
        if (searchTermNombre || searchTermClave || selectedNivel !== "0") {
            filteredCursos = filteredCursos.filter(curso => {
                const nombreMatch = searchTermNombre
                    ? curso.nombre.toLowerCase().includes(searchTermNombre.toLowerCase())
                    : true;
                const claveMatch = searchTermClave
                    ? curso.clave.toLowerCase().includes(searchTermClave.toLowerCase())
                    : true;
                const nivelMatch = selectedNivel !== "0"
                    ? curso.nivel === selectedNivel
                    : true;
    
                return nombreMatch && claveMatch && nivelMatch;
            });
            setCursos(filteredCursos);
        } else {
            setCursos(cursosInv);
        }
    };

    const cambiarNivel = (e) => {
        setSelectedNivel(e.target.value)
    }

    //codigo para mandar el archivo
    const onSubmitHorarios = async (e)=>{
        e.preventDefault();
        if(!file){
            setError("No se subió el archivo")
            return;
        }
        const formData = new FormData();
        formData.append("file",file); //le envio esto al backend para que se verifique

        try{
            setLoadingFile(true);
            //realizo llamada al backend
            let response = true;
            if(response){
                closeSubmit();
                openSuccess();
            }
        }
        catch(error){
            console.log("Error en el envio",error);
            //debe mandarme un error que no se paso la data correcta
        }
        finally{
            setLoadingFile(false);
        }
    }
    

    return(
        <AnimatedContainer>
            <div className="p-4  rounded-lg w-full max-w-6xl md:mx-auto md:my-auto mb-14">
                <h1 className="text-3xl  font-bold mb-4 md:text-left text-center text-[#060C37]" >Información general</h1>
                <div className="flex flex-col gap-3">
                    <Bar className="lg:grid-cols-4 md:grid-cols-2 gap-4" >
                        <BarOption title="Cursos Registrados" result={cantCur}></BarOption>
                        <BarOption title="Total de alumnos" result={cantAl}></BarOption>
                        <BarOption title="Total de profesores" result={cantProf}></BarOption>
                        <BarOption title="Total de horarios" result={cantHorario}></BarOption>
                    </Bar>
                    <hr className="border-3" />
                </div>
                <h1 className="text-3xl  font-bold mb-4 md:text-left text-center text-[#060C37]" >Filtrado de cursos</h1>
                <div className="flex flex-col gap-3">
                    <Bar className="lg:grid-cols-4 md:grid-cols-3 gap-4">
                        <InputText
                        label="Clave del Curso"
                        description="Ingrese la clave del curso"
                        placeholder="Ejm: IFSI12"
                        value={searchTermClave} onchange={(e) => setSearchTermClave(e.target.value)} onclick={onClickA}
                        />
                        <InputText 
                        label="Nombre del Curso"
                        description="Ingrese el nombre del curso"
                        placeholder="Física 1"
                        value={searchTermNombre} onchange={(e) => setSearchTermNombre(e.target.value)} onclick={onClickA}
                        />
                        <SelectInput 
                        onchange={e =>cambiarNivel(e)}
                        label="Nivel"
                        description="Cursos del nivel"
                        className="h-11">
                            <option value={"0"}>Seleccione el nivel</option>
                            <option value={"1"}>1er Ciclo</option>
                            <option value={"2"}>2do Ciclo</option>
                            <option value={"3"}>3er Ciclo</option>
                            <option value={"4"}>4to Ciclo</option>
                            <option value={"5"}>5to Ciclo</option>
                            <option value={"6"}>6to Ciclo</option>
                            <option value={"7"}>7mo Ciclo</option>
                            <option value={"8"}>8vo Ciclo</option>
                            <option value={"9"}>9no Ciclo</option>
                            <option value={"10"}>10mo Ciclo</option>
                            <option value={"E"}>Electivo</option>
                        </SelectInput>
                        <ButtonSpecial 
                        type="Filter"
                        className="self-center lg:col-span-1 md:col-span-3"
                        action={filterCursos}
                        />
                    </Bar>
                    <hr className="border-3" />
                    <h1 className="text-3xl  font-bold mb-4 md:text-left text-center text-[#060C37]" >Cursos y horarios registrados</h1>
                </div>
                {
                    cursos?.length >= 0?
                    (
                    <div className="w-full flex justify-end mb-3" >
                        <HorariosTableGestor cursos={cursos}></HorariosTableGestor>
                    </div>
                    )
                    :
                    <Bar className="gap-5 md:py-5 md:px-10 lg:grid-cols-2  ">
                        <EmptySchedulesIcon className="justify-self-center "/>
                        <div className="self-center flex flex-col gap-4">
                            <h2 className="text-3xl font-semibold tracking-tight text-center text-[#060C37]">
                                No se encuentra registrado ningún curso en el sistema
                            </h2>
                            <p className="text-md text-center text-[#757576]">
                            Para comenzar, cargue un archivo csv con los datos de los
                            cursos, horarios y profesores  disponibles</p>
                        </div>
                    </Bar>
                }
                {/*
                    <Modal isOpen={state.popupSubmit}>
                        <TitleModal title="Importar cursos y sus horarios"/>
                        <form onSubmit={onSubmitHorarios}>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer"
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => e.preventDefault()}>
                                <input
                                type="file"
                                onChange={handleFileSubmit} 
                                accept=".csv, .xlsx"
                                className="hidden"
                                id="fileInput"/>

                                <label htmlFor="fileInput" className="cursor-pointer">
                                    <div className={`w-12 h-12 mx-auto mb-2 border-2 rounded-full flex items-center justify-center transition-colors duration-300  ${!error && file ? 'text-green-500 border-green-500' : 'text-gray-400 border-gray-400'} `}>
                                    <span className="text-2xl">↑</span>
                                    </div>
                                    <p className={`${(!error && file) ? 'text-green-500' : 'text-gray-500'}`}>
                                    {!error && file ? `${file?.name}` : 'Arrastra el archivo CSV O XLSX'}
                                    </p>
                                </label>
                            </div>
                            {error && <p className="text-red-500 text-base text-center m-2">{error}</p>} 
                            <div className="grid md:grid-cols-2  gap-2 ">
                                <ButtonSecondary
                                txt="Cancelar"
                                type="button"
                                action={closeSubmit} />
                                <Button
                                txt="Continuar" 
                                type="submit"/>
                            </div>
                        </form>
                    </Modal>
                */}
                {
                    <PopupSuccess 
                    isOpen={state.popupSuccess}
                    text="Los Horarios y sus cursos fueron subidos exitosamente!"
                    onContinue={closeSuccess} />
                }

            </div>
        </AnimatedContainer>
    )
} 