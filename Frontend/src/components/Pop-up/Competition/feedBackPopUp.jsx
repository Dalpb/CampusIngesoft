import { updatEvaluationQuantity } from "../../../services/coursesServices";
import { Button, ButtonSecondary } from "../../Button/Button"
import { useState,useEffect } from "react"
import { TextArea } from "../../Inputs/TextArea";
export const FeedBackPopUp = ({feedback,controlOpen,indexFeeback,setFeedback,itHasNotes}) =>{
    const [isVisible, setIsVisible] = useState(false);
    const [valueFeedback,setValueFeedback] = useState(feedback);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() =>{
            controlOpen(false);//action when close
        }, 200);
    };

    const handleTextArea = (e) =>{
        if(itHasNotes)return;
        const value = e.target.value;
        console.log(value);
        setValueFeedback(value);
    }

    const saveFeedback = () =>{
        setFeedback(indexFeeback,valueFeedback);
        handleClose();
    }
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`bg-white rounded-lg shadow-lg w-2/5  transform transition-all duration-300 ease-in-out py-6 px-5 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-5" >
                        <TextArea
                        disabled={itHasNotes}
                        description="Añade la retroalimentación del alumno"
                        label="Retroalimentación"
                        placeholder="Ejm: Se aborda de manera teórico-práctica la mecánica de la partícula, profundizando en los temas de cinemática y..."
                        value={valueFeedback}
                        onchange={(e)=>handleTextArea(e)}
                        />
                        {
                            itHasNotes ? <ButtonSecondary txt="Cerrar" type="button" action={handleClose} />:
                            <div className="flex gap-3 w-full justify-center">
                                    <ButtonSecondary txt="Salir" type="button" action={handleClose} tam="w-36" />
                                    <Button txt="Registrar" type="button" action={saveFeedback} tam="w-36"/>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}