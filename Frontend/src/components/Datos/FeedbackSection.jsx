// FeedbackSection.jsx

import React from 'react';

export function FeedbackSection({indice, calificacion, feedback }) {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
                Calificación N° {indice} : <span className="text-gray-600">{calificacion}</span>
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Retroalimentación: </h3>
            <p className="text-gray-600">{feedback}</p>
        </div>
    );
}
