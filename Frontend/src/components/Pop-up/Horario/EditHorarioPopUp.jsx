import React, { useEffect, useState } from "react";
import { Modal, ModalEditHorario } from "../Modal";
import { InputNumber, InputText, SelectInputProfPopUpHorario } from "../../Inputs/InputText";
import { Button, ButtonSecondary } from "../../Button/Button";
import { patchActualizarVacantes } from "../../../services/gestorServices";
import PopupSuccess from "../Response/SucessPopUp";


export const EditHorarioPopUp = ({isOpen, onClose, horario, setIsExitoPopup}) => {

  const [formData, setFormData] = useState(horario)
  const [codHorario, setCodHorario] = useState(formData.clave)
  const [numVacantes, setNumVacantes] = useState(formData.vacantes)
  const [isDone, setIsDone] = useState(false)
  const [canSave, setCanSave] = useState(true)
  const max = 60, min = 15;

  useEffect(() => {
    setFormData(horario); // Si horario es undefined, usa un objeto vacío
  }, [horario]);

  const validarVacantes = (numVacantes, mssg ,mssg2) => {
    if (numVacantes<=min){
      mssg.classList.remove("hidden");
      setCanSave(false)
      mssg2.classList.add("hidden");

    } else if (numVacantes>max) {
      mssg2.classList.remove("hidden");
      setCanSave(false)
      mssg.classList.add("hidden");
    } else {
      // si ya esta presente el hidden no hara nada 
      mssg.classList.add("hidden");
      mssg2.classList.add("hidden");
      setCanSave(true)
    }
  }


  useEffect(() => {
    console.log(numVacantes)
    const mssg = document.getElementById("warning")
    const mssg2 = document.getElementById("warning2")
    validarVacantes(numVacantes, mssg, mssg2)
    
  }, [numVacantes]);

  const handleSave = async () => {
    
    if(!canSave) return;
    horario.vacantes = numVacantes
    
    console.log("Datos guardados:", horario);
    
    try {
      const respuesta = await patchActualizarVacantes(horario.id, numVacantes);
      console.log('Vacantes actualizadas correctamente:', respuesta);
    } catch (error) {
      console.error('Error al actualizar las vacantes:', error);
      alert('Hubo un error al actualizar las vacantes');
    }

    // Llama a la función de onClose o cualquier otra función para enviar los datos
    // Si necesitas pasar estos datos al componente principal, podrías usar onClose(updatedHorario)
    onClose();  // Aquí le pasamos los datos actualizados al componente principal
    setIsExitoPopup(true)
  };
  
  return (
    <>
      <ModalEditHorario
        isOpen={isOpen}
        className="w-full"
        children={
        <>
          <h2 className="text-3xl font-semibold">Editar Horario</h2>
          <form>
            <div className="flex m-4 space-x-5 p-0">
              <InputText label={"Clave"} name={"inputClave"} placeholder={""} description={""}
                value={codHorario} disabled={true} className="h-1/2">  
              </InputText>
              <InputNumber label={"Vacantes"} name={"inputVacantes"} placeholder={""} description={""} min={min} max={max}
                value={numVacantes} onchange={(e) => setNumVacantes(e.target.value)} disabled={false}>  
              </InputNumber>
            </div>  
            <span id="warning" color="red" className="text-red-500 hidden italic">El horario debe tener al menos 15 vacantes</span>
            <span id="warning2" color="red" className="text-red-500 hidden italic">El horario no puede ofrecer mas de 60 vacantes</span>
            {/* botones */}
            <div className="flex justify-center mt-8 space-x-20">
              <ButtonSecondary txt={"Cancelar"} action={onClose} tam={"small"} type={"button"}/>
              <Button txt={"Guardar"} action={handleSave} type={"button"} tam={"small"} disable={!canSave}/>
            </div>
          </form>
        </>}
      />
    </>
  );
}



