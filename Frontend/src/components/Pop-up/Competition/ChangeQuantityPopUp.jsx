import { updatEvaluationQuantity } from "../../../services/coursesServices";
import { Button, ButtonSecondary } from "../../Button/Button"
import { useState,useEffect } from "react"
export const ChangeQuantityPopUp = ({actualQuantity,competitionId,scheduleId,controlOpen,realIndex,setQuantitys}) =>{
    const [quantity,setQuantity] = useState(actualQuantity);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
      }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() =>{
            controlOpen(false);
        }, 200); 

      };

    const handleQuantity = event =>{
        const value = event.target.value;
        setQuantity(value);
    }

    const handleSubmit = async(event) =>{
        event.preventDefault();
        if(isNaN(quantity)){
            console.log(quantity);
            return;
        }
        const numQuant = parseInt(quantity);
        console.log("comxhorario",competitionId,scheduleId,numQuant);
        try{
           await updatEvaluationQuantity(competitionId,scheduleId,numQuant);
           console.log("Se actualizó con exito");
           setQuantitys(prev => {
                const nuevo = [...prev];
                nuevo[realIndex] = numQuant;
                return nuevo;
           })
           handleClose();
        }catch(error){
            console.log("No se puede actualizar");
        }
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`bg-white rounded-lg shadow-lg w-80  transform transition-all duration-300 ease-in-out py-6 px-2 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="flex flex-col gap-5">
                    <h2 className="font-semibold text-center">Ingrese la cantidad de evaluaciones</h2>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <input 
                        placeholder="Ejm:5"
                        value={quantity}
                        onChange={handleQuantity}
                        className="w-full  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-3 justify-center">
                            <ButtonSecondary txt="Descartar" type="button" action={handleClose} />
                            <Button txt="Registrar" type="submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}