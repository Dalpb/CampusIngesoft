import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { DatosAlumnoRetiro } from "../../components/Datos/DatosAlumnoRetiro"
import { GrillaRetiroCursos } from "../../components/grilla/GrillaRetiroCursos";
import { Button } from "../../components/Button/Button";
import { coursesByStudent, periodByStudent } from "../../services/studentServices";
import PopupSuccess from '../../components/Pop-up/Response/Success';
import {PopupConfirm} from "../../components/Pop-up/Question/PopupConfirm";
import { PopupWarning } from "../../components/Pop-up/Question/PopupWarning"; 
import { enviarSolicitudRetiro } from "../../services/studentServices";
import { LoadingLayout } from "../../components/Layout/Layout";
import { AnimatedContainer } from "../../components/Layout/AnimatedContainer";

export function RetiroCursos() {
    const [periodData, setPeriodData] = useState(null);
    const [courses, setCourses] = useState([]);
    const [motivo, setMotivo] = useState("");
    const [selectedCourses, setSelectedCourses] = useState({});
    const { userInformation } = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [isWarningPopupOpen, setIsWarningPopupOpen] = useState(false);
    const [warningText, setWarningText] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Nuevo estado para el cargando
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchPeriodAndCourses = async () => {
        try {
          if (userInformation?.id) {
            // Obtener todos los períodos y ordenarlos
            const periods = await periodByStudent(userInformation.id);
            const sortedPeriods = periods.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));
            const lastPeriod = sortedPeriods[0];
            setPeriodData(lastPeriod);
  
            // Obtener los cursos del último período activo
            const enrolledCourses = await coursesByStudent(userInformation.id, lastPeriod.id);
  
            console.log("Cursos: ", enrolledCourses);
            
            // Mapear los cursos para incluir el estado de deshabilitado si ya tienen una solicitud enviada
            const updatedCourses = enrolledCourses.map((course) => ({
              ...course,
              isDisabled: course.estadoSolicitud && !course.estadoRetiro, // Marcar como deshabilitado si la solicitud está pendiente
            }));
  
            // Configurar cursos y seleccionados
            setCourses(updatedCourses);
            const initialSelectedCourses = updatedCourses.reduce((acc, course) => {
              if (course.isDisabled) {
                acc[course.idAlumnoxHorario] = true; // Marcar como seleccionado si está deshabilitado
              }
              return acc;
            }, {});
            setSelectedCourses(initialSelectedCourses);
          }
        } catch (error) {
          console.error("Error al obtener los datos del alumno y el período:", error);
        } finally {
          setIsLoading(false); // Termina la carga
        }
      };
  
      fetchPeriodAndCourses();
    }, [userInformation]);
  
    const handleCheckboxChange = (idAlumnoxHorario) => {
      setSelectedCourses((prevSelected) => ({
        ...prevSelected,
        [idAlumnoxHorario]: !prevSelected[idAlumnoxHorario],
      }));
    };
  
    const handleSubmit = () => {
      const selectedCourseKeys = Object.keys(selectedCourses).filter((id) => selectedCourses[id]);
  
      if (!motivo.trim()) {
        setWarningText("Por favor, ingresa un motivo para el retiro.");
        setIsWarningPopupOpen(true);
        return;
      }
  
      if (selectedCourseKeys.length === 0) {
        setWarningText("Es necesario seleccionar al menos un curso.");
        setIsWarningPopupOpen(true);
        return;
      }
  
      setIsPopupOpen(true);
    };
  
    const handleConfirmSubmit = async () => {
      const selectedCourseKeys = Object.keys(selectedCourses).filter((id) => selectedCourses[id]);
      const listaCursos = selectedCourseKeys.map((id) => ({
        idAlumnoxHorario: parseInt(id),
        estadoSolicitud: true,
        estadoRetiro: false,
      }));
  
      try {
        const response = await enviarSolicitudRetiro(motivo, listaCursos);
        setIsSuccessPopupOpen(true);
      } catch (error) {
        alert("Hubo un error al enviar la solicitud.");
      } finally {
        setIsPopupOpen(false);
      }
    };
  
    const handleCancelSubmit = () => {
      setIsPopupOpen(false);
    };
  
    const handleCloseWarning = () => {
      setIsWarningPopupOpen(false);
    };
  
    const handleContinue = () => {
      setIsSuccessPopupOpen(false);
      navigate("/alumno/VisualizarSolicitudesRetiro");
    };
  
    if (!userInformation) {
      return <div>Cargando datos del usuario...</div>;
    }

    // if (isLoading) {
    //   return (
    //     <div className="mt-80">
    //       <LoadingLayout />
    //     </div>
    //   );
    // }
  
    return (
      <AnimatedContainer>
        <div className="max-w-6xl mt-4 mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="max-w-4xl mx-auto px-4">
            <DatosAlumnoRetiro studentData={{ ...userInformation, periodo: periodData?.periodo }} />
  
            <div className="mb-6">
              <label className="block text-gray-700">Motivo</label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Por ejemplo: Tengo problemas académicos que me impiden continuar con el curso."
                className="w-full border border-gray-300 rounded-md p-2 focus:border-indigo-500 italic"
                rows="3"
              />
            </div>
  
            <GrillaRetiroCursos
              courses={courses}
              selectedCourses={selectedCourses}
              handleCheckboxChange={handleCheckboxChange}
            />
  
            <div className="mt-4 flex justify-end">
              <Button txt="Solicitar" action={handleSubmit} />
            </div>
          </div>
        </div>
  
        {isPopupOpen && (
          <PopupConfirm
          isOpen={isPopupOpen}
            text="¿Estás seguro que deseas enviar la solicitud?"
            onConfirm={handleConfirmSubmit}
            onCancel={handleCancelSubmit}
          />
        )}
  
        {isWarningPopupOpen && <PopupWarning text={warningText} onClose={handleCloseWarning} />}
  
        {isSuccessPopupOpen && (
          <PopupSuccess
            text="Solicitud de retiro enviada correctamente."
            onContinue={handleContinue}
          />
        )}
      </AnimatedContainer>
    );
  }