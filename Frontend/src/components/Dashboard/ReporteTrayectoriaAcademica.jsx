import { useEffect, useState } from "react";
export function ReporteTrayectoriaAcademica({ trayectoryInfo }) {
    const [localTrayectory,setLocalTrayectory] = useState(0);
    useEffect(() => {
        if (trayectoryInfo) {
            setLocalTrayectory(trayectoryInfo)
        }
    }, [trayectoryInfo]);
    
    const formatDecimal = (number) => {
        return number ? number.toFixed(2) : '0.00';
    };

    return (
        <div className="grid grid-cols-5 gap-10 p-6 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto">

            <div className="col-span-2 grid grid-rows-3 gap-4">
                {/* Orden de Mérito */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                        <span className="text-xl">🏅</span>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500">Orden de Mérito</p>
                        <p className="text-lg font-bold">{localTrayectory.turnoOrdenMatricula}</p>
                    </div>
                </div>
                {/* Factor de Desempeño */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                        <span className="text-xl">📈</span>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500">Factor de desempeño</p>
                        <p className="text-lg font-bold">{formatDecimal(localTrayectory.factorDeDesempeno)}</p>
                    </div>
                </div>

                {/* Número de Semestres */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                        <span className="text-xl">⏳</span>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500">Número de semestres</p>
                        <p className="text-lg font-bold">{localTrayectory.numeroSemestres}</p>
                    </div>
                </div>
            </div>
            
            
            {/* Créditos por Año */}
            <div className="p-6 bg-white rounded-lg shadow col-span-3">
                <p className="text-sm text-gray-500 mb-4">Créditos por Año</p>
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <span>📘 1ra.</span>
                        <span className="text-lg font-medium">{formatDecimal(localTrayectory.creditosPrimera)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>📗 2da.</span>
                        <span className="text-lg font-medium">{formatDecimal(localTrayectory.creditosSegunda)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>📙 3ra.</span>
                        <span className="text-lg font-medium">{formatDecimal(localTrayectory.creditosTercera)}</span>
                    </div>
                </div>
            </div>

        </div>
    );
  }
  
