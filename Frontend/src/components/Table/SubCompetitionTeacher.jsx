
import {useTableFilter} from "../../hooks/useTableFilter";
import { TableIndex } from "./TableIndex";
import { useEvaluation } from "../../context/EvaluationContext";
import { useEffect, useState,useRef } from "react";
import {PenIcon} from "./TableIcons"
import { FeedBackPopUp } from "../Pop-up/Competition/feedBackPopUp";
import { ButtonSpecial } from "../Button/ButtonSpecial";
import { FileSubmitPopup } from "../Pop-up/UploadFile/FileUploadPopup";
import { useScheduleTeacher } from "../../context/ScheduleTeacherContext";
import { postCalificationSubcompetition } from "../../services/evaluationServices";
import { PopupWarning } from "../Pop-up/Question/PopupWarning";
import PopupSuccess from "../../components/Pop-up/Response/SucessPopUp";
import { SelectInput } from "../Inputs/InputText";
import {Modal} from "../../components/Pop-up/Modal"
import {PopUpError} from "../../components/Pop-up/Response/Errror"
import {SpinnerLoading } from "../../components/Pop-up/SpinnerLoading"
const CALIFICATION = ["A","B","C","D",""]
const ROWSHOW = 10

export function SubCompetitionTeacher({content,indexEvaluation,horarioId ,competitionId }){

    const itHasNotes = useRef(false);
    const {competitionSelect} = useEvaluation();
    const {scheduleSelect} = useScheduleTeacher();
    const [saveNotes,setSaveNotes] = useState(true); //estado que inica que se suben notas
    const [openPopUp,setOpenPopUp] = useState(false);
    const [openPopUpCalif,setOpenPopUpCalif] = useState(false);
    const [openSuccessPopUp,setOpenSuccessPopUp] = useState(false);
    const [openError,setOpenError]  = useState(false);
    const [loadingSpinner,setLoadingSpinner] = useState(false);
    const [values,setValues] = useState([]);
    const [feedbacks,setFeebacks] = useState([]); //descriptions feebacks
    const [indexRow,setIndexRow] = useState(0);
    const [feedback,setFeedback] = useState(" ");
    const [importedNotes,setImportedNotes] = useState([]);
    const [headings,setHeadings] = useState([]); //headears
    const [openWarningPopUp,setWarningPopUp] = useState(false);
    const {actualIndex,totalIndex,tablePartContent,getIndexContent,getRealIndexRowTable} = useTableFilter({content:content,rowsShow:ROWSHOW})


    const handleFeedbacks = (indexRow,feedback) =>{
        const newFeebacks = [...feedbacks];
        let copyFeedback = localStorage.getItem(`feedbacks-${indexEvaluation}`);
        copyFeedback = JSON.parse(copyFeedback);
        newFeebacks[indexRow] = feedback;
        copyFeedback[indexRow] = feedback;
        setFeebacks(newFeebacks);
        localStorage.setItem(`feedbacks-${indexEvaluation}`,JSON.stringify(copyFeedback));
    }

    const handleNotes = (event,indexRow,indexCol,note) =>{
        if(itHasNotes.current)return;
        let value = event.target.value.toUpperCase();
        if(!CALIFICATION.includes(value) || value.length >= 2)return;

        const newNotes = [...values];
        let copyNotes = localStorage.getItem(`valuesInit-${indexEvaluation}`);
        copyNotes = JSON.parse(copyNotes);
        copyNotes[indexRow][indexCol].valor = value;
        newNotes[indexRow][indexCol].valor = value;
        setValues(newNotes);
        localStorage.setItem(`valuesInit-${indexEvaluation}`,JSON.stringify(copyNotes));
    }

    const handleDescription = (indexRow,fee) => {
        setIndexRow(indexRow);
        setFeedback(feedbacks[indexRow]);
        setOpenPopUp(true);
    }
    const handleImport = () => setOpenPopUpCalif(true);


    const updateData = (data) =>{
        const notes  = [...values];
        const feebackCopy = [...feedbacks];
        console.log("data ",data);
        console.log("content ", content);
        content.forEach((element,index) => {
            const rowAlumno =data.findIndex(d => d["código del alumno"] === element.alumno.codigo );
            if(rowAlumno === -1)return;
            const lengthOptions = competitionSelect.subcompetencias.length+1;
            for(let i = 0; i<lengthOptions;i++){
                    const field = notes[index][i].compe;
                    console.log("sadssss",field);
                     field === "calificación" ? notes[index][i].valor = data[rowAlumno]["calificación"] || "":
                                                 notes[index][i].valor = data[rowAlumno][field] || "";
            }
            feebackCopy[index] = data[rowAlumno]["retroalimentación"];
        });
        setFeebacks(feebackCopy);
        setValues(notes);
        localStorage.setItem(`valuesInit-${indexEvaluation}`,JSON.stringify(notes));
        localStorage.setItem(`feedbacks-${indexEvaluation}`,JSON.stringify(feebackCopy));
    }
    
    const handleConfirm = () =>  setOpenSuccessPopUp(false)// Mostrar el popup después de guardar
    

    const dataNotEmpty =() => 
        values.every(valueGroup => valueGroup.every(item => item.valor !== "")) && feedbacks.every(fed => fed !== "");

    const submitData = async (event) =>{
    //verificar que no esta vacio
        event.preventDefault();
        if(!dataNotEmpty()){
            setWarningPopUp(true);
            return ;
        }
        setLoadingSpinner(true);
        const body ={
            "indice": indexEvaluation,
            "horario" : horarioId,
            "competencia":competitionId ,
            "alumnos" : []
        }
        content.forEach((element,index) => {
            const part = {
                "alumno_x_horario_id": element.id,
                    "notas_de_competencia":[{
                        "notas_alfabeticas":[{
                            "valor": values[index][values[index].length-1].valor,
                            "retroalimentacion": feedbacks[index],

                            "sub_notas": values[index].slice(0, -1).map(el => ({
                            "clave": el.compe,
                            "valor": el.valor
                            }))
                        }]
                    }]
            }
            body.alumnos.push(part);
        });
        console.log("BODY",body);
        try{
            await postCalificationSubcompetition(body);
            setLoadingSpinner(false);
            localStorage.removeItem(`valuesInit-${indexEvaluation}`);
            localStorage.removeItem(`feedbacks-${indexEvaluation}`);
            setSaveNotes(true);
            setOpenSuccessPopUp(true);
            itHasNotes.current = true;
            console.log("calificaciones enviadas correctamente");
        }catch(error){
            setLoadingSpinner(false);
            setOpenError(true);
            console.error("Error al enviar notas:", error);
        }
    }


    useEffect(() =>{
        console.log("me renderice");
        const verifyExistNotes = () => {
            const dataEmpy = content.every((elem,index) =>{
                return elem.notas_de_competencia?.[0].notas_alfabeticas[0].valor === ".";
            })
            return dataEmpy;
        }
        const initValues = () =>{
            return  Array.from({ length: content.length }, () => competitionSelect.subcompetencias.map(sub =>({compe: sub.clave,valor : ""
                })).concat({compe:"calificación",valor: ""}));
        }
        const initFeedbacks = () =>{
            return Array(content.length).fill('');
        }

        if(content && competitionSelect && content.length >0){

            if(!verifyExistNotes())itHasNotes.current = true;
            else itHasNotes.current = false;

            let valuesInit = localStorage.getItem(`valuesInit-${indexEvaluation}`);
            let feedbacksInit = localStorage.getItem(`feedbacks-${indexEvaluation}`);
            try{
                valuesInit = JSON.parse(valuesInit);
            }catch{
                valuesInit = null;
            }
            try{
                feedbacksInit = JSON.parse(feedbacksInit);
            }
            catch{
                feedbacksInit = null;
            }


            if(!valuesInit || !feedbacksInit ){ //si no hay localstorage guardado ,se inicializa
                if(itHasNotes.current){
                    console.log("rellena datos de notas guardadas");
                    valuesInit = initValues();
                    feedbacksInit = initFeedbacks();
                    content.forEach((elem,index) =>{
                        console.log("elemento",elem);
                        const lengthOptions = competitionSelect.subcompetencias.length+1;
                        for(let i=0; i< lengthOptions;i++){
                            const field = valuesInit[index][i].compe;
                            const valueCompeIndex = elem.notas_de_competencia[0].notas_alfabeticas[0].notas_alfabeticas_sub.findIndex(obj => obj.subcompetencia === field);

                            field ==="calificación" ?
                            valuesInit[index][i].valor = elem.notas_de_competencia[0].notas_alfabeticas[0].valor :
                            valuesInit[index][i].valor = elem.notas_de_competencia[0].notas_alfabeticas[0].notas_alfabeticas_sub[valueCompeIndex].valor;
                        }
                        feedbacksInit[index] = elem.notas_de_competencia[0].notas_alfabeticas[0].retroalimentacion;
                    });
                    itHasNotes.current = true;
                }
                else{
                    valuesInit = initValues();
                    feedbacksInit = initFeedbacks();
                }
                localStorage.setItem(`valuesInit-${indexEvaluation}`,JSON.stringify(valuesInit));
                localStorage.setItem(`feedbacks-${indexEvaluation}`,JSON.stringify(feedbacksInit));
            }
            const headsSubCom = [...competitionSelect.subcompetencias.map(comp => comp.clave),"calificación","retroalimentación","código del alumno"];

            setValues(valuesInit);
            setFeebacks(feedbacksInit);
            setHeadings(headsSubCom);

            console.log("Se seteo" , valuesInit);
        }else{
            console.log("Se muere");
            setValues([]);
            setFeebacks([]);
        }


    },[content,competitionSelect.subcompetencias,saveNotes])

    const exportToCSV = () => {
        if (!values || values.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }
            const headers = [
            ...competitionSelect.subcompetencias.map((subcom) => subcom.clave),
            "calificación",
            "retroalimentación",
            "código del alumno"
        ];
        const csvHeaders = headers.join(",") + "\n";
    
        const csvData = content.map((row, indexRow) => {
            const alumnoCodigo = row.alumno.codigo;
            const alumnoNombre = `${row.alumno.primerApellido}, ${row.alumno.nombre}`;
    
            const notasSubcompetencias = values[indexRow]
                .slice(0, competitionSelect.subcompetencias.length)
                .map((note) => {
                    if (note.valor === -1) return ""; // Convertir -1 a vacío
                    if (note.valor === -2) return "F"; // Convertir -2 a "F"
                    return note.valor || "";
                });
    
            const calificacion = values[indexRow][competitionSelect.subcompetencias.length].valor || "";
            const retroalimentacion = feedbacks[indexRow] || "";
    
            return [
                ...notasSubcompetencias,
                calificacion,
                retroalimentacion,
                alumnoCodigo,
            ].join(",");
        }).join("\n");
    
        // Combinar las cabeceras y los datos
        const csvContent = csvHeaders + csvData;
    
        // Crear un archivo Blob con el contenido CSV
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
        // Crear un enlace para descargar el archivo
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "calificaciones.csv";
    
        // Simular un clic en el enlace para iniciar la descarga
        link.click();
    
        // Limpiar el objeto URL
        URL.revokeObjectURL(url);
    };
    

    //only for now
    if (!content || content.length === 0 || !competitionSelect.subcompetencias || tablePartContent.length === 0 || !tablePartContent
    )
        return <div>Cargando...</div>;

    return(
        <>
            <div className="w-full mt-3 flex-row-reverse flex ">    
                <div className="w-36 mx-3">
                    <ButtonSpecial
                    type="Import"
                    submit={false}
                    action={ !(itHasNotes.current) ? handleImport: null}
                    disable={itHasNotes.current} />
                </div>
                <div className="w-36 mx-3">
                    <ButtonSpecial type="Export" action={exportToCSV}/>
                </div>  
            </div>
            <form className='bg-white p-4 rounded-lg shadow overflow-hidden'>
                <div className="overflow-x-auto rounded-t-2xl shadow-md" >
                    <table className="w-full ">
                        <thead className='bg-clrTableHead'>
                        <tr className='bg-clrTableHead h-11 '>
                            <th scope="col" className="px-6 py-3 text-center  font-medium text-white  tracking-wider  w-1/12">Código</th>
                            <th scope="col" className=" py-3 text-left font-medium text-white  tracking-wider ">Nombre Completo</th>
                            {
                                competitionSelect.subcompetencias.map(subcom => (
                                    <th scope="col" className="px-6 py-3 text-center font-medium text-white  tracking-wider " key={subcom.clave}>
                                        {subcom.clave}
                                    </th>
                                ))
                            }
                            <th scope="col" className="px-6 py-3 text-center font-medium text-white  tracking-wider  ">Calificación</th>
                            <th scope="col" className="px-6 py-3 text-center  font-medium text-white  tracking-wider ">Retroalimentación</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                values ? (
                                    tablePartContent.map((row,indexRow) =>{
                                const realIndexRow = getRealIndexRowTable(actualIndex,indexRow);
                                const notasAlfabeticasSub = row.notas_de_competencia?.[0]?.notas_alfabeticas?.[0]?.notas_alfabeticas_sub;
                                const notasAlfabeticasValor = row.notas_de_competencia?.[0]?.notas_alfabeticas?.[0]?.valor;
                                const feedbackAlfabeticas  =row.notas_de_competencia?.[0]?.notas_alfabeticas?.[0]?.retroalimentacion;
                                return  (<tr key={row.id} className="bg-white shadow-sm border-[#DDDEEE] border-2 border-solid border-t-0 box-border h-11">
                                        <td className="text-center text-gray-900 ">{row.alumno.codigo}</td>
                                        <td className=" text-gray-900">{`${row.alumno.primerApellido}, ${row.alumno.nombre}`}</td>
                                        {
                                            notasAlfabeticasSub ?
                                            notasAlfabeticasSub.map((notes,indexCol) =>(
                                                <td key={`${notes.valor} - ${notes.subcompetencia}`}
                                                className="text-center">
                                            <input
                                            disabled={itHasNotes.current}
                                            type="text"
                                            value={values[realIndexRow][indexCol].valor || ''}
                                            className="px-2 w-16 text-xs leading-5 font-semibold rounded-full border border-gray-300
                                            text-center "
                                            onChange={(event)=>handleNotes(event,realIndexRow,indexCol,notes.valor)}
                                            />
                                            </td>
                                        )) : <></>
                                    }
                                        <td className="text-center  py-2 text-gray-900">
                                            <input
                                            type="text"
                                            disabled={itHasNotes.current}
                                            value={values[realIndexRow][competitionSelect.subcompetencias.length].valor || ''}
                                            className="px-2 w-16 text-xs leading-5 font-semibold rounded-full border border-gray-300
                                            text-center "
                                            onChange={(event) =>handleNotes(event,realIndexRow,competitionSelect.subcompetencias.length,notasAlfabeticasValor)}
                                            />
                                        </td>
                                        <td className="text-center  py-2 text-gray-900">
                                            <button className="transform transition-transform duration-100 active:scale-95 hover:scale-105"
                                            onClick={() => handleDescription(realIndexRow,feedbackAlfabeticas)} type="button">
                                                <PenIcon/>
                                            </button>
                                        </td>

                                    </tr>)})) : (<></>)

                                }
                        </tbody>
                    </table>
                </div>
                <div className="w-full mt-3 flex-row-reverse flex ">
                    

                    <div className="w-36">
                        <ButtonSpecial
                        type="Save"
                        submit={!itHasNotes.current}
                        action={ !itHasNotes.current ? submitData: null}
                        disable={itHasNotes.current}
                        />
                    </div>
                </div>
                <div className="flex justify-center  mt-4">
                    <TableIndex
                    actionSelection={getIndexContent}
                    actualIndex={actualIndex}
                    count={totalIndex}
                    />
                </div>
                {
                    openPopUp &&
                    <FeedBackPopUp
                    controlOpen={setOpenPopUp}
                    setFeedback = {handleFeedbacks}
                    indexFeeback = {indexRow}
                    feedback = {feedback}
                    itHasNotes = {itHasNotes.current}
                    />
                }
            </form>
            {
                openPopUpCalif &&
                <FileSubmitPopup
                controlOpen = {setOpenPopUpCalif}
                setData={updateData}
                requireHeaders={headings}
                />
            }
            {loadingSpinner && <SpinnerLoading />}
            {
             <PopupSuccess
             isOpen ={openSuccessPopUp}
             text="Las calificaciones fueron registradas exitosamente!"
             onContinue = {handleConfirm}
             className="w-80"/>   
            }
            {
            <PopUpError
            isOpen={openError}
            className="w-80"
            onContinue={()=>setOpenError(false)}
            text="Lo sentimos, ocurrió un problema al realizar el registro de notas"
            />
            }
            {
                openWarningPopUp &&
                <PopupWarning
                text="Algunos campos de esta evaluación están incompletos,asegurese de completarlos todos."
                onClose= {()=>{setWarningPopUp(false)}}
                />
            }
        </>
    )
}

    //  /\_/\
    // ( o.o )
    //  > ^ < 🎂  Made by Dalpb