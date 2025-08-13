import {
  EstadoNegociacionDeuda,
  EstadoNegociacionOkupa,
  Provincia,
  Responsable,
  TBoolean,
  TFund,
  TipoOkupa,
  TLeadCuandoQuiereMudarse,
  TLeadEstadoHipoteca,
  TLeadFinanciacion,
  TLeadFinInversion,
  TLeadOrigin,
  TLeadPrimitiveState,
  TLeadUsoVivienda,
} from '../enums';

interface TMensajeIniciador {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  mensaje: string;
}

interface TLeadShared {
  _id: string;
  nombre: string;
  telefono: string;
  email: string;
  mensaje_idealista: string;
  fecha_contacto: Date;
  propiedad_interes: string;
  chatbot_completado: TBoolean;
  ahorros_disponibles: number;
}

interface TLeadAlContado extends TLeadShared {
  uso_vivienda: TLeadUsoVivienda;
  fin_inversion: TLeadFinInversion;
  zona_interes: string;
}

interface TLeadHipoteca extends TLeadShared {
  estado_hipoteca: TLeadEstadoHipoteca;
  cuando_quiere_mudarse: TLeadCuandoQuiereMudarse | string;
  venta_actual_propiedad: TBoolean;
}

interface TLastPropertyWorked {
  _id: string;
  descripcion: string;
}

type TRealty = TOkupaRealty | TDebtRealty;

interface TOkupaRealty {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  tipo_okupa: TipoOkupa | '';
  estado_negociacion: EstadoNegociacionOkupa | '';
  notas: string;
  enlace_inmueble: string;
  enlace_idealista: string;
  fotos: FileRecordI[];
  ref_catastral: string;
  precio_venta: number;
  precio_valorado: number;
  porcentaje_rentabilidad: number;
  direccion_completa: string;
  provincia: string;
  comarca: string;
  codigo_postal: string;
  precio_inicial: number;
  fase_okupacion: string;
  comercializador: TFund;
  ref_activo: string;
  ref_fondo: string;
}

interface TDebtRealty {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  ref_catastral: string;
  uf: string;
  fase_deuda: string;
  valor_deuda: number;
  valor_venta: number;
  valor_tasacion: number;
  enlace_inmueble: string;
  enlace_idealista: string;
  notas: string;
  estado_negociacion: EstadoNegociacionDeuda | '';
  responsable: Responsable;
  fotos: FileRecordI[];
  enlace_maps: string;
  provincia: string;
  direccion_catastro: string;
  direccion_completa: string;
  codigo_postal: string;
  comercializador: TFund;
  ref_activo: string;
  ref_fondo: string;
}

export interface TEvaluationForm {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  nombre_completo?: string;
  fecha?: Date;
  invertido_antes?: 'Si' | 'No';
  tipo_inversion?: string;
  intencion_inversion?: string;
  duracion_inversion?: 'Hasta 6 meses' | 'Hasta 1 año';
  capital_disponible?: number;
  entiende_condiciones?: 'Si' | 'No';
}

export interface TFormularioMrfPdfI {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  nombre_completo?: string;
  fecha?: Date;
  intencion_inversion?: string;
  duracion_inversion?: string;
  capital_disponible?: number;
  meses_empleado?: number;
  salario_anual_empleado?: number;
}

interface Archivo {
  name: string;
  previousFilename: string;
  type: string;
  order: number;
  sizeInMb: number;
  url: string;
}

export interface TArchivo {
  _id: string;
  archivo: Archivo[];
  referencia: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  numero_descargas: number | null;
  id: string;
}

export interface TPersona {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  nombre_completo?: string;
  telefono?: string;
  rol?: string;
  notas?: string;
  inmueble_deuda?: string; // (Many to One) if you get this field with nested, can be: InmuebleDeudaI;
  inmueble_vacio?: string; // (Many to One) if you get this field with nested, can be: InmuebleVacioI;
  inmueble_okupado?: string; // (Many to One) if you get this field with nested, can be: InmuebleOkupadoI;
  mensajes_automatico?: string;
}
