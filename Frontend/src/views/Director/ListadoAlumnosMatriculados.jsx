import { Bar, BarOption } from "../../components/Bars/Bar";
import { GrillaVistaListadoAlumnosXCurso } from "../../components/grilla/GrillaVistaListadoAlumnosXCurso";
import { ButtonSpecial } from "../../components/Button/ButtonSpecial";
import { ModalAgregarAlumno } from "../../components/Pop-up/TablaAlumnos/AddStudent";
import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getPeriodCourses } from '../../services/coursesServices';
import { getStudentsList } from '../../services/coursesServices';
import { putActualizarEstadoRetirado } from "../../services/matricula.service";

export function ControllerLocal({periodo,Horario,students,retirados}) {
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
export function ListadoAlumnosMatriculados() {
  const { idPeriodo } = useParams();
  const location = useLocation();
  const { Curso, Horario } = location.state || {};
  const [periodo, setPeriodo] = useState("");
  const [retirados, setRetirados] = useState(0);
  const [students, setStudents] = useState([]);
  const [localStudents, setLocalStudents] = useState([]);

  console.log("Horario: ", Horario.id || 0);

  const getPeriodos = async () => {
    try {
      const data = await getPeriodCourses();
      const periodoEncontrado = data.find(dataRecorre => dataRecorre.id == idPeriodo);
      setPeriodo(periodoEncontrado.periodo)
    } catch (err) {
      console.error("Error al cargar los periodos:", err);
    }
  }

  const getStudents = async () => {
    try {
      const data = await getStudentsList(Horario.id, idPeriodo);
      setStudents(data)
      const ret = data.filter(student => student.retirado === true).length;
      setRetirados(ret)
    } catch (err) {
      console.error("Error al cargar los estudiantes:", err);
    }
  }
  useEffect(() => {
    getPeriodos()
    getStudents()
  }, [])

  // Maneja el retiro de un alumno
  const handleRetirarAlumno = async (studentId) => {
    try {
      // Llamar al servicio para actualizar en el backend
      await putActualizarEstadoRetirado(studentId, true);

      // Actualizar el estado local después de la confirmación del servidor
      const updatedStudents = students.map((student) =>
        student.id === studentId ? { ...student, retirado: true } : student
      );
      setStudents(updatedStudents);
      setLocalStudents(updatedStudents);
      setRetirados(updatedStudents.filter(student => student.retirado).length);
    } catch (error) {
      console.error("Error al retirar al estudiante:", error);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleAddStudent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleNewStudent = (newStudent) => {
    console.log("Nuevo alumno agregado:", newStudent);
    // Agregar el nuevo alumno a la lista (opcional)
    const newStudentData = {
      id: Date.now(),
      alumno: { codigo: newStudent.codigo, nombre: newStudent.nombre },
      retirado: false,
    };
    setStudents((prevStudents) => [...prevStudents, newStudentData]);
    setLocalStudents((prevStudents) => [...prevStudents, newStudentData]);
    setShowModal(false);
  };

  return (
    // <ControllerLocal></ControllerLocal>
    <div className="p-4 rounded-lg w-full max-w-6xl md:mx-auto md:my-auto mb-14">
      <ControllerLocal periodo={periodo} Horario={Horario} students={students} retirados={retirados}></ControllerLocal>
      
      <div className="flex flex-col sm:flex-row sm:justify-end items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="mb-4">
          <ButtonSpecial
            type="Add"
            action={handleAddStudent}
          />
        </div>
      </div>

      <div className="w-full flex flex-col mb-3">
        <GrillaVistaListadoAlumnosXCurso
          cursoId="static-course-id"
          setStudents={setStudents}
          students={students}
          horarioId="static-schedule-id"
          localStudents={students}
          setLocalStudents={setLocalStudents}
          showRetirarColumn={true}
          onRetirarAlumno={handleRetirarAlumno}
          periodoId={idPeriodo}
        />
      </div>

      {/* Modal para agregar alumno */}
      <ModalAgregarAlumno
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleNewStudent}
        horarioId={Horario.id}
      />
    </div>
  );
}
