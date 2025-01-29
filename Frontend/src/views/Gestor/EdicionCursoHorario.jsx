
import { Bar } from "../../components/Bars/Bar"
import { InputText, SelectInput } from "../../components/Inputs/InputText"
import { TextArea } from "../../components/Inputs/TextArea"
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer"
export  const EdicionCursoHorario = ({curso}) =>{
    return(
        <AnimatedContainer>
            <div className="p-4  rounded-lg w-full max-w-6xl md:mx-auto md:my-auto mb-14">
                <Bar className="gap-3">
                    <h2 className="text-3xl  font-bold mb-4 md:text-left text-center text-[#060C37]" >Información del curso</h2>
                    <div className="grid md:grid-cols-3 gap-6 ">
                        <InputText 
                        label="Código"
                        description="Código del curso"
                        disabled={true}
                        />
                        <InputText
                        label="Créditos"
                        description="Cantidad de créditos"/>
                        <SelectInput className=" flex items-center h-10"
                        label="Nivel">
                            <option>1er Ciclo</option>
                            <option>2do Ciclo</option>
                            <option>3er Ciclo</option>
                            <option>4to Ciclo</option>
                            <option>5to Ciclo</option>
                            <option>6to Ciclo</option>
                            <option>7mo Ciclo</option>
                            <option>8vo Ciclo</option>
                            <option>9no Ciclo</option>
                            <option>10mo Ciclo</option>
                            <option>Electivo</option>
                        </SelectInput>
                    </div>
                    <div>
                        <InputText
                        label="Nombre"
                        description="Nombre del curso"/>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <InputText 
                        type="number"
                        label="Año"
                        description="Ciclo ingresado"
                        />
                        <SelectInput className="flex items-center h-10"
                        label="Periodo">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                        </SelectInput>
                        <div className="col-span-2">
                        <TextArea 
                            label="Descripción"
                            description="Descripción que se verá en el curso"
                            />
                        </div>
                    </div>
                    <h2 className="text-3xl  font-bold mb-4 md:text-left text-center text-[#060C37]">Horarios del curso</h2>
                    {/* Estructura para iterar los horarios */}
                    <div className="grid md:grid-cols-4 grid-cols-2 gap-6 ">
                        <InputText 
                        label="Código"
                        description="Código del horario"
                        disabled={true}/>
                        <InputText
                        label="Vacantes"
                        description="Maximo de estudiantes"/>
                        <InputText 
                        label="Sesiones"
                        description="Cantidad de sesiones"
                        /> 
                        <SelectInput className=" flex items-center h-10"
                        label="Profesor">
                            <option>Manuel Tupia</option>
                            <option>Midudev</option>
                            <option>Linus Torvalds</option>
                            <option>Jonathan Mircha</option>
                        </SelectInput>
                    </div>
                    <hr className="border-3" />
                </Bar>
            </div>
        </AnimatedContainer>
    )
}