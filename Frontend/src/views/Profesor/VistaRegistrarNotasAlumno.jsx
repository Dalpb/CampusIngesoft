import Layout, { LoadingLayout, TitleLayout } from '../../components/Layout/Layout';
import { useState} from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation} from 'react-router-dom';
import {GrillaEvalNotas} from '../../components/grilla/grillaEvalNotas'
import { ControllerVistaRegistrarNotasAlumno } from '../../components/Controllers/ControllerVistaRegistrarNotasAlumno';
import {getStudentsNotesXCourseList } from '../../services/coursesServices';
import { useEffect } from 'react';
import { ButtonSpecial } from '../../components/Button/ButtonSpecial';
import { useScheduleTeacher } from '../../context/ScheduleTeacherContext';
import { AnimatedContainer } from '../../components/Layout/AnimatedContainer';

export const VistaRegistrarNotasAlumno = () => {
    const { getName } = useAuth();
    const location = useLocation();
    const {cursoId, cursoNombre, horarioNumero,periodo,horarioId,tipoNota,indice,periodoId } = location.state || {};
    const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga inicial
    const [listNotes, setListNotes] = useState([]); // Estado para guardar la respuesta de la API
    const [isSaved,setIsSaved]=useState(null)
    const getNotesListCourse = async () => {
        try {
            setIsLoading(true);
            console.log(tipoNota,indice,horarioId,periodoId)
            const listNotes = await getStudentsNotesXCourseList(tipoNota, indice, horarioId,periodoId);
            console.log("LISTANOTAS")
            console.log(listNotes)
            // Añadir propiedad `isLocked` a cada nota si ya tiene un valor
            const updatedListNotes = listNotes.map(note => ({
                ...note,
                notas: note.notas.map(nota => ({
                    ...nota,
                    isLocked: nota.valor !== -1 // Marcar la nota como bloqueada si ya existe un valor
                }))
            }));
            setListNotes(updatedListNotes);
            // Verificar si al menos una nota está bloqueada
            const atLeastOneLocked = updatedListNotes.some(note => 
                note.notas.some(nota => nota.isLocked)
            );
            setIsSaved(atLeastOneLocked); // Si al menos una nota está bloqueada, establece `isSaved` en `true`
            setIsLoading(false);
            console.log("updatedListNotes")
            console.log(updatedListNotes)
        } catch (error) {
            console.error("Error en obtener los periodos");
        }
    };
    
    
    useEffect(() => {
        if (tipoNota) {
            console.log("Notas cargados por primera vez")
            getNotesListCourse(tipoNota);
        }
    }, [tipoNota]);
    if (isLoading) {
        return (
            <div>
                <div className="mb-80">
                </div>
                <div >
                    <LoadingLayout msg="Espera hasta que carguen los alumnos" />
                </div>
            </div>
        );
    }
    return (
        <AnimatedContainer>
        <div className='md:px-16 px-2 py-4 flex flex-col gap-6'>
            <TitleLayout 
                title={`${cursoNombre}`}
                schedule={horarioNumero}
                cicle={periodo}
            />
            <ControllerVistaRegistrarNotasAlumno tipoNota={tipoNota} indice={indice} setListNotes={setListNotes} isSaved= {isSaved} listNotes={listNotes} periodo={periodo}/>
            <GrillaEvalNotas cursoId={cursoId} setListNotes={setListNotes} listNotes={listNotes} isSaved={isSaved} setIsSaved={setIsSaved} />
        </div>
        </AnimatedContainer>
    );
};
