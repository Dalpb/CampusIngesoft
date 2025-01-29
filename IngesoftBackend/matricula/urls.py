from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'lineainscripcion', LineaInscripcionView, 'lineainscripcion')
router.register(r'inscripcion', InscripcionView, 'inscripcion')
router.register(r'alumnoporhorario', AlumnoXHorarioView, 'alumnoporhorario')
router.register(r'alumnos_horario', AlumnosHorarioViewSet, 'alumnos_horario')
router.register(r'alumno-x-horario', CursosRetiradosViewSet, basename='alumno-x-horario')
router.register(r'retiros_alumno', RetiroAlumnoViewSet, basename='retiros-alumno')
router.register(r"informacionCampus",InformacionMatriculaView,basename='informacionCampus')
router.register(r'cambiar_campus',CambiarEstadoCampusView, basename='cambiar_campus')
urlpatterns = router.urls

urlpatterns = [
    path('', include(router.urls)),  # Includes all the registered routes from the router
    path('inscripcionMostrar/<int:alumno_id>/', InscripcionDetailView.as_view(), name='inscripcion_detail'),
    path('guardar_lineas_de_inscripcion/', GuardarLineasDeInscripcionView.as_view(), name='guardar_lineas_de_inscripcion'),
    path('guardar_retiros/', GuardarRetirosView.as_view(), name='guardar_retiros'),
    path('eliminar_lineas_de_inscripcion/',EliminarLineasDeInscripcionView.as_view(),name='eliminar_lineas_de_inscripcion'),
    path('matricular_alumnos/<int:horario_id>/',MatricularEnCurso.as_view(),name='matricular_alumnos'),
    path('listarEstadosMatricula/',ListarEnumAPIView.as_view(),name='listarEstadosMatricula'),
    path('matriculaGestor/',InscribirExtraordinarioView.as_view(),name='matriculaGestor'),
    path('verEstado/',VerEstadoView.as_view(),name='verEstado')
]
