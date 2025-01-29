from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from cursos.models import PeriodoAcademico,Horario
from usuarios.models import Alumno
from matricula.models import Inscripcion,InformacionMatricula,TEstadoMatricula,LineaInscripcion,AlumnoXHorario
from django.db import transaction
from threading import Timer

##Agregar alumnoxhorario en ciclo_lectivo
@receiver(post_save, sender=InformacionMatricula)
def asginar_alummno_x_horario(sender, instance, **kwargs):
    if instance.estadoMatricula == TEstadoMatricula.CICLOLECTIVO:
        actual = PeriodoAcademico.objects.filter(actual=True).first()
        if not actual:
            print("No se encontró un periodo académico actual activo.")
            return

        inscripciones = Inscripcion.objects.filter(periodo=actual)
        Horario.objects.all().update(numMatriculados=0, numAprobados=0, numDesaprobados=0)

        try:
            with transaction.atomic():
                for inscripcion in inscripciones:
                    lineas = LineaInscripcion.objects.filter(
                        inscripcion=inscripcion,
                        seleccionado=True,
                        activo=True
                    )
                    for linea in lineas:
                        curso = linea.horario.idCurso
                        num_veces = AlumnoXHorario.objects.filter(
                            alumno=inscripcion.alumno,
                            horario__idCurso=curso,
                            retirado=False
                        ).count()
                        print(f"Asignando Alumno={inscripcion.alumno}, Horario={linea.horario}, Periodo={actual}, Veces={num_veces}")

                        # Validar antes de crear
                        if not inscripcion.alumno or not linea.horario or not actual:
                            print("Datos inválidos, saltando...")
                            continue

                        AlumnoXHorario.objects.get_or_create(
                            alumno=inscripcion.alumno,
                            horario=linea.horario,
                            periodo=actual,
                            vez=num_veces + 1,
                            promedioPcs=-1,
                            promedioFinal=-1,
                            retirado=False
                        )
                        linea.horario.numMatriculados += 1
                        linea.horario.save()

                print("Los alumnos se han asignado a sus horarios correctamente")
        except Exception as e:
            print(f"Error durante la asignación de horarios: {e}")
            raise


            
@receiver(post_save, sender=LineaInscripcion)
@receiver(post_delete, sender=LineaInscripcion)
def actualizar_posiciones_relativas(sender, instance, **kwargs):
    """
    Signal that updates the relative positions of lines of registration
    grouped by schedule when a LineaInscripcion is added or deleted.
    Prioritizes non-extemporaneous lines (`extemporanea=False`) and selected lines (`seleccionado=True`).
    """
    # Prevent signal recursion
    if getattr(instance, '_signal_suppressed', False):
        return

    # Get the current period
    periodo_actual = PeriodoAcademico.objects.filter(actual=True).first()
    if not periodo_actual:
        return  # No active period, do nothing

    # Get all active lines for the same schedule and period
    lineas = LineaInscripcion.objects.filter(
        inscripcion__periodo=periodo_actual,
        horario=instance.horario,
        activo=True
    ).select_related('horario', 'inscripcion__alumno')

    # Sort lines by:
    # 1. Non-extemporaneous lines first (extemporanea=False).
    # 2. Selected lines (seleccionado=True).
    # 3. Enrollment order (`turnoOrdenMatricula`).
    lineas_ordenadas = lineas.order_by(
        'extemporanea',             # Prioritize non-extemporaneous
        '-seleccionado',            # Then prioritize selected lines
        'inscripcion__alumno__turnoOrdenMatricula'  # Finally, by matriculation order
    )

    # Update relative positions
    with transaction.atomic():
        for posicion, linea in enumerate(lineas_ordenadas, start=1):
            if linea.posicionRelativa != posicion:
                linea.posicionRelativa = posicion
                linea._signal_suppressed = True  # Suppress the signal for this save
                linea.save()
                linea._signal_suppressed = False  # Re-enable the signal