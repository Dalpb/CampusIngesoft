from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Alumno
from matricula.models import AlumnoXHorario,InformacionMatricula,TEstadoMatricula
from cursos.models import Curso, Horario, TNivel,PeriodoAcademico  # Asumimos que tienes estos modelos
import random
from django.db.models import Max,Sum
from datetime import timedelta,date
import calendar


#Obtener fechas
def obtener_primer_lunes_enero(year):
    """
    Devuelve el primer lunes de enero del año especificado,
    excluyendo el 1 de enero si cae en lunes.
    """
    primer_dia = date(year, 1, 1)
    if primer_dia.weekday() == calendar.MONDAY:
        primer_dia += timedelta(days=7)
    else:
        primer_dia += timedelta(days=(calendar.MONDAY - primer_dia.weekday() + 7) % 7)
    return primer_dia

def obtener_ultimo_viernes_febrero(year):
    """
    Devuelve el último viernes de febrero del año especificado.
    """
    ultimo_dia_febrero = date(year, 2, calendar.monthrange(year, 2)[1])
    return ultimo_dia_febrero - timedelta(days=(ultimo_dia_febrero.weekday() - calendar.FRIDAY) % 7)

def obtener_ultimo_lunes_marzo(year):
    """
    Devuelve el último lunes de marzo del año especificado.
    """
    ultimo_dia_marzo = date(year, 3, 31)
    return ultimo_dia_marzo - timedelta(days=(ultimo_dia_marzo.weekday() - calendar.MONDAY) % 7)

def obtener_segundo_lunes_agosto(year):
    """
    Devuelve el segundo lunes de agosto del año especificado.
    """
    primer_dia_agosto = date(year, 8, 1)
    primer_lunes_agosto = primer_dia_agosto + timedelta(days=(calendar.MONDAY - primer_dia_agosto.weekday()) % 7)
    return primer_lunes_agosto + timedelta(days=7)

def obtener_segundo_viernes_julio(year):
    """
    Devuelve el segundo viernes de julio del año especificado.
    """
    primer_dia_julio = date(year, 7, 1)
    primer_viernes_julio = primer_dia_julio + timedelta(days=(calendar.FRIDAY - primer_dia_julio.weekday()) % 7)
    return primer_viernes_julio + timedelta(days=7)

def obtener_tercer_viernes_diciembre(year):
    """
    Devuelve el tercer viernes de diciembre del año especificado.
    """
    primer_dia_diciembre = date(year, 12, 1)
    primer_viernes_diciembre = primer_dia_diciembre + timedelta(days=(calendar.FRIDAY - primer_dia_diciembre.weekday()) % 7)
    return primer_viernes_diciembre + timedelta(days=14)



## Actualizar factor de desempeño
def calcular_factor_desempeno(alumno):
    # Inicializamos variables para acumular los créditos y el total ponderado de notas
    total_creditos = 0
    suma_ponderada_notas = 0

    # Obtenemos todos los periodos de los cursos donde el alumno tiene notas
    periodos = AlumnoXHorario.objects.filter(
        alumno=alumno,
        promedioFinal__gte=10.5  # Considerar solo las notas aprobadas
    ).values_list('periodo', flat=True).distinct()
    
    for periodo in periodos:
        # Obtener los AlumnoXHorario del alumno en el periodo actual
        alumnoxhorarios = AlumnoXHorario.objects.filter(
            alumno=alumno,
            periodo=periodo,
            retirado=False  # Notas aprobadas
        )

        # Calcular el total de créditos y la suma ponderada de notas del periodo
        total_creditos_periodo = alumnoxhorarios.aggregate(
            total_creditos=Sum('horario__idCurso__creditos')
        )['total_creditos'] or 0

        suma_ponderada_periodo = alumnoxhorarios.aggregate(
            suma_ponderada=Sum('promedioFinal')  # Supone que promedioFinal ya es ponderado
        )['suma_ponderada'] or 0

        # Acumular los créditos y la suma ponderada
        total_creditos += total_creditos_periodo
        suma_ponderada_notas += suma_ponderada_periodo

        # Detener si hemos alcanzado los 40 créditos aprobados
        if total_creditos >= 40:
            break

    # Calcular el factor de desempeño final como promedio ponderado
    if total_creditos > 0:
        return round(suma_ponderada_notas / total_creditos*10,2)
    return 0  # Retorna 0 si no tiene créditos aprobados


@receiver(post_save, sender=InformacionMatricula)
def actualizar_factores_y_turnos(sender, instance, **kwargs):
    # Verificar si el estado ha cambiado a FINDECICLO
    if instance.estadoMatricula == TEstadoMatricula.FINDECICLO:
        # Obtener todos los alumnos activos
        alumnos = Alumno.objects.filter(activo=True)
        
        # Actualizar el factor de desempeño para cada alumno
        for alumno in alumnos:
            factor_desempeno = calcular_factor_desempeno(alumno)
            alumno.factorDeDesempeno = factor_desempeno
            alumno.save()
        
        # Ordenar los alumnos por `factorDeDesempeno` y `codigo`
        alumnos_ordenados = Alumno.objects.filter(activo=True,habilitado=True).order_by(
            '-factorDeDesempeno', 'codigo'
        )
        
        # Asignar el turno de matrícula en función del orden
        for turno, alumno in enumerate(alumnos_ordenados, start=1):
            alumno.turnoOrdenMatricula = turno
            alumno.save()
            
        print(f"Los datos de los alumnos han sido actualizados")
        
        
        print(f"Creacion de nuevo Ciclo")
        
        """
        Crea un nuevo ciclo académico basado en el último ciclo actual.
        """
        # Obtener el periodo actual
        periodo_actual = PeriodoAcademico.objects.filter(actual=True).first()
        if not periodo_actual:
            raise ValueError("No se encontró un periodo actual.")

        # Determinar el nuevo periodo
        periodo_parts = periodo_actual.periodo.split('-')
        year = int(periodo_parts[0])
        ciclo = periodo_parts[1]

        if ciclo == '0':
            nuevo_periodo = f"{year}-I"
            fecha_inicio = obtener_ultimo_lunes_marzo(year)
            fecha_fin = obtener_segundo_viernes_julio(year)
            dias_prematricula = 14  # Ciclo I tiene 14 días para prematrícula
        elif ciclo == 'I':
            nuevo_periodo = f"{year}-II"
            fecha_inicio = obtener_segundo_lunes_agosto(year)
            fecha_fin = obtener_tercer_viernes_diciembre(year)
            dias_prematricula = 14  # Ciclo II tiene 14 días para prematrícula
        elif ciclo == 'II':
            nuevo_periodo = f"{year + 1}-0"
            fecha_inicio = obtener_primer_lunes_enero(year + 1)
            fecha_fin = obtener_ultimo_viernes_febrero(year + 1)
            dias_prematricula = 7  # Ciclo 0 tiene 7 días para prematrícula
        else:
            raise ValueError(f"Ciclo desconocido: {ciclo}")

        # Crear el nuevo periodo
        nuevo_ciclo = PeriodoAcademico(
            periodo=nuevo_periodo,
            fechaInicio=fecha_inicio,
            fechaFin=fecha_fin,
            actual=True,
            activo=True
        )
        nuevo_ciclo.save()

        print(f"Pasando a prematricula ...")
        
        # Actualizar las fechas en InformacionMatricula
        if ciclo in ['I', '0']:
            fecha_publicacion_cursos = fecha_inicio - timedelta(days=18)
            fecha_inicio_prematricula = fecha_inicio - timedelta(days=14)
            fecha_cierre_prematricula = fecha_inicio - timedelta(days=11)
            fecha_publicacion_cursos_mat_inicio = fecha_inicio - timedelta(days=9)
            fecha_publicacion_cursos_mat_fin = fecha_inicio - timedelta(days=8)
            fecha_inicio_extemporanea = fecha_inicio - timedelta(days=7)
            fecha_fin_extemporanea = fecha_inicio - timedelta(days=5)
            fecha_publicacion_extemporanea = fecha_inicio - timedelta(days=2)
            fecha_fin = fecha_inicio - timedelta(days=1)
        elif ciclo == 'II':
            fecha_publicacion_cursos = fecha_inicio - timedelta(days=7)
            fecha_inicio_prematricula = fecha_inicio - timedelta(days=6)
            fecha_cierre_prematricula = fecha_inicio - timedelta(days=5)
            fecha_publicacion_cursos_mat_inicio = fecha_inicio - timedelta(days=4)
            fecha_publicacion_cursos_mat_fin = fecha_inicio - timedelta(days=3)
            fecha_inicio_extemporanea = fecha_inicio + timedelta(days=2)
            fecha_fin_extemporanea = fecha_inicio + timedelta(days=1)
            fecha_publicacion_extemporanea = fecha_inicio + timedelta(days=0)
            fecha_fin = fecha_fin

        # Recuperar y actualizar el registro existente en InformacionMatricula
        informacion_matricula = InformacionMatricula.objects.first()
        if not informacion_matricula:
            raise ValueError("No se encontró el registro de InformacionMatricula para actualizar.")

        informacion_matricula.publicacionDeCursos = fecha_publicacion_cursos
        informacion_matricula.inicioPreMatricula = fecha_inicio_prematricula
        informacion_matricula.cierrePreMatricula = fecha_cierre_prematricula
        informacion_matricula.publicacionCursosMatInicio = fecha_publicacion_cursos_mat_inicio
        informacion_matricula.publicacionCursosMatFin = fecha_publicacion_cursos_mat_fin
        informacion_matricula.inicioMatExtemporanea = fecha_inicio_extemporanea
        informacion_matricula.finMatExtemporanea = fecha_fin_extemporanea
        informacion_matricula.publicacionMatExtemporanea = fecha_publicacion_extemporanea
        informacion_matricula.fin = fecha_fin
        informacion_matricula.estadoMatricula = TEstadoMatricula.PREMATRICULA
        informacion_matricula.save()
            
        print(f"Completado!! :V")
        
        
        
    
    

