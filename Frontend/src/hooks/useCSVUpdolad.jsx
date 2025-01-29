import Papa from 'papaparse';
import { useState } from 'react';
export const  useCSVUpload = (requiredHeaders) => {
    const [data,setData] = useState([]);
    const [error,setError] = useState("");
    const [fileName,setFileName] = useState("");


    const handleFileSubmit = (event) =>{
        const file = event.target.files[0];
        
        if(file){
            setFileName(file.name);
            Papa.parse(file,{
                header:true,
                skipEmptyLines:true,
                complete: (results) =>{
                    setError("");
                    const headers = results.meta.fields;
                    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
                    console.log(missingHeaders);
                    if(missingHeaders.length > 0){
                        setError(`El archivo no cuenta con los encabezados `)
                        console.log("No hay headers")
                        setData([]);
                        return;
                    }
                    setData(results.data);
                }
         })
        }
    }
    return {data,error,fileName,handleFileSubmit};
}