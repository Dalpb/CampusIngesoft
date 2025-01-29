
import { 
  Bar,
  BarOption
} from "../../components/Bars/Bar"
import { ButtonSpecial } from "../../components/Button/ButtonSpecial"
import { InputText, SelectInput } from "../../components/Inputs/InputText"
import { EmptySchedulesIcon } from "../../components/grilla/GridIcons"
import { HorariosTableDirector } from "../../components/Table/HorariosTableDirector"
import { LoadingLayout } from "../../components/Layout/Layout"
import { TableIndexPaginacion } from "../../components/Table/TableIndex"
import { useMatriculaDirector } from "../../context/DirectorContext"
import { useAuth } from "../../context/AuthContext";
import { useContext, useEffect } from "react"
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer"
import { useState } from "react"


export function AdministracionMatricula(){
  const matriculaContexto = useMatriculaDirector();
  if (matriculaContexto == null)    return ;
  const {
    cursos,
    totalCursos,
    totalHorarios,
    totalAlumnos,
    totalProfesores,
    loading,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
    consultarCursos
  } = matriculaContexto;
  
  const { userInformation } = useAuth();
  const [searchTermNombre, setSearchTermNombre] = useState('');
  const [searchTermClave, setSearchTermClave] = useState('');
  const [selectedNivel, setSelectedNivel] = useState('');
  
  const  realizarFiltrado = async () =>{
      setCurrentPage(1);
      console.log("Parametros" , searchTermClave, searchTermNombre, selectedNivel,1);
      await consultarCursos(1,searchTermClave,searchTermNombre,selectedNivel);
  }


  useEffect(()=>{
      const consulto = async () => {
        console.log("Parametros" , searchTermClave, searchTermNombre, selectedNivel,currentPage);
        await consultarCursos(currentPage,searchTermClave,searchTermNombre,selectedNivel);
      }
     consulto();
  }
   ,[currentPage]);

  // Renderizar la tabla
  if (loading) {
    return (
        <div>
            {/* <div className="mb-80">
            </div>
            <div >
                <LoadingLayout msg="Cargando la información de los cursos y horarios" />
            </div> */}
        </div>
    );
    }

  return(
    <AnimatedContainer>
      <div className="p-4  rounded-lg w-full max-w-6xl md:mx-auto md:my-auto mb-14">
           <h1 className="text-3xl  font-bold mb-4 md:text-left text-center text-[#060C37]" >Información general</h1>
           <div className="flex flex-col gap-3">
              <Bar className="lg:grid-cols-4 md:grid-cols-2 gap-4" >
                  <BarOption title="Cursos Registrados" result={totalCursos}></BarOption>
                  <BarOption title="Total de alumnos" result={totalAlumnos}></BarOption>
                  <BarOption title="Total de profesores" result={totalProfesores}></BarOption>
                  <BarOption title="Total de horarios" result={totalHorarios}></BarOption>
              </Bar>
              <hr className="border-3 mt-4 mb-4" />
           </div>
           <h1 className="text-3xl  font-bold mb-4 md:text-left text-center text-[#060C37]" >Filtrado de cursos</h1>
          <div className="flex flex-col gap-3">
              <Bar className="lg:grid-cols-4 md:grid-cols-3 gap-4">
                  <InputText
                  label="Código del Curso"
                  description="Ingrese el código del curso"
                  placeholder="Ejm: IFSI12"
                  value = {searchTermClave}
                  onchange = {e => setSearchTermClave(e.target.value)}
                  />
                  <InputText 
                  label="Nombre del Curso"
                  description="Ingrese el nombre del curso"
                  placeholder="Física 1"
                  value={searchTermNombre}
                  onchange={e => setSearchTermNombre(e.target.value)}
                  />
                  <SelectInput 
                  label="Nivel"
                  description="Cursos del nivel"
                  value={selectedNivel}
                  onchange={e => setSelectedNivel(e.target.value)}
                  className="h-11">
                      <option value = "">Seleccione el nivel</option>
                      <option value = "1">1er Ciclo</option>
                      <option value = "2">2do Ciclo</option>
                      <option value = "3">3er Ciclo</option>
                      <option value = "4">4to Ciclo</option>
                      <option value = "5">5to Ciclo</option>
                      <option value = "6">6to Ciclo</option>
                      <option value = "7">7mo Ciclo</option>
                      <option value = "8">8vo Ciclo</option>
                      <option value = "9">9no Ciclo</option>
                      <option value = "10">10mo Ciclo</option>
                      <option value = "E">Electivo</option>
                  </SelectInput>
                  <ButtonSpecial 
                  type="Filter"
                  className="self-center lg:col-span-1 md:col-span-3"
                  action = {realizarFiltrado}
                  />
              </Bar>
              <hr className="border-3" />
              <h1 className="text-3xl  font-bold mb-4 md:text-left text-center text-[#060C37]" >Cursos y horarios registrados</h1>
          </div>
          {
              cursos?.length >= 0?
              (
              <div className="w-full flex flex-col mb-3" >
                  <HorariosTableDirector cursos={cursos} user={userInformation}></HorariosTableDirector>
                  <div className="flex justify-center mt-4"> 
                    <TableIndexPaginacion 
                        count={totalPages} 
                        current={currentPage}
                        actionSelection={(page) => setCurrentPage(page)}
                    />
                  </div>
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

      </div>
    </AnimatedContainer>
  )
} 