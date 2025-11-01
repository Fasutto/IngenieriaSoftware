-- Base de datos del Tec de Culiacan.

Create Database TecDeCuliacan
Go
Use TecDeCuliacan
Go

-- 1. Tabla principal de Docentes.
Create Table Docentes(
	DocenteId Int Not Null,
	PrimerNombre Nvarchar(100) Not Null,
	SegundoNombre Nvarchar(100) Null,
	ApellidoPaterno Nvarchar(100) Null,
	ApellidoMaterno Nvarchar(100) Null,
    Curp Nvarchar(18) Not Null,
    Rfc Nvarchar(13) Not Null,
    FechaIngreso Date Not Null
)

Go

-- 2. Tabla de Grados de Estudio de los Docentes.
Create Table GradoEstudioDocente (
    GradoId Int Not Null,
    DocenteId Int Not Null,
    GradoObtenido Varchar(30) Null, -- Ej: 'Maestría', 'Doctorado' (Factor 1.4.9)
    FolioCedula Varchar(50) Null,
    FechaObtencion Date Null
)

GO

-- 3. Tabla de Nomina y Plazas de los Docentes.
Create Table Nomina_Plazas (
    NominaId Int Not Null,
    DocenteId Int Not Null,
    EstatusPlaza Varchar(10) Not Null, -- Req. 01: '10', '95'
    TipoNombramiento Varchar(50) Not Null,
    FechaEstatusInicio Date,
    CompensacionDT18_Q07_2025 DECIMAL(10, 2) -- Req. 02: Valor para exclusión
)

Go

-- 4. Tabla de Incidencias de los Docentes.
Create Table Incidencias (
    IncidenciaId Int Not Null,
    DocenteId Int Not Null,
    PeriodoEvaluado Year Not Null,
    TotalFaltas Int Default 0, -- Para calcular el % de asistencia (Req. 01)
    TipoSancion Varchar(100) Null 
)

Go

-- 5. Tabla de Licencias de los Docentes.
Create Table Licencias_Docentes (
    LicenciaId Int Not Null,
    DocenteId Int Not Null,
    TipoLicencia Varchar(50) Not Null, -- Req. 08, 09: 'Sabático', 'Beca Comisión', 'Gravidez'
    FolioAutorizacion Varchar(50), -- Req. 08
    FechaInicio Date Not Null,
    FechaFin Date Not Null
)

Go

-- Tablas de Investigación (Para Req. 05 y Factor 2 - aunque no se detalla, se prepara la estructura)

-- 6. Tabla de Proyectos de Investigación.
Create Table Proyectos_Investigacion (
    ProyectoId Int Not Null,
    NombreProyecto Varchar(255) Not Null,
    FolioRegistro Varchar(50) Unique, -- Folio para Req. 05
    VigenciaInicio Date,
    VigenciaFin Date,
    FuenteFinanciamiento Varchar(50),
    DictamenDirector Boolean, -- Req. 05
    RecomendacionComite Boolean -- Req. 05
)

Go

-- 7. Tabla de Participantes en Proyectos de Investigación.
Create Table Participantes_Proyectos (
    ParticipanteId Int Not Null,
    DocenteId Int Not Null,
    ProyectoId Int Not Null,
    Rol Varchar(50) Not Null -- 'Responsable' o 'Colaborador'
)

Go

-- Tablas de Servicios Escolares y Carga Académica (Factor 1)

-- 8. Tabla de Horarios de los Docentes.
Create Table Horarios_Docentes (
    HorarioId Int Not Null,
    DocenteId Int Not Null,
    Semestre Varchar(20) Not Null,
    HorarioInicio Time Not Null,
    HorarioFin Time Not Null,
    CargaReglamentaria Boolean -- Req. 03
)

Go

-- 9. Tabla de Asignaturas Impartidas por los Docentes.
Create Table Asignaturas_Docentes (
    AsignaturaDocenteId Int Not Null,
    DocenteId Int Not Null,
    Semestre Varchar(20) Not Null, -- Semestre de la carga (Req. 07)
    Nivel Varchar(20) Not Null,
    ClaveAsignatura Varchar(20),
    TotalAlumnos Int Not Null -- Req. 07
)

Go

-- 10. Tabla de Liberaciones de los Docentes.
Create Table Liberaciones_Docentes (
    LiberacionId Int Not Null,
    DocenteId Int Not Null,
    Semestre Varchar(20) Not Null,
    TipoLiberacion Varchar(50) Not Null, -- 'Docente' (Req. 11), 'Académica' (Req. 12)
    CumplimientoPorcentaje Decimal(5, 2) Not Null, -- Debe ser 100.00 para Req. 12
    EstaLiberado Boolean Not Null -- TRUE para Req. 11
)

Go

-- 11. Tabla de Evaluaciones de los Docentes.
Create Table Evaluaciones_Docentes (
    EvaluacionId Int Not Null,
    DocenteId Int Not Null,
    Semestre Varchar(20) Not Null,
    TipoEvaluacion Varchar(50) Not Null, -- 'Departamental' (Req. 13), 'Desempeño' (Req. 14)
    CalificacionGlobal Varchar(20) Not Null, -- Req. 13, 14: 'SUFICIENTE'
    CoberturaEstudiantes Decimal(5, 2), -- Req. 14: % de alumnos (Min. 60% Lic.)
    VoBo_SubAcademica Boolean Not Null -- Req. 14: Visto Bueno Subdirección Académica
)

Go

-- 12. Tabla de CVU Control de los Docentes.
Create Table CVU_Control (
    CVUControlId Int Not Null,
    DocenteId Int Not Null,
    FechaUltimaActualizacion Date,
    EstadoCVU Varchar(50) Not Null -- Req. 06
)

Go

-- Tablas de Factor 1: Dedicación y Producción

-- 13. Tabla de Acciones Tutoriales.
Create Table Accion_Tutorial (
    TutoriaId Int Not Null,
    DocenteId Int Not Null,
    Semestre Varchar(20) Not Null,
    NumEstudiantes Int Not Null, -- Factor 1.1.5
    ImpactoEvaluacion Varchar(255), -- Factor 1.1.5
    VoBo_SubAcademica Boolean Not Null
)

Go

-- 14. Tabla de Producción Didáctica.
Create Table Producción_Didáctica (
    ProdDidacticaID Int Not Null,
    DocenteID Int Not Null,
    TipoProducto Varchar(100) Not Null, -- Factor 1.2.1
    TieneRubrica Boolean,
    FirmaPresidenteAcademia Boolean,
    FirmaDptoAcademico Boolean,
    VoBo_SubAcademica Boolean
)

Go

-- 15. Tabla de Cursos Impartidos impartidos a otros Docentes.
Create Table Cursos_Docentes (
    CursoDocenteId Int Not Null,
    DocenteID Int Not Null,
    TipoCurso Varchar(100), -- Factor 1.2.2
    NombreInstitucion Varchar(100),
    FolioOficioComision Varchar(50),
    NumHoras Int, -- Factor 1.2.2 (mínimo 30)
    NumRegistroConstancia Varchar(50)
)

Go

-- 16. Tabla de Sinodalias de Titulación.
Create Table Sinodalias_Titulacion (
    SinodaliaID Int Not Null,
    DocenteID Int Not Null,
    NivelGrado Varchar(50) Not Null,
    TipoParticipacion Varchar(50) Not Null, -- Factor 1.3
    FolioActa Varchar(50),
    FechaExamen Date
)

Go

-- 17. Tabla de Comisiones y Oficios.
Create Table Comisiones_Oficios (
    ComisionOficioID Int Not Null,
    DocenteID Int Not Null,
    TipoComision Varchar(100) Not Null, -- Factor 1.4.2 a 1.4.8
    FolioOficioComision Varchar(50), -- Para auditorías, jurado, etc.
    FolioConstanciaCumplimiento Varchar(50),
    VoBo_SubAcademica Boolean
)

Go

-- 18. Tabla de Programas Académicos.
Create Table Programas_Academicos (
    ProgramaID Int Not Null,
    NombrePrograma Varchar(255) Not Null,
    Acreditado Boolean, -- Para Factor 1.1.6
    SNP_Vigente Boolean, -- Para Factor 1.1.6
    OrganoAcreditador Varchar(100),
    FolioRegistroDDIE_DPII Varchar(50) -- Para Factor 1.4.8
)

Go

-- 19. Tabla de Participación de Docentes en Programas Académicos.
Create Table Programas_Docentes (
    DocenteProgramaID Int Not Null,
    DocenteID Int Not Null,
    ProgramaID Int Not Null,
    Rol Varchar(50) Not Null -- Ej: Participación curricular, impartición de clase
)

Go

-- Tabla de Usuarios y Roles para gestión de documentos

--- 20. Tabla de Roles de Usuarios.
Create Table Roles (
    RolID Int Not Null,
    NombreRol Varchar(50) Not Null -- Ej: 'Docente', 'Subdirector_Academico', 'RRHH'
)

Go

--- 21. Tabla de Usuarios del Sistema.
Create Table Usuarios (
    UsuarioID Int Not Null,
    DocenteID Int Null, 
    RolID Int Not Null, 
    ContrasenaHash Varchar(255) Not Null,
    Email Varchar(100) Unique Not Null
)

Go

-- 22. Tabla de Tipos de Documentos Generados.
Create Table Tipos_Documentos (
    TipoDocumentoID Int Not Null,
    NombreCorto Varchar(50) Unique Not Null, -- Ej: 'Req_01_RRHH', 'Fact1_1_5_Tutoria'
    NombreCompleto Varchar(255) Not Null,
    FactorAsociado Varchar(10) Null, -- Ej: 'Req_Inicio', 'Factor 1'
    AreaResponsable Varchar(100) -- Ej: 'Recursos Humanos', 'Dpto. Desarrollo Académico'
)

Go

-- 23. Tabla de Documentos Generados para los Docentes.
Create Table Documentos_Generados (
    DocumentoID Int Not Null,
    DocenteID Int Not Null, -- FK del docente al que pertenece
    TipoDocumentoID Int Not Null, -- FK al tipo de documento definido
    FolioInterno Varchar(50) Unique Not Null,
    FechaGeneracion DateTime Not Null,
    GeneradoPorUsuarioID Int Not Null -- FK del usuario que generó/autorizó
)

Go