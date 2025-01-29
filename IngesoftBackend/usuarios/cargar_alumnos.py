from faker import Faker
import random
from datetime import date
from .models import Alumno, AlumnoXCursosPermitidos
from cursos.models import Horario, PeriodoAcademico, Curso, TNivel
from matricula.models import Inscripcion,LineaInscripcion
from matricula.models import AlumnoXHorario
from django.db import transaction
from django.db.models import QuerySet, Prefetch,F


fake = Faker()

def generar_telefono_formateado():
    # Generar las tres partes del número
    parte1 = random.randint(900, 999)  # Ej: 987
    parte2 = random.randint(100, 999)  # Ej: 654
    parte3 = random.randint(100, 999)  # Ej: 321

    # Formatear como '987 654 321'
    telefono = f"{parte1} {parte2} {parte3}"
    return telefono


def generar_alumnos(cantidad):
    """
    Genera una cantidad especificada de alumnos con datos aleatorios usando Faker
    y los guarda en la base de datos, creando también inscripciones y líneas de inscripción.

    Args:
        cantidad (int): Número de alumnos a generar.
    """
    alumnos_creados = []
    periodo_actual = PeriodoAcademico.objects.filter(actual=True).first()
    if not periodo_actual:
        raise ValueError("No se encontró un período académico actual.")

    # Obtener cursos de nivel 1
    cursos_nivel_1 = Curso.objects.filter(nivel=TNivel.UNO, activo=True)

    if not cursos_nivel_1.exists():
        raise ValueError("No se encontraron cursos activos de nivel 1.")

    with transaction.atomic():
        for _ in range(cantidad):
            # Generar datos del alumno
            nombre = fake.first_name()
            primer_apellido = fake.last_name()
            segundo_apellido = fake.last_name()
            correo = fake.unique.email()
            codigo = str(random.randint(2025000, 20254999))  # Genera un código aleatorio único
            fecha_registro = fake.date_this_decade()
            telefono = generar_telefono_formateado()

            # Crear y guardar al alumno
            alumno = Alumno.objects.create(
                nombre=nombre,
                primerApellido=primer_apellido,
                segundoApellido=segundo_apellido,
                correo=correo,
                codigo=codigo,
                fechaRegistro=fecha_registro,
                telefono=telefono,
                activo=True,
                factorDeDesempeno=1000,
                creditosPrimera=0,
                creditosSegunda=0,
                creditosTercera=0,
                puntajeTotalPorCompetencias=random.choice(['A', 'B', 'C', 'D']),
                numeroSemestres=0,
                turnoOrdenMatricula=0,
                anioIngreso=fake.date_between(start_date="-5y", end_date="today")
            )
            alumnos_creados.append(alumno)

            # Crear una inscripción para el alumno en el período actual
            inscripcion = Inscripcion.objects.create(
                periodo=periodo_actual,
                alumno=alumno,
                totalCreditos=0,
                activo=True
            )

            # Asignar líneas de inscripción a los primeros 2 horarios de cada curso de nivel 1
            lineas_inscripcion = []
            for curso in cursos_nivel_1:
                horarios = Horario.objects.filter(idCurso=curso, activo=True).order_by('id')[:2]
                for posicion, horario in enumerate(horarios, start=1):
                    if horario.numMatriculados < horario.numVacantes:  # Validar límite de vacantes
                        lineas_inscripcion.append(LineaInscripcion(
                            horario=horario,
                            inscripcion=inscripcion,
                            posicionRelativa=posicion,
                            seleccionado=False,
                            permitido=True,
                            extemporanea=False,
                            activo=True
                        ))

                        # Incrementar el número de matriculados en el horario
                        horario.numMatriculados += 1
                        horario.save()

            # Crear líneas de inscripción en batch
            LineaInscripcion.objects.bulk_create(lineas_inscripcion)

    print(f"{len(alumnos_creados)} alumnos creados, inscripciones y líneas de inscripción generadas exitosamente.")
        
        
def asignar_codigos_por_grupos(alumnos: QuerySet, alumnos_por_grupo=500):
    """
    Asigna nuevos códigos a los alumnos en grupos de 500, con el formato 20aaxxxx.
    Cada año tendrá 2 grupos y, cuando se llenen los grupos de un año, se pasa al siguiente.

    Args:
        alumnos (QuerySet): QuerySet de alumnos que se desean actualizar.
        alumnos_por_grupo (int): Cantidad de alumnos por grupo. Por defecto, 500.
    """
    total_alumnos = alumnos.count()
    if total_alumnos == 0:
        print("No hay alumnos para asignar códigos.")
        return

    # Inicialización de variables
    codigo_actual = 20240000  # Comienza en el primer grupo del año 2024
    incremento_codigo = 5000  # Incremento para cada grupo
    grupos_por_año = 2        # Dos grupos por año
    año_actual = 2024         # Año inicial
    alumnos_actuales = 0      # Contador para el grupo actual

    alumnos_ordenados = alumnos.order_by("id")  # Asegura que los alumnos se procesen en orden predecible

    # Asignar códigos a los alumnos
    for alumno in alumnos_ordenados:
        # Asignar el nuevo código al alumno
        alumno.codigo = f"{codigo_actual + (alumnos_actuales % alumnos_por_grupo):04}"
        alumno.save()

        alumnos_actuales += 1  # Incrementar el contador de alumnos procesados

        # Verificar si se completó el grupo actual
        if alumnos_actuales == alumnos_por_grupo:
            alumnos_actuales = 0  # Reinicia el contador para el nuevo grupo
            # Mover al siguiente grupo
            codigo_actual += incremento_codigo

            # Si se completaron 2 grupos en el año actual, pasa al siguiente año
            if (codigo_actual // 10000) % grupos_por_año == 0:
                año_actual += 1
                codigo_actual = int(f"{año_actual}0000")  # Reiniciar el código para el siguiente año

    print(f"Se actualizaron los códigos de {total_alumnos} alumnos exitosamente.")
    
    
def matricular_alumnos_por_grupo(alumnos, niveles_curso, cursos_por_nivel):
    """
    Matricula automáticamente a los alumnos en cursos de un nivel específico,
    asignándolos según los grupos de códigos creados.

    Args:
        alumnos (QuerySet): QuerySet de alumnos ordenados por código.
        niveles_curso (int): Número máximo de niveles de cursos disponibles (ej. 10).
        cursos_por_nivel (dict): Un diccionario con los cursos disponibles por nivel.
                                 Ejemplo: {1: [Curso1, Curso2], 2: [Curso3], ...}
    """
    alumnos_por_grupo = 500
    grupo_actual = 1
    nivel_actual = 1

    with transaction.atomic():
        for idx, alumno in enumerate(alumnos.order_by("codigo")):
            # Obtener los cursos correspondientes al nivel actual
            cursos_actuales = cursos_por_nivel.get(nivel_actual, [])
            if not cursos_actuales:
                print(f"No hay cursos disponibles para el nivel {nivel_actual}.")
                continue

            # Matricular al alumno en cada curso del nivel actual
            for curso in cursos_actuales:
                # Obtener los horarios activos del curso
                horarios = curso.horarios.filter(activo=True).order_by("claveHorario")
                for horario in horarios:
                    if horario.numMatriculados < horario.numVacantes:  # Verificar disponibilidad
                        AlumnoXHorario.objects.create(
                            alumno=alumno,
                            horario=horario,
                            periodo=horario.periodo,  # Supongo que el horario tiene un campo periodo
                            vez=1,  # Primera matrícula
                        )
                        # Actualizar las métricas del horario
                        horario.numMatriculados += 1
                        horario.numInscritos += 1
                        horario.save()
                        break  # Matricularse en un solo horario por curso

            # Cambiar de grupo y nivel según corresponda
            if (idx + 1) % alumnos_por_grupo == 0:
                grupo_actual += 1
                nivel_actual += 1

                # Reiniciar niveles si se alcanzan todos los disponibles
                if nivel_actual > niveles_curso:
                    nivel_actual = 1

    print(f"Se matricularon alumnos en cursos exitosamente.")
    
    
def matricular_alumnos_con_semestre_mayor_que_cero():
    """
    Matricula a todos los alumnos con numeroSemestres > 0 en los horarios activos
    de los cursos permitidos.
    """
    from cursos.models import Horario, AlumnoXHorario  # Asumiendo los nombres reales de las clases relacionadas
    from usuarios.models import Alumno, AlumnoXCursosPermitidos  # Ajustar importación según estructura
    
    # Obtener alumnos con numSemestre > 0 y habilitados
    alumnos = Alumno.objects.filter(numeroSemestres__gt=0, habilitado=True)
    actual = PeriodoAcademico.objects.filter(actual=True).first()

    with transaction.atomic():
        for alumno in alumnos:
            # Obtener los cursos permitidos activos para el alumno
            cursos_permitidos = AlumnoXCursosPermitidos.objects.filter(
                alumno=alumno,
                activo=True  # Solo cursos permitidos activos
            ).select_related('curso')
            
            for curso_permitido in cursos_permitidos:
                curso = curso_permitido.curso
                
                # Obtener los horarios activos del curso con vacantes
                horarios_disponibles = curso.horarios.filter(
                    activo=True,  # Solo horarios activos
                    numMatriculados__lt=F('numVacantes')  # Verificar disponibilidad
                ).order_by('claveHorario')  # Asignar prioridad a horarios según clave

                for horario in horarios_disponibles:
                    # Crear el registro de AlumnoXHorario
                    AlumnoXHorario.objects.create(
                        alumno=alumno,
                        horario=horario,
                        periodo=actual,  # Aseguramos registrar el periodo
                        vez=1  # Primera vez que el alumno se inscribe
                    )

                    # Actualizar el número de matriculados en el horario
                    horario.numMatriculados += 1
                    horario.save()
                    break  # Detenemos después de matricular en un horario por curso

    print("Matrícula completada para alumnos con numSemestre > 0.")
    
    
    
def crear_lineas_inscripcion_para_alumnos():
    """
    Crea inscripciones y líneas de inscripción para todos los alumnos con `numeroSemestres > 0`
    en horarios activos de los cursos permitidos, matriculándolos en el período actual.
    """

    # Obtener el período actual
    periodo_actual = PeriodoAcademico.objects.filter(actual=True).first()
    if not periodo_actual:
        print("No hay un período actual configurado.")
        return
    
    # Filtrar alumnos habilitados con semestre > 0
    #numeroSemestres__gt=0
    alumnos = Alumno.objects.filter(numeroSemestres__gt=0,habilitado=True)

    with transaction.atomic():
    # Pre-fetch de inscripciones existentes
        inscripciones_existentes = {
            (inscripcion.alumno_id, inscripcion.periodo_id): inscripcion
            for inscripcion in Inscripcion.objects.filter(
                periodo=periodo_actual,
                activo=True
            )
        }

        # Pre-fetch cursos permitidos y horarios activos en una sola operación
        cursos_permitidos_qs = AlumnoXCursosPermitidos.objects.filter(
            alumno__in=alumnos,
            activo=True
        )[:2].select_related('curso').prefetch_related(
            Prefetch(
                'curso__horarios',
                queryset=Horario.objects.filter(
                    activo=True,
                    numMatriculados__lt=F('numVacantes')
                ).order_by('claveHorario')
            )
        )

        # Agrupar cursos permitidos por alumno para evitar consultas redundantes
        cursos_por_alumno = {}
        for curso_permitido in cursos_permitidos_qs:
            cursos_por_alumno.setdefault(curso_permitido.alumno_id, []).append(curso_permitido.curso)

        # Crear un batch para las líneas de inscripción y actualizaciones masivas
        lineas_inscripcion_batch = []
        horarios_actualizados = []

        for alumno in alumnos:
            # Obtener o crear inscripción
            inscripcion = inscripciones_existentes.get((alumno.id, periodo_actual.id))
            if not inscripcion:
                inscripcion = Inscripcion.objects.create(
                    alumno=alumno,
                    periodo=periodo_actual,
                    totalCreditos=0,
                    activo=True
                )
                inscripciones_existentes[(alumno.id, periodo_actual.id)] = inscripcion

            # Obtener cursos permitidos del alumno
            cursos = cursos_por_alumno.get(alumno.id, [])
            for curso in cursos:
                horarios_disponibles = list(curso.horarios.all())

                # Mezclar horarios para asignar de forma aleatoria
                random.shuffle(horarios_disponibles)

                # Matricular en el primer horario disponible que cumpla la restricción
                for horario in horarios_disponibles:
                    if horario.numMatriculados < 60:  # Restricción de 60 alumnos por horario
                        # Crear línea de inscripción
                        lineas_inscripcion_batch.append(
                            LineaInscripcion(
                                horario=horario,
                                inscripcion=inscripcion,
                                seleccionado=False,
                                posicionRelativa=1,
                                permitido=True,
                                extemporanea=False,
                                activo=True
                            )
                        )

                        # Marcar el horario para actualización masiva
                        horario.numMatriculados += 1
                        horarios_actualizados.append(horario)

                        # Incrementar créditos en la inscripción
                        inscripcion.totalCreditos += horario.idCurso.creditos
                        break  # Solo inscribir en un horario por curso

        # Batch insert de líneas de inscripción
        LineaInscripcion.objects.bulk_create(lineas_inscripcion_batch)

        # Batch update de horarios
        Horario.objects.bulk_update(horarios_actualizados, ['numMatriculados'])

        # Batch update de inscripciones
        Inscripcion.objects.bulk_update(
            inscripciones_existentes.values(), ['totalCreditos']
        )

    # Liberar conexiones no usadas (opcional para sesiones largas)