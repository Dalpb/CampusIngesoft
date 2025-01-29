import React from 'react';
import { InfoCard } from '../../components/Header/HeaderInfoAlumno';
import { CourseTable } from '../../components/grilla/grillaCursosAlumno';
import Layout from "../../components/Layout/Layout";

export function ResultadosMatricula() {
  const infoData = [
    { label: 'Ciclo', value: '2024 - 2' },
    { label: 'Alumno', value: '20202020 -', boldValue: 'Joey Flores Ramírez' },
    { label: 'Factor de desempeño', value: '55.89' },
    { label: 'Turno de matrícula', value: '10 de', boldValue: '5000' },
  ];

  const courseData = [
    { clave: 'INF039', nombre: 'Ingeniería de Software', creditos: 4.5, horario: '0882', estado: 'Matriculado', docente: 'Davila, A', sesiones: '2hrs' },
    { clave: 'INF040', nombre: 'Desarrollo de Proyecto', creditos: 3.0, horario: '0991', estado: 'Matriculado', docente: 'Huaman, F', sesiones: '2hrs' },
    { clave: 'INF041', nombre: 'Ingeniería de Requisitos', creditos: 4.5, horario: '0882', estado: 'Matriculado', docente: 'Mendoza, N', sesiones: '3hrs' },
    { clave: 'INF042', nombre: 'Técnicas de Programación 2', creditos: 3.5, horario: '0992', estado: 'Sin Vacante', docente: 'Cueva, R', sesiones: '3hrs' },
    { clave: 'INF038', nombre: 'Arquitectura Empresarial', creditos: 2.5, horario: '0881', estado: 'Matriculado', docente: 'Tupia, F', sesiones: '2hrs' },
    { clave: 'INF044', nombre: 'Gobierno de TI', creditos: 3.5, horario: '0881', estado: 'Matriculado', docente: 'Moquillaza, F', sesiones: '3hrs' },
  ];

  return (
    <Layout title="Resultados de Matrícula" back={true} userName="Joey Flores">
      <div className="space-y-6">
        <InfoCard props={infoData} />
        <CourseTable courses={courseData} />
      </div>
    </Layout>
  );
}
