import { useEffect, useState } from "react"
import { Bar } from "../Bars/Bar"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableContainer
} 

from "./Table"
import { Link,useLocation } from "react-router-dom";
import { SelectInput } from "../Inputs/InputText";
import { PenIcon, PlusIcon } from "./TableIcons";
import { useParams } from 'react-router-dom';

export const  HorariosTableDirector = ({cursos, user}) =>{
    const location  = useLocation();
    const [horariosSelecc,setHorariosSelecc] =  useState([]);
    console.log(cursos)
    console.log("Estado de matricula: ", user.estado);

    // Actualizar los horarios seleccionados
    const changeHorario = (e, indexCurso) => {
        const horarioClave = e.target.value;
        const cursoHorarios = cursos[indexCurso].horarios;
        const horarioSeleccionado = cursoHorarios.find(horario => horario.claveHorario === horarioClave);

        if (!horarioSeleccionado) return;

        const newHorariosSelecc = [...horariosSelecc];
        newHorariosSelecc[indexCurso] = horarioSeleccionado;
        setHorariosSelecc(newHorariosSelecc);
    }
    
    useEffect(() => {
        // Inicializar los horarios seleccionados con el primer horario de cada curso
        const initialHorariosSelecc = cursos.map(curso => curso.horarios[0] || null);
        setHorariosSelecc(initialHorariosSelecc);
    }, [cursos]);

    const { idPeriodo } = useParams();

    return(
        <Bar>
            <TableContainer>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell type="head">Código del curso</TableCell>
                    <TableCell type="head">Nombre del curso</TableCell>
                    <TableCell type="head">Créditos</TableCell>
                    <TableCell type="head">Vacantes</TableCell>
                    {(user?.estado === "Matricula" || user?.estado === "Matricula Extemporanea") && (
                                <TableCell type="head">Inscritos</TableCell>
                    )}
                    {(user?.estado === "Publicacion Matricula" || user?.estado === "Matricula Extemporanea" || user?.estado === "Publicación Mat. Ext" || user?.estado === "Ciclo Lectivo") && (
                                <TableCell type="head">Inscritos</TableCell>
                    )}
                    <TableCell type="head">Horario</TableCell>
                    <TableCell type="head">Acción</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cursos.map((curso, indexCurso) => {
                    const horarioSeleccionado = horariosSelecc[indexCurso];
                    return (
                        <TableRow type="body" key={curso.id}>
                        <TableCell>{curso.clave}</TableCell>
                        <TableCell>{curso.nombre}</TableCell>
                        <TableCell>{curso.creditos}</TableCell>
                        <TableCell>
                            {horarioSeleccionado ? horarioSeleccionado.numVacantes : 0}
                        </TableCell>
                        {(user?.estado === "Matricula" || user?.estado === "Matricula Extemporanea") && (
                                        <TableCell>
                                            {horarioSeleccionado ? horarioSeleccionado.numInscritos : 0}
                                        </TableCell>
                        )}
                    {(user?.estado === "Publicacion Matricula" || user?.estado === "Matricula Extemporanea" || user?.estado === "Publicación Mat. Ext" || user?.estado === "Ciclo Lectivo") && (
                                        <TableCell>
                                            {horarioSeleccionado ? horarioSeleccionado.numInscritos : 0}
                                        </TableCell>
                        )}
                        <TableCell>
                            <SelectInput
                            value={horarioSeleccionado ? horarioSeleccionado.claveHorario : ""}
                            onchange={(e) => changeHorario(e, indexCurso)}
                            className="border-r-0 border-t-0 border-l-0 w-48" // Añade una clase de ancho reducido
                            name={`horario-${curso.id}`}
                            >
                            {curso.horarios.map((horario) => (
                                <option key={horario.claveHorario} value={horario.claveHorario}>
                                {horario.claveHorario} - {horario.profesor.nombre} {horario.profesor.primerApellido}
                                    </option>
                            ))}
                            </SelectInput>
                        </TableCell>
                        <TableCell>
                            {user.estado === 'Ciclo Lectivo' ? (
                                <Link
                                    className="transform transition-transform duration-100 active:scale-95 hover:scale-105 flex justify-center"
                                    //to="/director/Alumnos"
                                    to={`/director/${idPeriodo || ""}/Alumnos`}
                                    state={{
                                        ...location.state,
                                        Horario: horarioSeleccionado,
                                    }}
                                >
                                    <PenIcon />
                                </Link>
                            ) : (
                                <button 
                                    className="opacity-50 cursor-not-allowed flex justify-center"
                                    disabled
                                >
                                    <PenIcon />
                                </button>
                            )}
                        </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
        </Bar>
    )
}