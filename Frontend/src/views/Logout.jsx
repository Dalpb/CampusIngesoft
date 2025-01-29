import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
export const Logout = () =>{
    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-bgLoginOne from-70% to-bgLoginTwo flex items-center justify-center p-4" >
          <div className='bg-white backdrop-blur-lg rounded-2xl w-full max-w-6xl overflow-hidden flex flex-col lg:flex-row'>
            
          </div>
        </div>
    )
}

export const LogoutProcess = () =>{
    const [isLoading,setIsLoading] = useState(true);
    const [animationText,setAnimationText] = useState(".");
    const navigate = useNavigate();

    useEffect(() =>{
        const handleSpinner =async () =>{
            // Eliminar la clave welcomeShown del localStorage
            localStorage.removeItem("welcomeShown");

            await new Promise(resolve => setTimeout(resolve,1000)); //PARA QUE SE VEA BONITO
            navigate("/login"); //Debe redigir a una confirmación que se cerró sesión
        }
        const handleAnimationText = setInterval(() => {
                setAnimationText(prev => prev.length <3 ? prev+"." : "");
            },400)
        handleSpinner();
        return () => clearInterval(handleAnimationText); 
    },[]);

    
    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-bgLoginOne from-70% to-bgLoginTwo flex items-center justify-center p-4" >
          <div className='bg-white backdrop-blur-lg rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-xl '>
            <div className="p-8 space-y-6">

                <h2 className="text-3xl font-semibold text-center ">Cerrando Sesión</h2>
                <div className="flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#aaa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-spin"
                    >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                </div>
                <p className="text-center text-[#888] text-xl">Espere hasta que se cierre su sesión 😁  {`${animationText}`}</p>
            </div>
          </div>
        </div>
    )
}