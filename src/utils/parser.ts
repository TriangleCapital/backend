import fs from 'fs';
import * as XLSX from 'xlsx';
import { ExcelLead } from '../database/interfaces';
import {
  ExcelLeadOrigin,
  ExcelLeadState,
  TLeadConversationStarted,
  TLeadOrigin,
  TLeadPrimitiveState,
} from '../database/interfaces/enums';
import { TLead } from '../database/interfaces/totalum';

export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, '');

  if (!cleaned.startsWith('+34')) {
    if (cleaned.startsWith('34')) {
      cleaned = `+${cleaned}`;
    } else if (cleaned.startsWith('+')) {
      return cleaned;
    } else {
      cleaned = `+34${cleaned}`;
    }
  }

  return cleaned;
}

export function parseLeadFromExcelToTotalum(excelLead: ExcelLead): Partial<TLead> {
  const [day, month, year, time] = excelLead.FECHA.split(/[/ ]/);
  const timestamp = new Date(`${year}-${month}-${day}T${time}`);

  return {
    origen: excelLead.ORIGEN === ExcelLeadOrigin.Email ? TLeadOrigin.Email : TLeadOrigin.Llamada,
    estado_primitivo:
      excelLead.ESTADO === ExcelLeadState.Contestada ? TLeadPrimitiveState.Contestado : TLeadPrimitiveState.NoContestado,
    mensaje_primitivo: excelLead.MENSAJE,
    nombre: excelLead.USUARIO,
    telefono: `${excelLead.TELÉFONO}`,
    email: excelLead.EMAIL,
    timestamp,
    conversacion_iniciada: TLeadConversationStarted.Si,
    propiedad_interes: excelLead.DESCRIPCIÓN,
  };
}

export function parseExcelToTLeads(excel: Express.Multer.File): Partial<TLead>[] {
  try {
    if (!excel.path) {
      throw new Error('File path is missing.');
    }

    const fileBuffer = fs.readFileSync(excel.path);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('No sheets found in the Excel file.');
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const excelData: ExcelLead[] = XLSX.utils.sheet_to_json(sheet);

    return excelData.map(parseLeadFromExcelToTotalum);
  } catch (error) {
    throw new Error(`Error parseando el excel a leads: ${error.message}`);
  }
}

export function parseLeadFromTotalumToManychat(lead: Partial<TLead>): MSubscriber {
  const phone = lead.telefono ? formatPhoneNumber(lead.telefono) : '';

  return {
    first_name: lead.nombre || '',
    last_name: lead.apellidos || '',
    phone,
    whatsapp_phone: phone,
    email: lead.email || '',
    gender: '',
    has_opt_in_sms: false,
    has_opt_in_email: false,
    consent_phrase: '',
  };
}
