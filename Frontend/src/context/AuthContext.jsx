import { createContext,useContext,useState,useEffect } from "react";
import { loginUser } from "../services/userServices";
const AuthorContext = createContext(null);

const EstadosMatricula ={
    PREMATRICULA: 'Prematricula',
    MATRICULA: 'Matricula',
    PUBMATRICULA: 'Publicacion Matricula',
    MATRICULAEXT: 'Matricula Extemporanea',
    PUBMATRICULAEXT: 'Publicación Mat. Ext',
    INICIO: 'Ciclo Lectivo',
    FIN: 'Fin de Ciclo'
}


export const AuthProvider = ({children}) =>{
    const [userInformation,setUserInformation] = useState(null);
    const [isLoadingUser,setIsLoadingUser] = useState(true);
    const [isMatricula,setIsMatricula] = useState(false);
    const [estado,setEstado] = useState("");


    useEffect(() =>{ //if its online
      const saveUserInfo = localStorage.getItem('user');
      if(saveUserInfo){
        const infoUser = JSON.parse(saveUserInfo);
        setUserInformation(infoUser);
        setIsMatricula(infoUser?.estado !== EstadosMatricula.INICIO  && infoUser?.estado !== EstadosMatricula.FIN);
        console.log("cargando datos" + saveUserInfo); 
        setEstado(infoUser?.estado);
      }  
      setIsLoadingUser(false);
      
    },[]);

    const login = async(userCode) =>{ //init sesion
        try{
            const userData = await loginUser(userCode);
            localStorage.setItem('user',JSON.stringify(userData));
            setUserInformation(userData);
            setEstado(userData?.estado);
            setIsMatricula(userData?.estado !== EstadosMatricula.INICIO  && userData?.estado !== EstadosMatricula.FIN);
            return userData;
        }
        catch(error){
            throw error;
        }
    }
    const modificarEstadoMatricula = estado => {
        setEstado(estado);
        setIsMatricula(estado !== EstadosMatricula.INICIO && estado !== EstadosMatricula.FIN);
    }


    const logout = () => { //close sesion
        localStorage.removeItem('competition');
        localStorage.removeItem('schedule');
        localStorage.removeItem('user'); 
        setUserInformation(null); 
    }
    
    const getName  =() =>{
        if(userInformation){
            return `${userInformation.nombre} ${userInformation.primerApellido} ${userInformation.segundoApellido}`;
        }
        else return "";
    }
    const obtenerEstado = () =>{
        return estado;
     }

    //provide information, functions
    return(
        <AuthorContext.Provider value={{userInformation,login,logout,getName,isLoadingUser,isMatricula,obtenerEstado,EstadosMatricula,modificarEstadoMatricula}}> 
            {children}        
        </AuthorContext.Provider>
    )
}

export const useAuth =() =>{
    //return the context
    return useContext(AuthorContext);
}