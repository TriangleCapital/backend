export enum TBoolean {
  Si = 'Si',
  No = 'No',
}

export enum TLeadOrigin {
  Llamada = 'Llamada',
  Email = 'Email',
}

export enum TLeadPrimitiveState {
  Contestado = 'Contestado',
  NoContestado = 'No contestado',
}

export enum ExcelLeadOrigin {
  Email = 'email',
  Call = 'call',
}

export enum ExcelLeadState {
  Contestada = 'Contestada',
  NoContestada = 'No contestada',
}

export enum TLeadFinanciacion {
  Hipoteca = 'Hipoteca',
  AlContado = 'Al contado',
}

export enum TLeadUsoVivienda {
  ViviendaPrincipal = 'Vivienda principal',
  Inversion = 'Inversión',
}

export enum TLeadFinInversion {
  ReformarYVender = 'Reformar y vender',
  RentabilidadPorAlquiler = 'Rentabilidad por alquiler',
}

export enum TLeadEstadoHipoteca {
  VistaConElBanco = 'Vista con el banco',
  QuiereAsesoramiento = 'Quiere asesoramiento + visita',
}

export enum TLeadCuandoQuiereMudarse {
  Enseguida = 'Enseguida',
  En3Meses = 'En 3 meses',
}

export enum TRoyaltieType {
  Okupados = 'inmueble_okupado',
  Deuda = 'inmueble_deuda',
}

export enum TipoOkupa {
  Ajeno = 'Ajeno',
  AntiguoPropietario = 'Antiguo Propietario',
  AntiguoInquilino = 'Antiguo Inquilino',
  Desconocido = 'Desconocido',
  Vacio = 'Vacío',
}

export enum EstadoNegociacionOkupa {
  PendienteSanear = 'Pendiente sanear',
  PendienteSanearPrioritario = 'Pendiente sanear prioritario',
  RequiereAccion = 'Requiere acción',
  EnEspera = 'En espera',
  PendienteVisita = 'Pendiente Visita',
  PresentadoAInversores = 'Presentado a Inversores',
  Cerrado = 'Cerrado',
}

export enum EstadoNegociacionDeuda {
  PendienteVisitar = 'Pendiente Visitar',
  PendienteVisitarPrioritario = 'Pendiente Visitar Prioritario',
  RequiereAccion = 'Requiere Acción',
  EnEspera = 'En Espera',
  Descartado = 'Descartado',
  Cerrado = 'Cerrado',
}

export enum Responsable {
  Aron = 'Aron',
  Aitor = 'Aitor',
}

export enum Provincia {
  Valencia = 'Valencia',
  Alicante = 'Alicante',
  Castellon = 'Castellón',
  Tarragona = 'Tarragona',
}