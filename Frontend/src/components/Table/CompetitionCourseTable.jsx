import { useTableFilter } from "../../hooks/useTableFilter"
import { TableIndex } from "./TableIndex";
import "../../App.css"
import { useState,useRef,useEffect } from "react";
import { ChangeQuantityPopUp } from "../Pop-up/Competition/ChangeQuantityPopUp";
import { useEvaluation } from "../../context/EvaluationContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button } from "../Button/Button";
import { Eye, File } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { InputNumber } from "../Inputs/InputText";
import { FileText,Edit2 } from "lucide-react";
//mejoras: tratar de utilizar el scheduleContext y no pasarlo por props
export const CompetitionCourseTable =({competitionCourse = [],scheduleId}) =>{

    const location = useLocation();
    const navigate  = useNavigate();
    const isEditingQuantity = useRef(false);
    const [openPopUp,setOpenPopUp] = useState(false);
    const [descripcion,setDescripcion] = useState("");
    const [openEye,setOpenEye] = useState(false);
    const [quantitySelect,setQuantitySelect] = useState(0);
    const {totalIndex,tablePartContent,getIndexContent,actualIndex,getRealIndexRowTable} = useTableFilter({content:competitionCourse});
    const {competitionSelect,selectCompetition} = useEvaluation();
    const [competitonId,setCompetitionId] = useState(0);
    const [quantitys,setQuantitys] = useState([]);
    const [indexRowChange,setIndexRowChange] = useState(null);
    // const [editarEval,setEditarEval] = useState(false);
    // const [editNumber,setEditNumber] = useState

    const openEyeModal = (description = "") =>{
        setDescripcion(description);
        setOpenEye(true);
    }
    const closeEyeModal = () => setOpenEye(false);

    const handleQuantity = (value,competitionid,realIndexRow) =>{
        setQuantitySelect(value);
        setIndexRowChange(realIndexRow);
        setOpenPopUp(true);
        setCompetitionId(competitionid);
    }
    
    const goToNotesCompetition = (competition) =>{
        console.log(competition);
        selectCompetition(competition);

        //aseguramos no guardar masivamente en el localstorage
      
        navigate(`/profesor/horarios/${scheduleId}/competencias/${competition.clave}/subcompetencias`,
            {state:{...location.state,compId:competition.idCompetencia}});
    } 
    
    useEffect(()=>{
        if(competitionCourse.length >0){
            const quantitysCourse = competitionCourse.map(comp => comp.cantidadEvaluaciones);
            setQuantitys(quantitysCourse);
        }
    },[competitionCourse])
    

    return(
    <div className='bg-white p-4 rounded-lg shadow overflow-hidden'>
                <div className="overflow-x-auto rounded-t-2xl shadow-md" >
                    <table className="w-full ">
                        <thead className='bg-clrTableHead h-8'>
                            <tr className='bg-clrTableHead h-8 '> 
                                <th scope="col" className="px-6 py-3 text-left  font-medium text-white  tracking-wider  w-1/12">Clave</th>
                                <th scope="col" className="px-6 py-3 text-left  font-medium text-white  tracking-wider ">Nombre de la competencia</th>
                                <th scope="col" className="px-6 py-3 text-center font-medium text-white  tracking-wider   w-4/12">Descripción</th>
                                <th scope="col" className="px-6 py-3 text-center  font-medium text-white  tracking-wider ">Cantidad Evaluaciones</th>
                                <th scope="col" className="px-6 py-3 text-center  font-medium text-white  tracking-wider ">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                               quantitys.length >0 && tablePartContent.map((comp,indexRow) =>{
                                    const realIndexRow = getRealIndexRowTable(actualIndex,indexRow);
                                    return(<tr key={comp.clave} className='bg-white shadow-sm border-[#DDDEEE] border-2 border-solid border-t-0 box-border'>
                                        <td className="px-6 py-4 text-sm  text-gray-900">{comp.clave}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{comp.nombre}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 flex justify-center items-center">
                                            <button
                                            onClick={()=>openEyeModal(comp.descripcion)}
                                            className="flex items-center justify-center w-8 h-8 rounded-full hover:text-bgLoginOne transition"
                                            aria-label="Ver motivo"
                                            >
                                            <Eye />
                                            </button>
                                        </td>
                                        
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center ">
                                            {
                                              quantitys[realIndexRow]
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center ">
                                            <div className="flex justify-center items-center gap-5">
                                           
                                            <div
                                            onClick={
                                              quantitys[realIndexRow] === 0 ?
                                              (()=>handleQuantity(comp.cantidadEvaluaciones,comp.idCompetenciaxHorario,realIndexRow)) : null
                                            }
                                            className={`${quantitys[realIndexRow] ? "opacity-50" : " transform transition-transform duration-75 active:scale-95 hover:scale-105"}`}
                                            >
                                              <Edit2 />
                                            </div>
                                            <div
                                            onClick={()=>goToNotesCompetition(comp)
                                            }
                                            className="cursor-pointer hover:scale-105 transform transition-transform duration-75 active:scale-95">
                                              <FileText   />
                                            </div>
                                            </div>
                                        </td>
                                        <td>

                                        </td>
                                    </tr>
                                
                            )})
                            }
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <TableIndex 
                        count={totalIndex}
                        actionSelection={getIndexContent}
                        actualIndex = {actualIndex}
                        />
                </div>
            {
                openPopUp && (
                    <ChangeQuantityPopUp
                    actualQuantity={quantitySelect}
                    competitionId = {competitonId}
                    scheduleId = {scheduleId}
                    controlOpen={setOpenPopUp}
                    realIndex= {indexRowChange}
                    setQuantitys ={setQuantitys}
                    />
                )

            }
            <Modal isOpen={openEye} onClose={closeEyeModal} content={descripcion}/>
    </div>
    )
}



export function Modal({ isOpen, onClose, content }) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900 text-center">Motivo</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-sm leading-relaxed text-justify">{content}</p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-center">
                <Button
                  txt="Cerrar"
                  action={onClose}
                  type="button"
                  extraClasses="ml-3 hover:bg-blue-600 text-white"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }