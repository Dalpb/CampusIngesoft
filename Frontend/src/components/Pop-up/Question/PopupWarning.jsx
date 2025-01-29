import React from 'react';
import { Button } from '../../Button/Button';
import { WarningIcon } from '../../Button/ButtonImage';
import { useState,useEffect } from 'react';

export const PopupWarning =  ({ text, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
      setIsVisible(true);
  }, []);

  const handleClose = () => {
      setIsVisible(false);
      setTimeout(() =>{
          onClose();
      }, 200);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-lg w-2/5 max-w-xl  transform transition-all duration-300 ease-in-out py-6 px-5 text-center ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center justify-center mb-4  gap-3">
          <WarningIcon /> 
          <h2 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text'>Aviso</h2>
        </div>
        <p className="text-gray-700 mb-6">{text}</p>
        <div className="flex justify-center">
          <Button 
            txt="Entendido" 
            action={handleClose} 
            extraClasses='h-10'
          />
        </div>
      </div>
    </div>
  );
}
