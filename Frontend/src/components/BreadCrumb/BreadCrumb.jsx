import { Link, useLocation } from "react-router-dom";
export const BreadCrumbProfesor = () => {
    const location = useLocation(); //actual path

    // profesor/horarios -> home
    // horarios/:idhorario    -> home > Detalle horario >
    //horarios/:idhorario/notas/:evalId -> home > Detalle de horario > Notas
    //horarios/:idhorario/competencias -> home > Detalle de horario > competencias
    let currentLink = '';
    const pathTransform = location.pathname.replace("/profesor/horarios","");
     
    const pathnames = pathTransform.split('/').filter(crumbs => crumbs !== "");
    return(
        <nav className="text-white p-2  h-full flex items-center ">
            <ul className="flex items-center">
                <li className="hover:text-white/80 lg:text-xl md:text-base text-sm transition-colors flex items-center">
                    <Link to="/profesor/horarios" state={{...location.state}}>Home</Link>
                </li>
                {
                    pathnames.map((pathname,index) =>{
                      const goTo = `/profesor/horarios/${pathnames.slice(0,index+1).join('/')}`;
                      let showName; 
                      switch(pathname){
                        case 'notas':
                            return null; 
                        case 'competencias':
                            showName = "Competencias";
                            break;
                        case 'reportes':
                            showName = "Reportes";
                            break;
                        case 'reporte':
                            showName = "Reporte notas del curso";
                            break;
                        case 'subcompetencias':
                            showName = `Subcompetencias de ${pathnames[index-1]} `;
                        default:
                            if(!index)showName = "Detalles del horario";
                            //en repo estaba if (index == 0) showName = ...
                            else if(pathnames[index-1] === "notas"){
                                showName = `Notas - Evaluación ${pathname}`
                            }
                            else if(pathnames[index-1] === "competencias" ){
                                return null;
                            }
                            else if(pathnames[index + 1] === "reporte")return null;
                      }
                      
                      return(
                        <li key={goTo} className="flex items-center lg:text-xl md:text-base text-sm">
                            <div className="h-full w-4 mx-2 text-white/50 ">{">"}</div>
                            {
                                index === pathnames.length -1 ? <span className="text-white/70 ">{showName}</span> : <Link to={goTo} className="hover:text-white/80  transition-colors flex items-center"
                                state={{...location.state}}>{showName}</Link>
                            }
                        </li>
                      )
                    })
                }
            </ul>
        </nav>
    )
}

export const BreadCrumbAlumno = () => {
    const location = useLocation(); // Ruta actual

    // Mapeo de rutas a nombres amigables (corregido)
    const routeMapping = {
        "TrayectoriaAcademica": "Trayectoria",
        "GenerarSolicitudRetiro": "Generar Solicitud de Retiro",
        "VisualizarSolicitudesRetiro": "Visualizar Solicitudes de Retiro",
        "cursos": "Mis Cursos", // Agrega un mapeo para 'cursos'
        "detalleNotas": "Detalle Notas",
        "detalleCompetencias": "Detalle Competencias",
        "detalle-calificacion": "Detalle Calificación" ,
        "matricula": "Matricula",
        "seleccion-cursos":"Seleccionar Cursos",
        "inscripcion": "Inscripción",
        "resultados": "Resultados de matrícula"
    };

    // Extraer segmentos de la ruta
    const pathnames = location.pathname.split("/").filter((crumb) => crumb !== "");

    return (
        <nav className="text-white p-2 h-full flex items-center">
            <ul className="flex items-center">
                <li className="hover:text-white/80 lg:text-xl md:text-base text-sm transition-colors flex items-center">
                    {/* Enlace inicial: Home */}
                    <Link to="/alumno/cursos" className="hover:text-white/80" state={{...location.state}}>
                        Home
                    </Link>
                </li>
                {/* El breadcrumb se muestra solo si hay más de 1 segmento en la ruta */}
                {pathnames.slice(1).map((pathname, index) => {
                    // Generar el camino acumulado hasta este punto
                    const routeTo = `/${pathnames.slice(0, index + 2).join("/")}`; // Incluye el segmento "alumno"
                    const routeName = routeMapping[pathname] || pathname; // Usar el nombre mapeado o el nombre de la ruta
                    if(!routeMapping[pathname])return null;
                    return (
                        <li key={routeTo} className="flex items-center lg:text-xl md:text-base text-sm">
                            <div className="h-full w-4 mx-2 text-white/50 ">{">"}</div>
                            {index === pathnames.length - 2 ? ( // Verifica si es el último elemento
                                // Elemento final no es un enlace
                                <span className="text-white/70 ">{routeName}</span>
                            ) : (
                                // Enlaces intermedios
                                <Link
                                    to={routeTo}
                                    className="hover:text-white/80  transition-colors"
                                    state={{...location.state}}>
                                    {routeName}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export const BreadCrumbGestor =() =>{
    const location = useLocation(); // Ruta actual

    // Mapeo de rutas a nombres amigables (corregido)
    const routeMapping = {
        "cursos": "Mis Cursos", // Agrega un mapeo para 'cursos'
        "principal":"Principal",
        "horarios":"Administración de horarios",
        "edicion":"Editar curso"
    };

    // Extraer segmentos de la ruta
    const pathnames = location.pathname.split("/").filter((crumb) => crumb !== "");

    return (
        <nav className="text-white lg:p-2 md:p-1 h-full flex items-center">
            <ul className="flex items-center">
                <li className="hover:text-white/80 lg:text-xl md:text-base text-sm  transition-colors flex items-center">
                    <Link to="/gestor/principal" className="hover:text-white/80" state={{...location.state}}>
                        Home
                    </Link>
                </li>
                {/* El breadcrumb se muestra solo si hay más de 1 segmento en la ruta */}
                {pathnames.slice(1).map((pathname, index) => {
                    // Generar el camino acumulado hasta este punto
                    const routeTo = `/${pathnames.slice(0, index + 2).join("/")}`; // Incluye el segmento "alumno"
                    const routeName = routeMapping[pathname] || pathname; // Usar el nombre mapeado o el nombre de la ruta
                    if(!routeMapping[pathname])return null;
                    return (
                        <li key={routeTo} className="flex items-center lg:text-xl md:text-base text-sm ">
                            <div className="h-full w-4 mx-2 text-white/50 ">{">"}</div>
                            {index === pathnames.length - 2 ? ( // Verifica si es el último elemento
                                // Elemento final no es un enlace
                                <span className="text-white/70 ">{routeName}</span>
                            ) : (
                                // Enlaces intermedios
                                <Link
                                    to={routeTo}
                                    className="hover:text-white/80 transition-colors"
                                    state={{...location.state}}>
                                    {routeName}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

//Dont touch - Joey Flores :(
export const BreadCrumbDirector = () => {
    const location = useLocation();

    // Obtener la ruta actual
    const fullPath = location.pathname;

    // Extraer parámetros de la ruta
    const matchPeriodo = fullPath.match(/\/director\/([^/]+)/);
    const idPeriodo = matchPeriodo ? matchPeriodo[1] : null;

    const isCursosVisualizar = fullPath.match(/\/director\/[^/]+\/cursos\/visualizar$/);
    const matchCurso = fullPath.match(/\/director\/[^/]+\/cursos\/visualizar\/([^/]+)/);
    const cursoId = matchCurso ? matchCurso[1] : null;

    const matchCompetencia = fullPath.match(/\/VistaCompetencias\/([^/]+)\/vistaSubcompetencias/);
    const compID = matchCompetencia ? matchCompetencia[1] : null;

    const isMatricula = fullPath.includes("matricula/administrar");
    const isRetiros = fullPath.includes("gestionarRetiros");
    const isCompetencias = fullPath.includes("VistaCompetencias") && !fullPath.includes("vistaSubcompetencias");
    const isSubcompetencias = fullPath.includes("vistaSubcompetencias");

    // Crear el breadcrumb dinámico
    let breadcrumb = [
        { label: "Panel", href: "/director", isClickable: true },
    ];

    // Cursos
    if (isCursosVisualizar || cursoId) {
        breadcrumb.push({
            label: "Cursos",
            href: `/director/${idPeriodo}/cursos/visualizar`,
            isClickable: true, // Habilitado por defecto
        });
    }

    // Competencias
    if (isCompetencias || isSubcompetencias) {
        breadcrumb.push({
            label: "Competencias",
            href: `/director/${idPeriodo}/cursos/visualizar/${cursoId}/VistaCompetencias`,
            isClickable: true, // Habilitado por defecto
        });
    }

    // Subcompetencias
    if (isSubcompetencias) {
        breadcrumb.push({
            label: "Subcompetencias",
            href: null, // No clicable
            isClickable: false,
        });
    }

    // Matrícula
    if (isMatricula) {
        breadcrumb.push({
            label: "Matrícula",
            href: `/director/${idPeriodo}/matricula/administrar`,
            isClickable: false, // Último nivel no es clicable
        });
    }

    // Retiros
    if (isRetiros) {
        breadcrumb.push({
            label: "Gestión de Retiros",
            href: `/director/${idPeriodo}/gestionarRetiros`,
            isClickable: false, // Último nivel no es clicable
        });
    }

    // Deshabilitar dinámicamente solo el último nivel
    breadcrumb = breadcrumb.map((crumb, index) => {
        if (index === breadcrumb.length - 1) {
            return { ...crumb, isClickable: false }; // Solo el último nivel deshabilitado
        }
        return { ...crumb, isClickable: true }; // Los demás niveles habilitados
    });

    return (
        <nav className="text-white p-2 h-full flex items-center">
            <ul className="flex items-center">
                {breadcrumb.map((crumb, index) => (
                    <li key={index} className="flex items-center lg:text-xl md:text-base text-sm">
                        {/* Separador */}
                        {index > 0 && <div className="h-full w-4 mx-2 text-white/50">{">"}</div>}
                        {/* Enlace o texto */}
                        {crumb.isClickable ? (
                            <Link to={crumb.href} state={{ ...location.state }} className="hover:text-white/80 transition-colors flex items-center">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-white/70">{crumb.label}</span>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};