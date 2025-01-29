import { 
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody
} from '../../components/Table/Table';
import { 
  useLocation,
  useNavigate
} from 'react-router-dom';

import { ButtonSpecial } from '../../components/Button/ButtonSpecial';
import { TableIndexPaginacion } from '../../components/Table/TableIndex'; // Importamos TableIndex2
import { useTableFilter } from '../../hooks/useTableFilter';
import { useMatricula } from '../../context/MatriculaContext';
import { Bar, BarOption } from '../../components/Bars/Bar';
import { LoadingLayout } from '../../components/Layout/Layout';
import { InputText,SelectInput ,SelectInput2 } from '../../components/Inputs/InputText';
import { useEffect, useState } from 'react';
import PopupSuccess from '../../components/Pop-up/Response/Success';
import { PopupConfirm } from '../../components/Pop-up/Question/PopupConfirm';
import { PopupWarning } from '../../components/Pop-up/Question/PopupWarning';
import { ControllerCursosNuevo } from '../../components/Controllers/ControllerCursosNuevo';
import { useAuth } from '../../context/AuthContext';
import { AnimatedContainer } from '../../components/Layout/AnimatedContainer';
import { getTotalAlumnos } from '../../services/userServices';

export function SeleccionCursos() {
  const { userInformation,obtenerEstado,EstadosMatricula } = useAuth();
  const estado  = obtenerEstado();
  const esExtemporanea = estado === EstadosMatricula.MATRICULAEXT;
  const location = useLocation();
  const navigate = useNavigate();

  const { periodo,creidtosIncritos } = location.state || {};
  const contextoMatricula = useMatricula();
  if(!contextoMatricula)return null;
  const { matriculaData, loadingData, trayectoria, userInfo, matriculaFunctions } = contextoMatricula;
  const { obtenerCursosMatricula, actualizarHorariosSeleccionados,inscribirCursos, obtenerCursosMatriculaTodos } = matriculaFunctions;
  const { cursosMatricula, horarioSelect,cursosPermitidos,cursosMatriculaTodos} = matriculaData;
  console.log("creidtosIncritos")
  console.log()

  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas (lo inicializamos a 1)
  const [selectedCourses, setSelectedCourses] = useState([]); // Cursos seleccionados
  const [horarioSelections, setHorarioSelections] = useState({}); // Estado persistente de horarios seleccionados

  const [horariosParaConfirmar, setHorariosParaConfirmar] = useState([]); // Para almacenar horarios seleccionados al confirmar
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isWarningPopupOpen, setIsWarningPopupOpen] = useState(false);
  const [warningText, setWarningText] = useState('');

  const [totalAlumnos, setTotalAlumnos] = useState(null); 

  const [tempClave, setTempClave] = useState('');
  const [tempNombre, setTempNombre] = useState('');
  const [tempNivel, setTempNivel] = useState('');

  useEffect(() => {
    const fetchTotalAlumnos = async () => {
      try {
        const total = await getTotalAlumnos();
        setTotalAlumnos(total); // Guarda el total de alumnos
      } catch (error) {
        console.error('Error al obtener el total de alumnos:', error);
      }
    };
    fetchTotalAlumnos();
  }, []);

  // Efecto para cargar cursos según la página actual
  useEffect(() => {
    const cargarCursos = async () => {
      const data = await obtenerCursosMatricula({page: currentPage,clave:tempClave,nombre:tempNombre,nivel:tempNivel}); // Carga datos de la página actual
      setTotalPages(Math.ceil(data.count / 20)); // Actualizamos el total de páginas (20 items por página)
    };
    cargarCursos();
  }, [currentPage]);

  //filtros
  const handleFilter = async(filters) => {
    const data = await obtenerCursosMatricula({ page: 1, ...filters });
    console.log("data de la busqueda", data);
    const cantidad = Math.ceil(data.count / 20);
    console.log("Paginas de la busqueda", cantidad);
    setTotalPages(cantidad);
    setCurrentPage(1); // Reiniciar a la primera página al aplicar filtros
  };

  // Manejar el checkbox (selección de curso y horario)
  const handleCheckboxChange = (cursoId, horarioId) => {
    const curso = cursosMatricula.results.find((c) => c.id === cursoId);
    if (!curso) {
      console.error(`Intentaste seleccionar un curso no cargado: ${cursoId}`);
      return;
    }
    setSelectedCourses((prevSelected) => {
      const selection = `${cursoId}-${horarioId}`; // Combina curso y horario en una clave única
      if (prevSelected.includes(selection)) {
        return prevSelected.filter((id) => id !== selection); // Deseleccionar
      } else {
        return [...prevSelected, selection]; // Seleccionar
      }
    });
  };  

  // Manejar selección de horario
  const handleHorarioChange = (index, cursoId, horarioId) => {
    // Actualizar el estado local horarioSelections
    setHorarioSelections((prevSelections) => ({
      ...prevSelections,
      [cursoId]: horarioId, // Guardar el horario seleccionado para el curso
    }));
  
    // Actualizar el estado global horarioSelect en el contexto
    actualizarHorariosSeleccionados(index, horarioId);
  };  

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex); // Actualizar página actual
  };



  useEffect(() => {
    const cargarTodosLosCursos = async () => {
      if (!cursosMatriculaTodos || cursosMatriculaTodos.length === 0) {
        console.log("Cargando todos los cursos...");
        await obtenerCursosMatriculaTodos({});
      }
    };
    cargarTodosLosCursos();
  }, []);

  const handleSave = () => {
    // Verificar si hay horarios seleccionados
    if (selectedCourses.length === 0) {
      setWarningText('Debes seleccionar al menos un curso.');
      setIsWarningPopupOpen(true);
      return;
    }
    console.log("selectedcourses: ",selectedCourses);
    console.log("horarioSelectios: ",horarioSelections);

    // Crear `horariosConDetalles` desde `selectedCourses` y `cursosMatricula`
    const horariosConDetalles = selectedCourses.map((selection) => {
      const [cursoId, horarioId] = selection.split('-').map(Number);
      console.log("horarioseleccionado: ",horarioId);
      console.log("cursoseleccionado: ",cursoId);
      console.log("Estructura de cursosMatricula.results:", cursosMatricula.results);
      // const curso = cursosMatricula.results.find((c) => c.id === cursoId);
      //const curso = cursosMatricula.results.find((c) => {
      const curso = cursosMatriculaTodos.find((c) => {
        console.log("Comparando curso.id:", c.id, "con cursoId:", cursoId);
        return Number(c.id) === cursoId; // Conversión explícita para evitar problemas
      });
      if (!curso) {
        console.error(`No se encontró el curso con ID ${cursoId}`);
        return null; // Salida segura
      }
      //const horario = curso.horarios.find((h) => h.id === horarioId);
      const horario = curso.horarios.find((h) => {
        console.log("Comparando horario.id:", h.id, "con horarioId:", horarioId);
        return Number(h.id) === horarioId; // Conversión explícita para evitar problemas
      });
      if (!horario) {
        console.error(`No se encontró el horario con ID ${horarioId} en el curso ${cursoId}`);
        return null; // Salida segura
      }
      console.log("se registrara horario",horario.id);
      console.log("se registrara creditos",curso.creditos);
      console.log("se registrara curso",curso.clave);
      return {
        idHorario: horario.id,
        creditos: curso.creditos,
        cursoClave: curso.clave,
      };
    });

    // Guardar datos para usar después en la confirmación
    setHorariosParaConfirmar(horariosConDetalles);
    console.log("guardar seleccion");
    console.log("Horarios con detalles:", horariosConDetalles);
    // Mostrar el popup de confirmación
    setIsPopupOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      // Llamar al contexto para inscribir los cursos
      await inscribirCursos(userInfo.userInformation.id, horariosParaConfirmar,creidtosIncritos);

      // Mostrar popup de éxito
      setIsSuccessPopupOpen(true);
    } catch (error) {
      setWarningText(error.message || 'Hubo un error al guardar los horarios.');
      setIsWarningPopupOpen(true);
    } finally {
      // Cerrar popup de confirmación
      setIsPopupOpen(false);
    }
  };

  const handleCancelSave = () => {
    setIsPopupOpen(false);
  };

  const handleContinue = () => {
    console.log("handleContinue de Seleccion");
    setIsSuccessPopupOpen(false);
    console.log("redirigir a inscripcoin");
    navigate("/alumno/matricula/inscripcion",{
      state: {
        ...location.state,
      },
      
    });
  };

  if (!userInfo.userInformation || !trayectoria || loadingData.cursosHorarios) 
    return <LoadingLayout msg="Cargando horarios de matrícula" />;

  return (
    <AnimatedContainer>
    <div className="p-4 rounded-lg w-full max-w-6xl mx-auto">
      {/* Datos del alumno */}
      <div className="flex flex-col gap-3">
        <Bar className="gap-4 lg:grid-cols-4 md:grid-cols-2 ">
          <h1 className="text-3xl font-bold md:text-left text-center text-[#060C37] lg:col-span-4 md:col-span-2">
            Datos del alumno
          </h1>
          <BarOption title="Ciclo de matrícula" result={periodo} />
          <BarOption title="Alumno" result={userInfo.getName() + ` (${userInfo.userInformation.codigo})`} />
          <BarOption title="Factor de desempeño" result={trayectoria.factorDeDesempeno} />
          <BarOption title="Turno de matrícula" result={`${trayectoria.turnoOrdenMatricula} de ${totalAlumnos}`} />
        </Bar>
        <hr className="border-3" />
        <ControllerCursosNuevo onFilter={handleFilter} setTempClave={setTempClave} setTempNivel={setTempNivel} setTempNombre={setTempNombre} tempClave={tempClave} tempNivel={tempNivel} tempNombre={tempNombre}/>
        <hr className="border-3" />
        <h1 className="text-3xl font-bold mb-4 md:text-left text-center text-[#060C37]">Cursos</h1>
      </div>
      
      {/* Tabla de cursos */}
      <Bar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell type="head">Clave</TableCell>
                <TableCell type="head">Nombre del curso</TableCell>
                <TableCell type="head">Créditos</TableCell>
                <TableCell type="head">Horarios</TableCell>
                <TableCell type="head">Vacantes</TableCell>
                {esExtemporanea && <TableCell type="head">Matriculados</TableCell>} {/* Condicional para la nueva columna en extemporanea*/}
                <TableCell type="head">Sesiones</TableCell>
                <TableCell type="head">Seleccionar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cursosMatricula?.results.length > 0 &&
                cursosMatricula?.results.map((curso, index) => (
                  <TableRow type="body" key={curso.id}>
                    <TableCell className="text-center">{curso.clave}</TableCell>
                    <TableCell>{curso.nombre}</TableCell>
                    <TableCell className="text-center">{curso.creditos}</TableCell>
                    <TableCell>
                      <SelectInput2
                        value={horarioSelections[curso.id] || ''} // Sincroniza el valor del dropdown con horarioSelections
                        onchange={(e) => handleHorarioChange(index, curso.id, e.target.value)} // Incluye el índice y cursoId
                        disabled={selectedCourses.includes(`${curso.id}-${horarioSelections[curso.id]}`)} // Bloquear si está seleccionado
                      >
                        {/* Opción predeterminada */}
                        <option value="" disabled>
                          Seleccione opción
                        </option>

                        {/* Mostrar todas las opciones disponibles */}
                        {curso.horarios.map((horario) => (
                          <option key={horario.id} value={horario.id}>
                            {horario.claveHorario} - {horario.profesor.nombre} {horario.profesor.primerApellido}
                          </option>
                        ))}
                      </SelectInput2>
                    </TableCell>
                    {/* <TableCell className="text-center">{horarioSelect[index]?.numVacantes}</TableCell> */}
                    <TableCell className="text-center">
                      {curso.horarios.find((horario) => horario.id === parseInt(horarioSelections[curso.id]))?.numVacantes || '-'}
                    </TableCell>
                    {/* Nueva columna: Matriculados */}
                    {esExtemporanea && (
                      <TableCell className="text-center"> 
                        {curso.horarios.find((horario) => horario.id === parseInt(horarioSelections[curso.id]))?.numInscritos ?? '-'}
                      </TableCell>
                    )}
                    <TableCell className="text-center">{curso.numHoras + 'h'}</TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        disabled={!horarioSelections[curso.id]}
                        checked={selectedCourses.includes(`${curso.id}-${horarioSelections[curso.id]}`)}
                        onChange={() => handleCheckboxChange(curso.id, horarioSelections[curso.id])}
                        className="h-5 w-5 text-indigo-600"
                      />
                  </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Paginación */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex-1"></div>
          {/* Barra de Paginación centrada */}
          <div className="flex justify-center flex-1">
            <TableIndexPaginacion
              count={totalPages} // Número total de páginas
              current={currentPage} // Página actual
              actionSelection={handlePageChange} // Cambiar la página
            />
          </div>
          {/* Botón Guardar alineado a la derecha */}
          <div className="flex justify-end flex-1">
            <ButtonSpecial type="Save" className="w-full md:w-auto px-4 py-2 text-center" action={handleSave}/>
          </div>
        </div>
      </Bar>
      {/* Popups */}
      {isPopupOpen && (
        console.log("Renderizando PopupConfirm") || (
          <PopupConfirm
            isOpen={isPopupOpen}
            text="¿Estás seguro que deseas guardar los horarios seleccionados?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )
      )}
      {isWarningPopupOpen && <PopupWarning text={warningText} onClose={() => setIsWarningPopupOpen(false)} />}
      {isSuccessPopupOpen && (
        <PopupSuccess
          text="Horarios guardados correctamente."
          onContinue={handleContinue}
        />
      )}
      
    </div>
    </AnimatedContainer>
  );
}
