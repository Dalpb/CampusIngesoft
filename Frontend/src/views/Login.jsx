import { useState } from "react";
import { Button } from "../components/Button/Button";
import { InputText } from "../components/Inputs/InputText";
import { LoginImagev1, LoginImagev2 } from "../components/Login/LoginImage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function Login(){

    const [userCode, setUserCode] = useState('');
    const [error, setError] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();


    const handleSubmit = async (event) => {
      event.preventDefault();
      setError(false);
      setIsLoading(true);
      try{
        console.log(userCode);
        const userData = await login(userCode);
        console.log(userData)
        switch(userData.tipo_usuario){
            case "profesor":
                switch(userData.tipo_profesor){
                    case "Director de Carrera":
                        navigate("/director");
                    break;
                    case "Regular":
                        navigate("/profesor/horarios");
                    break;
                    case "Gestor de Carrera":
                        navigate("/gestor/principal");
                    break;
                }
            break;
            case "alumno":
                navigate("/alumno/cursos");
            break;

        }
      }
      catch(error){
        setError(true);
        setIsLoading(false);
      }
    };

    return(
        <div className="bg-gradient-to-b from-bgLoginOne from-70% to-bgLoginTwo min-h-screen flex items-center justify-center p-4 w-full">
            <main className="bg-white md:rounded-l-lg md:rounded-r-0 rounded-lg shadow-xl overflow-auto max-w-6xl bg-opacity-20 w-5/6 h-[80vh] max-h-[700px]">
                <div className="flex flex-col md:flex-row h-full ">
                    <section className="text-white md:w-1/2 h-full md:flex flex-col justify-center items-center  h-auto">
                        <h2 className="lg:text-6xl text-4xl font-semibold mb-6 md:text-start text-center">
                            Bienvenido al <br/>servicio
                            <br/>
                            <span className="text-bgLoginOne">Campus virtual</span>
                        </h2>
                        <div className="md:flex w-9/12 h-3/5 items-center justify-center hidden ">
                        <LoginImagev2/>
                        </div>
                    </section>
                    <section className="md:w-1/2 bg-white rounded-l-2xl flex flex-col  items-center h-full w-full gap-4">
                    <form className="flex flex-col gap-4 items-center self-stretch w-full" onSubmit={handleSubmit}>
                        <h3 className="text-3xl  shadow-xl text-white bg-bgLoginOne  text-center p-3 md:mt-4 font-bold self-stretch">Ingrese con su cuenta</h3>
                        <div className="max-w-96 w-full md:px-0">
                            <InputText
                             label="Usuario"
                             name="userCode"
                             type="text"
                             description="Ingrese su código de usuario" 
                             placeholder=""
                             itsError={error}
                             value={userCode}
                             onchange ={(e) => setUserCode(e.target.value)}
                             />
                        </div>
                        
                        <div className="w-1/4">
                            <Button
                            txt={isLoading ? (
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="animate-spin"
                                >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>) :"Acceder"}
                            type="submit"
                            tam="large"
                            extraClasses="justify-center"/>
                        </div>
                    </form>
                    <div className="flex md:w-9/12 md:h-3/5 h-2/5 items-center justify-center ">
                        <LoginImagev1/>
                    </div>
                    </section>
                </div>
            </main>
        </div>
    )
}