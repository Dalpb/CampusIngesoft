import React from 'react';
import { InfoCard } from '../../components/Header/HeaderInfoAlumno';
import { MatriculaTable } from '../../components/grilla/grillaMatriculaCursos';
import { InfoMatriculaCard } from '../../components/Header/HeaderInfoMatricula';
import Layout from "../../components/Layout/Layout";
import CoursesList from '../../components/Others/AvisoNoInscripcion';
import { Button } from '../../components/Button/Button';


export function ResumenPreMatricula() {
  const infoData = [
    { label: 'Ciclo', value: '2024 - 2' },
    { label: 'Alumno', value: '20202020 -', boldValue: 'Joey Flores Ramírez' },
    { label: 'Factor de desempeño', value: '55.89' },
    { label: 'Turno de matrícula', value: '10 de', boldValue: '5000' },
  ];

  const infoData2 = [
    { label: 'Cursos inscritos', value: '0' },
    { label: 'Creditos inscritos', value: '0'},
    { label: 'Cursos matriculados', value: '0' },
    { label: 'Creditos matriculados', value: '0'},
    { label: 'Creditos totales', value: '0'},
  ];

  const courseData = [
    { clave: 'INF039', nombre: 'Ingeniería de Software', creditos: 4.5, horario: '0882', LineaInscripcion : '20', total: '40', docente: 'Davila, A', sesiones: '2hrs' },
    { clave: 'INF040', nombre: 'Desarrollo de Proyecto', creditos: 3.0, horario: '0991', LineaInscripcion : '21', total: '40', docente: 'Huaman, F', sesiones: '2hrs' },
    { clave: 'INF041', nombre: 'Ingeniería de Requisitos', creditos: 4.5, horario: '0882', LineaInscripcion : '30', total: '40', docente: 'Mendoza, N', sesiones: '3hrs' },
    { clave: 'INF042', nombre: 'Técnicas de Programación 2', creditos: 3.5, horario: '0992', LineaInscripcion : '41', total: '40', docente: 'Cueva, R', sesiones: '3hrs' },
    { clave: 'INF038', nombre: 'Arquitectura Empresarial', creditos: 2.5, horario: '0881', LineaInscripcion : '4', total: '40', docente: 'Tupia, F', sesiones: '2hrs' },
    { clave: 'INF044', nombre: 'Gobierno de TI', creditos: 3.5, horario: '0881', LineaInscripcion : '12', total: '40', docente: 'Moquillaza, F', sesiones: '3hrs' },
  ];

  const smth = () => {
        
  };

  return (
    <Layout title="Resultados de Matrícula" back={true} userName="Joey Flores">
      <div className="space-y-6">
        <InfoCard props={infoData} />
        <InfoMatriculaCard props={infoData2} />
        {/*En caso no haya respuesta del GET, se carga CoursesList*/}
        <CoursesList/>
        {/*En caso se obtenga una respuesta del GET, se carga lo siguiente*/}
        <div className=' max-w-6xl mx-auto'>
          <div className='my-4 text-right'>
            <Button txt="Ver cursos disponibles" action={smth}/> 
          </div>
          <MatriculaTable courses={courseData} />
        </div>
        

      </div>
    </Layout>
  );
}
