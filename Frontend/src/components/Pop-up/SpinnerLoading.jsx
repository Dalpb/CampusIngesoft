import { Oval } from "react-loader-spinner";

export const SpinnerLoading = ( ) =>{
    return(
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <Oval 
                height={100} 
                width={100} 
                color="#4a90e2" // Un tono de azul principal
                secondaryColor="#b0d0e6" // Un azul más claro para el contraste                
                strokeWidth={5} // Ajusta el grosor del borde
            />
        </div>
    )
}