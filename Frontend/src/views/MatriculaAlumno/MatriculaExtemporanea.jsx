import React, { useState, useEffect } from 'react';
import { getNotesList } from '../../services/coursesServices';

import { useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { useAuth } from "../../context/AuthContext";
import { InfoCard } from '../../components/Header/HeaderInfoAlumno';
import { InfoMatriculaExtemporaneaCard } from '../../components/Header/HeaderInfoMatriculaExtemporanea';
import { Button } from '../../components/Button/Button';
import { MatriculaExtemporaneaTable } from '../../components/grilla/GrillaMatriculaExtemporanea';


export function MatriculaExtemporanea() {
    const infoData = [
        { label: 'Ciclo', value: '2024 - 2' },
        { label: 'Alumno', value: '20202020 -', boldValue: 'Joey Flores Ramírez' },
        { label: 'Factor de desempeño', value: '55.89' },
        { label: 'Turno de matrícula', value: '10 de', boldValue: '5000' },
    ];

    const infoData2 = [
        { label: 'Cursos inscritos', value: '0' },
        { label: 'Creditos inscritos', value: '0' },
        { label: 'Cursos matriculados', value: '0' },
        { label: 'Creditos matriculados', value: '0' },
        { label: 'Creditos totales', value: '0' },
    ];

    const courseData = [
        { clave: 'INF039', nombre: 'Ingeniería de Software', creditos: 4.5, horario: '0882', LineaInscripcion: '-', total: '', docente: 'Davila, A', sesiones: '2hrs' },
        { clave: 'INF040', nombre: 'Desarrollo de Proyecto', creditos: 3.0, horario: '0991', LineaInscripcion: '-', total: '', docente: 'Huaman, F', sesiones: '2hrs' },
        { clave: 'INF041', nombre: 'Ingeniería de Requisitos', creditos: 4.5, horario: '0882', LineaInscripcion: '-', total: '', docente: 'Mendoza, N', sesiones: '3hrs' },
        { clave: 'INF042', nombre: 'Técnicas de Programación 2', creditos: 3.5, horario: '0992', LineaInscripcion: '-', total: '', docente: 'Cueva, R', sesiones: '3hrs' },
        { clave: 'INF038', nombre: 'Arquitectura Empresarial', creditos: 2.5, horario: '0881', LineaInscripcion: '-', total: '', docente: 'Tupia, F', sesiones: '2hrs' },
        { clave: 'INF044', nombre: 'Gobierno de TI', creditos: 3.5, horario: '0881', LineaInscripcion: '-', total: '', docente: 'Moquillaza, F', sesiones: '3hrs' },
    ];

    const eventos = [
        { evento: "Publicación de las cursos y horarios", fecha: "Jueves, 16 agosto de 2024" },
        { evento: "Inicio y cierre de la prematrícula", fecha: "Desde el lunes 5 hasta el jueves 8 de agosto del 2024" },
        { evento: "Publicación de cursos matriculados en prematrícula", fecha: "Viernes, 9 de agosto del 2024" },
        { evento: "Inicio y cierre de la matrícula extemporánea", fecha: "Desde el lunes 12 hasta el martes 13 de agosto del 2024" },
        { evento: "Publicación de cursos matriculados en matrícula extemporánea", fecha: "Jueves, 16 de agosto del 2024" },
    ];

    const { userInformation, getName } = useAuth();

    if (!userInformation) {
        return <div>Cargando datos del usuario...</div>; // until loading 
    }


    return (
        <Layout title="Matrícula Extemporánea" userName={`${userInformation.nombre} ${userInformation.primerApellido} ${userInformation.segundoApellido}`}>
            <div className="space-y-6 max-w-6xl mx-auto px-4">
                
                {/* Datos del Alumno */}
                <h2 className="text-2xl font-semibold mt-2 mb-4">Datos del alumno</h2>
                <InfoCard props={infoData} />

                {/* Mis Datos de Matrícula */}
                <h2 className="text-2xl font-semibold mt-8 mb-4">Mis datos de matrícula</h2>
                <InfoMatriculaExtemporaneaCard props={infoData2} />

                 {/* Mis Cursos Inscritos */}
                <h2 className="text-2xl font-semibold mt-8 mb-4">Mis cursos inscritos</h2>
                <div className='my-4 text-right w-36 flex flex-row-reverse'>
                    <Button txt="Ver más cursos disponibles" />
                </div>

                <MatriculaExtemporaneaTable courses={courseData} />

            </div>
        </Layout>
    );
}

function StatCard({ icon, title, value }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-start text-left">
            <div className="mr-4">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-lg font-semibold">{value}</p>
            </div>
        </div>
    );
}