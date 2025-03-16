import {
  TBoolean,
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
