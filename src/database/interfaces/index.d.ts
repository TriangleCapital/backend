import { ExcelLeadOrigin, ExcelLeadState, TLeadOrigin } from './enums';

interface ExcelLead {
  ORIGEN: ExcelLeadOrigin;
  ESTADO: ExcelLeadState;
  DESCRIPCIÓN: string;
  ['REF. CLIENTE']: string;
  USUARIO: string;
  EMAIL: string;
  TELÉFONO: string;
  MENSAJE: string;
  FECHA: string;
};
