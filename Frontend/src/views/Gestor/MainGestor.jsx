import { useState } from "react";
import Layout, { TitleLayout } from "../../components/Layout/Layout";
import DashboardGestor  from "../../components/Dashboard/DashboardGestor";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";

export const MainGestor = () => {
    const {userInformation,getName} = useAuth();    
    
    if (!userInformation) {
        return <div>Cargando datos del usuario...</div>; // until loading
    }
    return (
        <AnimatedContainer>
            <div className='md:px-16 px-2 py-4 flex flex-col gap-6'>
                <TitleLayout 
                    title=""
                />
                <DashboardGestor></DashboardGestor>
            </div>
        </AnimatedContainer>
    );
};