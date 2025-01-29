import React from 'react'
import folders from '../../assets/folders.svg'; 
import { Button } from '../Button/Button';

function CoursesList() {
    const smth = () => {
        
    };
  return (
    <div className="courses-list bg-white shadow-md rounded-lg p-4 flex  items-center gap-4 max-w-5xl mt-8 mx-auto">
      <div className="mb-6  p-12">
            <img className='w-48 h-48 mx-auto' src={folders} alt="svg" />
        </div>
      <div className="rounded-xl p-12 text-center">
        <h3 className="text-xl font-semibold mb-2">
          Actualmente no estás inscrito en ningún curso. ¡Matricúlate y sigue aprendiendo!
        </h3>
        <p className="text-gray-500 mb-6">
          Para comenzar, inscríbase en nuestros cursos en cursos disponibles
        </p>
        <Button txt="Ver cursos disponibles" action={smth}/> 
      </div>
    </div>
  )
}

export default CoursesList