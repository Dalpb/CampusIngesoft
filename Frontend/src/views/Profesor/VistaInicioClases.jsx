import React, {useState} from 'react'
import Layout from '../../components/Layout/Layout'
import SearchBar from '../../components/Bars/SearchBar'
import CursosGrid from '../../components/grilla/grillaCursosProfe'

// Simulamos la respuesta de la API
const cursosAPI = {
  "2024-1": [
    { clave: "INF25", nombre: "Formulación de proyecto de fin de carrera", horario: "08B1", creditos: 2, aula: "A506", sesiones: "3hrs" },
    { clave: "INF27", nombre: "Ingeniería de software", horario: "08B3", creditos: 3, aula: "A506", sesiones: "3hrs" },
  ],
  "2023-2": [
    { clave: "INF30", nombre: "Bases de datos", horario: "09B1", creditos: 3, aula: "A507", sesiones: "4hrs" },
    { clave: "INF32", nombre: "Sistemas distribuidos", horario: "09B2", creditos: 4, aula: "A508", sesiones: "3hrs" },
  ],
};


export default function VistaInicioClases() {
  const [count, setCount] = useState(0)
  const cursos = [
    { clave: 'INF26', nombre: 'Formulación de proyecto de fin de carrera', horario: '0881', creditos: '2.0', aula: 'A506', sesiones: '3hrs' },
    { clave: 'INF26', nombre: 'Formulación de proyecto de fin de carrera', horario: '0882', creditos: '2.0', aula: 'A506', sesiones: '3hrs' },
    { clave: 'INF27', nombre: 'Ingeniería de software', horario: '0883', creditos: '2.0', aula: 'A506', sesiones: '3hrs' },
    { clave: 'INF27', nombre: 'Ingeniería de software', horario: '0884', creditos: '2.0', aula: 'A506', sesiones: '3hrs' },
    { clave: 'INF27', nombre: 'Ingeniería de software', horario: '0885', creditos: '2.0', aula: 'A506', sesiones: '3hrs' },
  ];

  return (
    <div> 
        <Layout>
          <div className='mt-0 px-4 sm:px-6 lg:px-8'>
            <SearchBar ciclos={cursosAPI} nombre="Detalle de cursos a cargo"/>
          </div>
          <div className='mt-0'>
            <CursosGrid cursos={cursos}></CursosGrid>
          </div>
        </Layout>
    </div>
  )
}
