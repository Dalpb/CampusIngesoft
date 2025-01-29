import React, { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { InputText, SelectInputProfPopUpHorario } from "../../Inputs/InputText";
import { Button, ButtonSecondary } from "../../Button/Button";


export const CreateHorarioPopUp = ({isOpen, onClose, cursoId}) => {

  const [codHorario, setCodHorario] = useState("")
  const [numVacantes, setNumVacantes] = useState("")
  const [profe, setProfe] = useState("")

  //console.log()
  const handleSubmitNewHorario = () => {
    
    console.log("guardado")
    onClose()
  }
  
  return (
    <Modal
      isOpen={isOpen}
      className="w-full"
    >
      <h2 className="text-3xl font-semibold">Horario</h2>
      <form>
        <div className="flex m-3 space-between space-x-20">
          <InputText label={"Clave"} name={"inputClave"} placeholder={""} description={""}
            value={codHorario} onchange={(e) => setCodHorario(e.target.value)} size={"sm"} disabled={false}>  
          </InputText>
          <InputText label={"Vacantes"} name={"inputVacantes"} placeholder={""} description={""}
            value={numVacantes} onchange={(e) => setNumVacantes(e.target.value)} size={"sm"} disabled={false}>  
          </InputText>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Sesiones</h3>
          <div className="m-3">  
            <SelectInputProfPopUpHorario children={
              <>
              <option value={profe}>{profe}</option>
              <option value="Otro Profesor">Otro Profesor</option>
              </>
              } label={"Profesor"} value={profe}
              name={"selectProfesor"} description={""} msgError={"Error"} onchange={(e) => setProfe(e.target.value)}/>
          </div>
        </div>

        {/* botones */}
        <div className="flex justify-center mt-8 space-x-20">
          <ButtonSecondary txt={"Cancelar"} action={onClose} tam={"small"} type={"button"}/>
          <Button txt={"Guardar"} action={handleSubmitNewHorario} type={"button"} tam={"small"}/>
        </div>
      </form>
    </Modal>
  );
}



