import { ExcelLeadOrigin, ExcelLeadState, TipoOkupa, TLeadOrigin } from './enums';

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

type Royalty = OkupaRoyalty | DebtRoyalty;

interface OkupaRoyalty {
  direccion_completa: string;
  tipo_okupa: TipoOkupa;
  ref_catastral: string;
  precio_inicial: number;
  fase_okupacion: string;
}

interface DebtRoyalty {
  direccion_completa: string;
  ref_catastral: string;
  uf: string;
  valor_deuda: number;
  valor_tasacion: number;
  fase_deuda: string;
}