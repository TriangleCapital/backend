import {
  EstadoNegociacionDeuda,
  EstadoNegociacionOkupa,
  Provincia,
  Responsable,
  TBoolean,
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
  direccion_completa: string;
  precio_inicial: number;
  fase_okupacion: string;
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
  estado_negociacion: EstadoNegociacionDeuda;
  responsable: Responsable;
  fotos: FileRecordI[];
  enlace_maps: string;
  provincia: Provincia;
  direccion_catastro: string;
  direccion_completa: string;
}
