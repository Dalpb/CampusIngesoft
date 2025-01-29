import { useEffect, useState,useRef } from "react";
export function SquareIndex({number,isSelected,onChange}){

    const result = isSelected ? "bg-bgLoginOne text-white" : "bg-white border-2 border-bgLoginOne text-black ";  
    
    return(
        <div className={`${result} w-10 h-10 flex justify-center items-center text-2xl cursor-pointer`} onClick={onChange}>
            {number}
        </div>
    )
}

export function TableIndex({count,actionSelection,actualIndex}){
    const init = useRef(true);
    const [isSelected,setSelected] = useState([]);
    
    const changeIndex = (index) =>{
        //asegurar que no haya cambios si index es igual
        const newState = [...isSelected];
        newState.fill(false);
        newState[index] = !newState[index];
        setSelected(newState);
        actionSelection(index);
        init.current = false;
    }
    const changeNext = () =>{
        const indexState = [...isSelected];
        const index = indexState.findIndex( value => value === true);
        if(index >= count-1)return;
        changeIndex(index +1);
    }
    const changePrevius = () =>{
        const indexState = [...isSelected];
        const index = indexState.findIndex( value => value === true);
        if(index <= 0 )return;
        changeIndex(index-1);
    }

    useEffect(()=>{
        setSelected(Array(count).fill(false))
        changeIndex(0);
    },[count])

    if(count <= 1 ) return <></> 
    return(
        <div className="flex items-center gap-3">
            <div className="text-clrTableRow cursor-pointer" onClick={changePrevius}>{"<<"}</div>
            {
            Array.from({length: count}, (_,i)=>(
                <SquareIndex
                key={`SquareIndex-${i}`}
                number={i+1}
                isSelected={isSelected[i]}
                onChange = {() => changeIndex(i)}
                />
            ))
            }
            <div className="text-clrTableRow cursor-pointer" onClick={changeNext}>{">>"}</div>
        </div>           
    )
}


// Solo SquareIndex2 y TableIndex2 se usan cuando el servicio maneja un paginado para no recargar 
// la pagina, por ejemplo al mostrar todos los cursos del ciclo para el director
export function SquareIndex2({ number, isSelected, onChange }) {
    const result = isSelected
        ? "bg-bgLoginOne text-white"
        : "bg-white border-2 border-bgLoginOne text-black";
    
    return (
        <div
            className={`${result} w-10 h-10 flex justify-center items-center text-2xl cursor-pointer`}
            onClick={onChange}
        >
            {number}
        </div>
    );
}

export function TableIndex2({ count, actionSelection, actualIndex = 0 }) {
    const [isSelected, setSelected] = useState([]);
    const init = useRef(true);

    const changeIndex = (index) => {
        if (index < 0 || index >= count) return; // Validación para evitar índices fuera de rango
        const newState = Array(count).fill(false);
        newState[index] = true;
        setSelected(newState);
        actionSelection(index + 1); // Enviar índice 1-based al servicio
        init.current = false;
    };

    const changeNext = () => {
        const currentIndex = isSelected.findIndex((value) => value === true);
        if (currentIndex < count - 1) {
            changeIndex(currentIndex + 1);
        }
    };

    const changePrevious = () => {
        const currentIndex = isSelected.findIndex((value) => value === true);
        if (currentIndex > 0) {
            changeIndex(currentIndex - 1);
        }
    };

    useEffect(() => {
        setSelected(Array(count).fill(false));
        changeIndex(actualIndex); // Sincroniza el índice inicial con `actualIndex`
    }, [count, actualIndex]);

    if (count <= 1) return null;

    return (
        <div className="flex items-center gap-3">
            <div
                className={`text-clrTableRow cursor-pointer ${
                    isSelected[0] && "opacity-50"
                }`}
                onClick={changePrevious}
            >
                {"<<"}
            </div>
            {Array.from({ length: count }, (_, i) => (
                <SquareIndex2
                    key={`SquareIndex-${i}`}
                    number={i + 1}
                    isSelected={isSelected[i]}
                    onChange={() => changeIndex(i)}
                />
            ))}
            <div
                className={`text-clrTableRow cursor-pointer ${
                    isSelected[count - 1] && "opacity-50"
                }`}
                onClick={changeNext}
            >
                {">>"}
            </div>
        </div>
    );
}

export function TableIndexPaginacion({ count, current = 1, actionSelection }) {
    const [isSelected, setSelected] = useState([]);

    // Actualiza el estado del índice seleccionado
    const changeIndex = (index) => {
        if (index < 0 || index >= count) return; // Validación para evitar índices fuera de rango
        const newState = Array(count).fill(false);
        newState[index] = true;
        setSelected(newState);
        actionSelection(index + 1); // Callback con índice 1-based
    };

    // Cambia al índice siguiente
    const changeNext = () => {
        const currentIndex = isSelected.findIndex((value) => value === true);
        if (currentIndex < count - 1) {
            changeIndex(currentIndex + 1);
        }
    };

    // Cambia al índice anterior
    const changePrevious = () => {
        const currentIndex = isSelected.findIndex((value) => value === true);
        if (currentIndex > 0) {
            changeIndex(currentIndex - 1);
        }
    };

    // Inicializa el estado cuando `current` o `count` cambian
    useEffect(() => {
        const initialState = Array(count).fill(false);
        initialState[current - 1] = true; // Marca como seleccionado el índice actual
        setSelected(initialState);
    }, [count, current]);

    if (count <= 1) return null; // No mostrar si hay una sola página

    return (
        <div className="flex items-center gap-3">
            {/* Botón de página anterior */}
            <div
                className={`text-clrTableRow cursor-pointer ${
                    isSelected[0] ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={changePrevious}
            >
                {"<<"}
            </div>
            {/* Botones de las páginas */}
            {Array.from({ length: count }, (_, i) => (
                <SquareIndex2
                    key={`SquareIndex-${i}`}
                    number={i + 1}
                    isSelected={isSelected[i]}
                    onChange={() => changeIndex(i)}
                />
            ))}
            {/* Botón de página siguiente */}
            <div
                className={`text-clrTableRow cursor-pointer ${
                    isSelected[count - 1] ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={changeNext}
            >
                {">>"}
            </div>
        </div>
    );
}



