import React, { useState } from 'react';
import { InputArchSubcompetencias } from './InputArchSubcompetencias';


export function InputSubcompetencias() {
    const [subcompetencia, setSubcompetencia] = useState('');
    const [subcompetencias, setSubcompetencias] = useState([]);

    const handleAddSubcompetencia = () => {
        if (subcompetencia.trim() === '') return;

        setSubcompetencias([...subcompetencias, subcompetencia.trim()]);
        setSubcompetencia(''); // Limpia el campo de entrada
    };

    const handleRemoveSubcompetencia = (index) => {
        const nuevasSubcompetencias = subcompetencias.filter((_, i) => i !== index);
        setSubcompetencias(nuevasSubcompetencias);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">Subcompetencias</h2>
            <InputArchSubcompetencias></InputArchSubcompetencias>
        </div>
    );
}
