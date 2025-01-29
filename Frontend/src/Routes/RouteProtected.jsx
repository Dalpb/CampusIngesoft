import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import{ 
    Navigate,
    useNavigate,
    Outlet,
    useLocation
} from "react-router-dom";

export function RouteProtected({children,redicetTo="/",rol}){
    const navigate = useNavigate();
    const {userInformation,isLoadingUser} = useAuth();
    const location = useLocation();
    useEffect(() =>{
        if(!isLoadingUser){
            console.log("miau")
            if(!userInformation){ //verify user exits is login 
                console.log("me fui")
                navigate(redicetTo, { replace: true });
            }
            else if(userInformation.tipo_usuario != rol){
                //se mantiene en en su lugar o  manda un mensaje de no permisos
                navigate(location.pathname, { state: { from: location }, replace: true });
            }
        }
    }, [userInformation,isLoadingUser])



    return children ? children : <Outlet />
}