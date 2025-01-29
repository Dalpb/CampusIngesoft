import React, { useState } from 'react'
import { ButtonSpecial } from '../Button/ButtonSpecial'

export const DatosProfe = () => {

    return (
        <div className="m-auto bg-white p-0 rounded-lg shadow-md w-[70%] flex">
            {/* Contenedor de la Evaluación */}
            <div className='flex flex-col space-y-2 p-[5px] ml-[10px] w-[50%]'>
                <span className='text-gray-500'>Evaluacion</span>
                <span>Laboratorio 1</span>
            </div>
            
            {/* Contenedor del Botón */}
            <div className='flex-grow flex justify-end items-center pr-4'>
                <div>
                <ButtonSpecial type={"Import"} disable={false}></ButtonSpecial>
                </div>
            </div>
        </div>
    )
}

