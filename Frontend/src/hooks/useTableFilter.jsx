import { useEffect, useState } from "react"
import { TableIndex } from "../components/Table/TableIndex";


export const useTableFilter = ({content = [],rowsShow = 5}) =>{
    const [tableContent,setTableContent] = useState([]);
    const [tablePartContent,setTablePartContent] = useState([]);
    const [totalIndex,setTotalIndex] = useState(0); //total page
    const [actualIndex,setActualIndex] = useState(0); //actual page


    useEffect(()=>{
        if(content && Array.isArray(content)){
            setTableContent(content);
            const rowsContent  = content.length;
            const countsIndex = Math.ceil(rowsContent/rowsShow);
            setTotalIndex(countsIndex); 
            let partContent;
            if(rowsContent > rowsShow)partContent= content.slice(0,rowsShow);
            else partContent = content;
            setTablePartContent(partContent);
        }
    },[content,rowsShow])

  
    const getIndexContent = (index) =>{
        const start = index * rowsShow;
        const end = start + rowsShow;
        setTablePartContent(tableContent.slice(start,end));
        setActualIndex(index);
    }
   
    //index -> what page index you are , row -> what row in your table you are
    const getRealIndexRowTable = (index,row) =>{
        return row + rowsShow * index ;
    }

    return {actualIndex,
            totalIndex,
            tablePartContent,
            getIndexContent,
            getRealIndexRowTable}

}