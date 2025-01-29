import { createContext,useContext,useState,useEffect } from "react";
const EvaluationContext = createContext(null);

//alamcenará la competencia y subcompetencia seleccionada como tambien notas
export const EvaluationProvider = ({children}) =>{
    const [competitionSelect,setCompetitionSelect] = useState([]); //guarda info de la competencias elegia
    const [evaluationSelect,setEvaluationSelect] = useState([]); //guarda info de la evaluacionn elegida a ver
    
    const selectCompetition = (competition) =>{
        localStorage.setItem('competition',JSON.stringify(competition));
        setCompetitionSelect(competition);
    }
        


    useEffect(()=>{
        const saveCompetitionSelect = localStorage.getItem('competition');
        if(saveCompetitionSelect){
            setCompetitionSelect(JSON.parse(saveCompetitionSelect));
        }
    },[]);

    

    return (
        <EvaluationContext.Provider value={
            {selectCompetition,
            competitionSelect
        }}>
            {children}
        </EvaluationContext.Provider>
    )
}

export const useEvaluation = ()=>{
    return useContext(EvaluationContext);
}