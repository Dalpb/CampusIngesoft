# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class CalificacionCompetencia(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    clave = models.CharField(max_length=50)
    descripcion = models.TextField()
    activo = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'calificacion_competencia'


class CalificacionCompetenciaxhorario(models.Model):
    id = models.BigAutoField(primary_key=True)
    cantidadevaluaciones = models.IntegerField(db_column='cantidadEvaluaciones')  # Field name made lowercase.
    activo = models.IntegerField()
    idcompetencia = models.ForeignKey(CalificacionCompetencia, models.DO_NOTHING, db_column='idCompetencia_id')  # Field name made lowercase.
    idhorario = models.ForeignKey('CursosHorario', models.DO_NOTHING, db_column='idHorario_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'calificacion_competenciaxhorario'


class CalificacionNotaalfabetica(models.Model):
    id = models.BigAutoField(primary_key=True)
    valor = models.CharField(max_length=2, blank=True, null=True)
    indice = models.IntegerField()
    retroalimentacion = models.TextField()
    activo = models.IntegerField()
    idnotaxcompetencia = models.ForeignKey('CalificacionNotaxcompetencia', models.DO_NOTHING, db_column='idNotaXCompetencia_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'calificacion_notaalfabetica'
        unique_together = (('idnotaxcompetencia', 'indice'),)


class CalificacionNotaalfabeticasub(models.Model):
    id = models.BigAutoField(primary_key=True)
    valor = models.CharField(max_length=2, blank=True, null=True)
    activo = models.IntegerField()
    idnotaalfabetica = models.ForeignKey(CalificacionNotaalfabetica, models.DO_NOTHING, db_column='idNotaAlfabetica_id')  # Field name made lowercase.
    idsubcompetencia = models.ForeignKey('CalificacionSubcompetencia', models.DO_NOTHING, db_column='idSubCompetencia_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'calificacion_notaalfabeticasub'
        unique_together = (('idnotaalfabetica', 'idsubcompetencia'),)


class CalificacionNotadisponible(models.Model):
    id = models.BigAutoField(primary_key=True)
    indice = models.IntegerField()
    tiponota = models.CharField(db_column='tipoNota', max_length=20)  # Field name made lowercase.
    activo = models.IntegerField()
    idhorario = models.ForeignKey('CursosHorario', models.DO_NOTHING, db_column='idHorario_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'calificacion_notadisponible'


class CalificacionNotanumerica(models.Model):
    id = models.BigAutoField(primary_key=True)
    tipodenota = models.CharField(db_column='tipoDeNota', max_length=20)  # Field name made lowercase.
    indice = models.IntegerField()
    valor = models.FloatField()
    activo = models.IntegerField()
    idalumnoxhorario = models.ForeignKey('MatriculaAlumnoxhorario', models.DO_NOTHING, db_column='idAlumnoXHorario_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'calificacion_notanumerica'
        unique_together = (('idalumnoxhorario', 'tipodenota', 'indice'),)


class CalificacionNotaxcompetencia(models.Model):
    id = models.BigAutoField(primary_key=True)
    notafinal = models.CharField(db_column='notaFinal', max_length=2, blank=True, null=True)  # Field name made lowercase.
    retroalimentacionfinal = models.TextField(db_column='retroalimentacionFinal', blank=True, null=True)  # Field name made lowercase.
    activo = models.IntegerField()
    idalumnoxhorario = models.ForeignKey('MatriculaAlumnoxhorario', models.DO_NOTHING, db_column='idAlumnoXHorario_id')  # Field name made lowercase.
    idcompetencia = models.ForeignKey(CalificacionCompetencia, models.DO_NOTHING, db_column='idCompetencia_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'calificacion_notaxcompetencia'
        unique_together = (('idalumnoxhorario', 'idcompetencia'),)


class CalificacionSubcompetencia(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    clave = models.CharField(max_length=50)
    descripcion = models.TextField()
    nivelinicial = models.CharField(db_column='nivelInicial', max_length=255)  # Field name made lowercase.
    nivelenproceso = models.CharField(db_column='nivelEnProceso', max_length=255)  # Field name made lowercase.
    nivelsatisfactorio = models.CharField(db_column='nivelSatisfactorio', max_length=255)  # Field name made lowercase.
    nivelsobresaliente = models.CharField(db_column='nivelSobresaliente', max_length=255)  # Field name made lowercase.
    activo = models.IntegerField()
    idcompetencia = models.ForeignKey(CalificacionCompetencia, models.DO_NOTHING, db_column='idCompetencia_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'calificacion_subcompetencia'


class CursosCurso(models.Model):
    id = models.BigAutoField(primary_key=True)
    clave = models.CharField(max_length=50)
    nombre = models.CharField(max_length=100)
    creditos = models.FloatField()
    nivel = models.CharField(max_length=2)
    activo = models.IntegerField()
    descripcion = models.TextField(blank=True, null=True)
    numhoras = models.IntegerField(db_column='numHoras')  # Field name made lowercase.
    obligatorio = models.IntegerField()
    silabo = models.TextField(blank=True, null=True)
    formula = models.ForeignKey('CursosFormula', models.DO_NOTHING)
    requisitos = models.ForeignKey('CursosRequisitobase', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cursos_curso'


class CursosCursoCompetencias(models.Model):
    id = models.BigAutoField(primary_key=True)
    curso = models.ForeignKey(CursosCurso, models.DO_NOTHING)
    competencia = models.ForeignKey(CalificacionCompetencia, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'cursos_curso_competencias'
        unique_together = (('curso', 'competencia'),)


class CursosFormula(models.Model):
    id = models.BigAutoField(primary_key=True)
    pesoparciales = models.FloatField(db_column='pesoParciales')  # Field name made lowercase.
    pesofinales = models.FloatField(db_column='pesoFinales')  # Field name made lowercase.
    pesopracticas = models.FloatField(db_column='pesoPracticas')  # Field name made lowercase.
    numpracticas = models.IntegerField(db_column='numPracticas')  # Field name made lowercase.
    activo = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'cursos_formula'


class CursosHorario(models.Model):
    id = models.BigAutoField(primary_key=True)
    clavehorario = models.CharField(db_column='claveHorario', max_length=5)  # Field name made lowercase.
    numvacantes = models.IntegerField(db_column='numVacantes')  # Field name made lowercase.
    nummatriculados = models.IntegerField(db_column='numMatriculados')  # Field name made lowercase.
    numaprobados = models.IntegerField(db_column='numAprobados')  # Field name made lowercase.
    numdesaprobados = models.IntegerField(db_column='numDesaprobados')  # Field name made lowercase.
    activo = models.IntegerField()
    idcurso = models.ForeignKey(CursosCurso, models.DO_NOTHING, db_column='idCurso_id')  # Field name made lowercase.
    idprofesor = models.ForeignKey('UsuariosProfesor', models.DO_NOTHING, blank=True, null=True)
    numinscritos = models.IntegerField(db_column='numInscritos')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'cursos_horario'


class CursosPeriodoacademico(models.Model):
    id = models.BigAutoField(primary_key=True)
    periodo = models.CharField(max_length=50)
    fechainicio = models.DateField(db_column='fechaInicio')  # Field name made lowercase.
    fechafin = models.DateField(db_column='fechaFin')  # Field name made lowercase.
    actual = models.IntegerField()
    activo = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'cursos_periodoacademico'


class CursosRequisitobase(models.Model):
    id = models.BigAutoField(primary_key=True)
    activo = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'cursos_requisitobase'


class CursosRequisitocreditos(models.Model):
    requisitobase_ptr = models.OneToOneField(CursosRequisitobase, models.DO_NOTHING, primary_key=True)
    total_creditos = models.FloatField()

    class Meta:
        managed = False
        db_table = 'cursos_requisitocreditos'


class CursosRequisitocursos(models.Model):
    requisitobase_ptr = models.OneToOneField(CursosRequisitobase, models.DO_NOTHING, primary_key=True)

    class Meta:
        managed = False
        db_table = 'cursos_requisitocursos'


class CursosRequisitocursosCursos(models.Model):
    id = models.BigAutoField(primary_key=True)
    requisitocursos = models.ForeignKey(CursosRequisitocursos, models.DO_NOTHING)
    curso = models.ForeignKey(CursosCurso, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'cursos_requisitocursos_cursos'
        unique_together = (('requisitocursos', 'curso'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class MatriculaAlumnoretiro(models.Model):
    id = models.BigAutoField(primary_key=True)
    justificacion = models.TextField(blank=True, null=True)
    estadosolicitud = models.IntegerField(db_column='estadoSolicitud')  # Field name made lowercase.
    estadoretiro = models.IntegerField(db_column='estadoRetiro')  # Field name made lowercase.
    idalumnoxhorario = models.OneToOneField('MatriculaAlumnoxhorario', models.DO_NOTHING, db_column='idAlumnoXHorario_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'matricula_alumnoretiro'


class MatriculaAlumnoxhorario(models.Model):
    id = models.BigAutoField(primary_key=True)
    vez = models.IntegerField()
    promediopcs = models.FloatField(db_column='promedioPcs')  # Field name made lowercase.
    promediofinal = models.FloatField(db_column='promedioFinal')  # Field name made lowercase.
    retirado = models.IntegerField()
    activo = models.IntegerField()
    alumno = models.ForeignKey('UsuariosAlumno', models.DO_NOTHING)
    horario = models.ForeignKey(CursosHorario, models.DO_NOTHING)
    periodo = models.ForeignKey(CursosPeriodoacademico, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'matricula_alumnoxhorario'
        unique_together = (('alumno', 'horario', 'periodo'),)


class MatriculaInformacionmatricula(models.Model):
    id = models.BigAutoField(primary_key=True)
    publicaciondecursos = models.DateField(db_column='publicacionDeCursos')  # Field name made lowercase.
    inicioprematricula = models.DateField(db_column='inicioPreMatricula')  # Field name made lowercase.
    cierreprematricula = models.DateField(db_column='cierrePreMatricula')  # Field name made lowercase.
    publicacioncursosmatinicio = models.DateField(db_column='publicacionCursosMatInicio')  # Field name made lowercase.
    publicacioncursosmatfin = models.DateField(db_column='publicacionCursosMatFin')  # Field name made lowercase.
    iniciomatextemporanea = models.DateField(db_column='inicioMatExtemporanea')  # Field name made lowercase.
    finmatextemporanea = models.DateField(db_column='finMatExtemporanea')  # Field name made lowercase.
    publicacionmatextemporanea = models.DateField(db_column='publicacionMatExtemporanea')  # Field name made lowercase.
    fin = models.DateField()
    estadomatricula = models.CharField(db_column='estadoMatricula', max_length=30)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'matricula_informacionmatricula'


class MatriculaInscripcion(models.Model):
    id = models.BigAutoField(primary_key=True)
    totalcreditos = models.FloatField(db_column='totalCreditos')  # Field name made lowercase.
    activo = models.IntegerField()
    alumno = models.ForeignKey('UsuariosAlumno', models.DO_NOTHING)
    periodo = models.ForeignKey(CursosPeriodoacademico, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'matricula_inscripcion'


class MatriculaLineainscripcion(models.Model):
    id = models.BigAutoField(primary_key=True)
    posicionrelativa = models.IntegerField(db_column='posicionRelativa')  # Field name made lowercase.
    seleccionado = models.IntegerField()
    permitido = models.IntegerField()
    activo = models.IntegerField()
    horario = models.ForeignKey(CursosHorario, models.DO_NOTHING)
    inscripcion = models.ForeignKey(MatriculaInscripcion, models.DO_NOTHING)
    extemporanea = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'matricula_lineainscripcion'


class UsuariosAdministrador(models.Model):
    usuario_ptr = models.OneToOneField('UsuariosUsuario', models.DO_NOTHING, primary_key=True)
    actual = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'usuarios_administrador'


class UsuariosAlumno(models.Model):
    usuario_ptr = models.OneToOneField('UsuariosUsuario', models.DO_NOTHING, primary_key=True)
    factordedesempeno = models.FloatField(db_column='factorDeDesempeno')  # Field name made lowercase.
    creditosprimera = models.IntegerField(db_column='creditosPrimera')  # Field name made lowercase.
    creditossegunda = models.IntegerField(db_column='creditosSegunda')  # Field name made lowercase.
    creditostercera = models.IntegerField(db_column='creditosTercera')  # Field name made lowercase.
    puntajetotalporcompetencias = models.CharField(db_column='puntajeTotalPorCompetencias', max_length=1)  # Field name made lowercase.
    numerosemestres = models.IntegerField(db_column='numeroSemestres')  # Field name made lowercase.
    turnoordenmatricula = models.IntegerField(db_column='turnoOrdenMatricula')  # Field name made lowercase.
    anioingreso = models.DateField(db_column='anioIngreso')  # Field name made lowercase.
    habilitado = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'usuarios_alumno'


class UsuariosAlumnoxcursospermitidos(models.Model):
    id = models.BigAutoField(primary_key=True)
    activo = models.IntegerField()
    curso = models.ForeignKey(CursosCurso, models.DO_NOTHING)
    alumno = models.ForeignKey(UsuariosAlumno, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'usuarios_alumnoxcursospermitidos'
        unique_together = (('alumno', 'curso'),)


class UsuariosProfesor(models.Model):
    usuario_ptr = models.OneToOneField('UsuariosUsuario', models.DO_NOTHING, primary_key=True)
    tipo = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'usuarios_profesor'


class UsuariosUsuario(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    segundoapellido = models.CharField(db_column='segundoApellido', max_length=100)  # Field name made lowercase.
    primerapellido = models.CharField(db_column='primerApellido', max_length=100)  # Field name made lowercase.
    correo = models.CharField(unique=True, max_length=254)
    codigo = models.CharField(max_length=28)
    fecharegistro = models.DateField(db_column='fechaRegistro')  # Field name made lowercase.
    telefono = models.CharField(max_length=15)
    activo = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'usuarios_usuario'
