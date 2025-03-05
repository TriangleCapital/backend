import {
  TBoolean,
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

interface TLead {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  conversacion_iniciada: TBoolean;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  origen: TLeadOrigin;
  estado_primitivo: TLeadPrimitiveState;
  mensaje_primitivo: string;
  timestamp: Date;
  propiedad_interes: string;
  financiacion: TLeadFinanciacion;
  uso_vivienda: TLeadUsoVivienda;
  fin_inversion: TLeadFinInversion;
  ahorros_disponibles: number;
  chatbot_completado: TBoolean;
}

interface TLastPropertyWorked {
  _id: string;
  descripcion: string;
}
