import { TLeadConversationStarted, TLeadOrigin, TLeadPrimitiveState } from '../enums';

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
  conversacion_iniciada: TLeadConversationStarted;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  origen: TLeadOrigin;
  estado_primitivo: TLeadPrimitiveState;
  mensaje_primitivo: string;
  timestamp: Date;
  propiedad_interes: string;
}

interface TLastPropertyWorked {
  _id: string;
  descripcion: string;
}
