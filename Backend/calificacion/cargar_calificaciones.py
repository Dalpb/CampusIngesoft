import pandas as pd

from .models import Competencia, SubCompetencia,NotaNumerica,TNota
import random
from cursos.models import Curso,Horario,Formula, PeriodoAcademico
from matricula.models import AlumnoXHorario
from django.db import transaction


file_path = r"E:\DOCUMENTOS\Documentos PUCP\12avo Ciclo\IngeSoft\competencias_subcompetencias_rubrica.xlsx"

# Cargar el archivo Excel en un DataFrame
df = pd.read_excel(file_path)


def importar_competencias_nuevas():
    with transaction.atomic():
        competencia_actual = None  # Variable para guardar la última competencia creada
        clave_anterior = None  # Variable para controlar cambios en la clave de competencia

        for _, row in df.iterrows():
            clave_actual = row['idcompetencia']  # Clave de la competencia actual

            # Verificar si la competencia debe ser creada o si es la misma que la fila anterior
            if clave_actual != clave_anterior:
                # Crear una nueva Competencia porque la clave cambió
                competencia_actual = Competencia.objects.create(
                    nombre=row['nombre_competencia'],
                    clave=row['idcompetencia'],
                    descripcion=row['descripcion_competencia'],
                    activo=True
                )
                # Actualizar la clave anterior
                clave_anterior = clave_actual

            # Crear la SubCompetencia para la competencia actual
            SubCompetencia.objects.create(
                idCompetencia=competencia_actual,
                nombre=row['nombre_subcompetencia'],
                clave=row['idsubcompetencia'],
                descripcion=row['descripción_subcompetencia'],
                nivelInicial=row['criterio_inicial'],
                nivelEnProceso=row['criterio_en_proceso'],
                nivelSatisfactorio=row['criterio_satisfactorio'],
                nivelSobresaliente=row['criterio_sobresaliente'],
                activo=True
            )
            
            
##Crear las notas de los alumnos           
def crear_notas_para_periodo(periodo):
    """
    Crea las notas numéricas para todos los alumnos de los cursos en el periodo especificado.

    Args:
        periodo (PeriodoAcademico): El periodo académico para el cual se crearán las notas.
    """
    # Obtener todos los cursos y el periodo actual en una sola operación
    cursos = Curso.objects.prefetch_related('horarios').all()
    periodo_actual = PeriodoAcademico.objects.filter(actual=True).first()

    if not periodo_actual:
        return  # Salir si no hay un periodo actual definido

    with transaction.atomic():
        notas_a_insertar = []  # Lista para notas a insertar en batch

        # Recorrer cada curso
        for curso in cursos:
            # Obtener la fórmula del curso
            formula = curso.formula

            # Si no hay fórmula asignada, continuar con el siguiente curso
            if not formula:
                continue

            # Recorrer los horarios del curso
            for horario in curso.horarios.all():
                # Obtener todos los alumnos inscritos en este horario para el periodo actual
                alumnos_x_horario = AlumnoXHorario.objects.filter(
                    horario=horario,
                    periodo=periodo_actual,
                    retirado=False
                ).select_related('alumno')

                # Obtener las notas existentes para estos alumnos en batch
                notas_existentes = NotaNumerica.objects.filter(
                    idAlumnoXHorario__in=alumnos_x_horario
                ).values_list('idAlumnoXHorario_id', 'tipoDeNota', 'indice')

                # Convertir las notas existentes en un set para rápida verificación
                notas_existentes_set = {
                    (nota[0], nota[1], nota[2]) for nota in notas_existentes
                }

                for alumno_x_horario in alumnos_x_horario:
                    # Crear notas según la fórmula del curso
                    if formula.numPracticas > 0 and formula.pesoPracticas > 0:
                        for i in range(1, formula.numPracticas + 1):
                            if (alumno_x_horario.id, TNota.PRACTICA, i) not in notas_existentes_set:
                                notas_a_insertar.append(NotaNumerica(
                                    idAlumnoXHorario=alumno_x_horario,
                                    tipoDeNota=TNota.PRACTICA,
                                    indice=i,
                                    valor=random.randint(8, 20)
                                ))

                    if formula.pesoParciales > 0:
                        if (alumno_x_horario.id, TNota.PARCIAL, 1) not in notas_existentes_set:
                            notas_a_insertar.append(NotaNumerica(
                                idAlumnoXHorario=alumno_x_horario,
                                tipoDeNota=TNota.PARCIAL,
                                indice=1,
                                valor=random.randint(6, 16)
                            ))

                    if formula.pesoFinales > 0:
                        if (alumno_x_horario.id, TNota.FINAL, 1) not in notas_existentes_set:
                            notas_a_insertar.append(NotaNumerica(
                                idAlumnoXHorario=alumno_x_horario,
                                tipoDeNota=TNota.FINAL,
                                indice=1,
                                valor=random.randint(7, 18)
                            ))

                    # Crear una nota única si no se creó ninguna otra
                    if not any(nota.idAlumnoXHorario == alumno_x_horario for nota in notas_a_insertar):
                        if (alumno_x_horario.id, TNota.UNICA, 1) not in notas_existentes_set:
                            notas_a_insertar.append(NotaNumerica(
                                idAlumnoXHorario=alumno_x_horario,
                                tipoDeNota=TNota.UNICA,
                                indice=1,
                                valor=random.randint(0, 20)
                            ))

        # Insertar todas las notas en una operación masiva
        NotaNumerica.objects.bulk_create(notas_a_insertar, batch_size=1000)