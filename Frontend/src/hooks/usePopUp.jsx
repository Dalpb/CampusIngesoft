import { useEffect, useState } from "react"

export const usePopUp = (onClose)=>{
    const [isVisible,setIsVisible] = useState(false);

    useEffect(() =>{
        setIsVisible(true);
    },[]);

    const handleClose = () =>{
        setIsVisible(false);
        setTimeout(() =>{
            onClose();
        },200)
    }

    return {isVisible,setIsVisible}
}