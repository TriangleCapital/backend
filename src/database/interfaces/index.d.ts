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

type ExcelRealty = ExcelOkupaRealty | ExcelDebtRealty;

interface ExcelOkupaRealty {
  direccion_completa: string;
  tipo_okupa: TipoOkupa;
  ref_catastral: string;
  precio_inicial: number;
  fase_okupacion: string;
  provincia: string;
  comarca: string;
  codigo_postal: string;
}

interface ExcelDebtRealty {
  direccion_completa: string;
  ref_catastral: string;
  uf: string;
  valor_deuda: number;
  valor_tasacion: number;
  valor_venta: number;
  diferencia_precio: number;
  fase_deuda: string;
  enlace_idealista: string;
}