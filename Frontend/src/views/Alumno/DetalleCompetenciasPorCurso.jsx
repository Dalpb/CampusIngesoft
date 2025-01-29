import { useAuth } from "../../context/AuthContext";
import Layout, { LoadingLayout, TitleLayout } from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { GrillaDetalleCompetencias } from "../../components/grilla/GrillaDetalleCompetencias";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCompetitionResults } from "../../services/evaluationServices";
import { EmptyState } from "../../components/grilla/grillaEmpty";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";

export function DetalleCompetenciasPorCurso(){
    const {userInformation} = useAuth();
    const location = useLocation();
    const { idCurso } = useParams(); // Recuperar ID del curso desde la URL
    const navigate = useNavigate();

    const {cursoId= idCurso,
          cursoClave,
          cursoNombre,
          periodo ,
          horarioNum
        } = location.state || {};
    const [competencias,setCompetencias] = useState({}); 
    console.log("locationCompetencias", location.state);

    const getCompetition = async () =>{
      try{
        const allCompetitions = await getCompetitionResults(userInformation.id,periodo.id);
        console.log("todas las competencias",allCompetitions);
        const competitionIndex = allCompetitions.findIndex(elem => elem.curso.clave === cursoClave);
        if(competitionIndex === -1)throw new Error();
        setCompetencias(allCompetitions[competitionIndex]);
        console.log(allCompetitions[competitionIndex]);
      }catch{
        console.log("periodo", periodo.id);
        console.error("No se obtuvo las competencias");
        setCompetencias([]);
      }
    }
    useEffect(()=>{
        if(!userInformation)return ;
        getCompetition();
      }
    ,[userInformation])

    if(!userInformation || !Object.keys(competencias).includes("competencias")){
      console.log(competencias);
      return <LoadingLayout msg="Cargando sus resultados de la competencia"/>
    }
      

    return(
      <AnimatedContainer>
          <div className='md:px-8 px-2 py-4 flex flex-col gap-6 max-w-6xl mx-auto'>
              <TitleLayout title={`${cursoClave} - ${cursoNombre}`} cicle={periodo.periodo} schedule={horarioNum}/>
              <div className="w-full mx-auto">
                {/* Mostrar EmptyState si no hay competencias */}
                {competencias.competencias.length === 0 ? (
                  <div className="flex items-center justify-center h-[50vh]">
                    <EmptyState
                      mainMessage="No se han registrado competencias todavía"
                      secondaryMessage="Cuando se registren las calificaciones, aparecerán aquí."
                    />
                  </div>
                ) : (
                  competencias.competencias.map((comp) => (
                    <GrillaDetalleCompetencias
                      claveCurso={cursoId}
                      key={comp.clave}
                      clave={comp.clave}
                      nombre={comp.nombre}
                      calificaciones={comp.notasAlfabeticas}
                      period={periodo}
                    />
                  ))
                )}
              </div>
          </div>
          </AnimatedContainer>
    )
}