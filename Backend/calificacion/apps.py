from django.apps import AppConfig


class CalificacionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'calificacion'
    
    def ready(self):
        import calificacion.signals
