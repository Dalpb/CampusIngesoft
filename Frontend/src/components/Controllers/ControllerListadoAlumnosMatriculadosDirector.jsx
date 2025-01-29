import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { BarOption } from '../Bars/Bar';

export function ControllerListadoAlumnosMatriculadosDirector({periodo,Horario,students,retirados}) {
 return  <div>
          <h1 className="text-3xl font-bold mb-4 md:text-left text-center text-[#060C37]">
          Información general
          </h1>
          <div className="flex flex-col gap-3">
          <Bar className="lg:grid-cols-4 md:grid-cols-2 gap-4">
            <BarOption title="Periodo" result={periodo}></BarOption>
            <BarOption title="Horario" result={Horario.claveHorario}></BarOption>
            <BarOption title="Alumnos matriculados" result={students.length}></BarOption>
            <BarOption title="Alumnos retirados" result={retirados}></BarOption>
          </Bar>
          <hr className="border-3 mt-4 mb-4"/>
          </div>
          <h1 className="text-3xl font-bold mb-4 md:text-left text-center text-[#060C37]">
          Listado de alumnos del horario
          </h1>
        </div>
}