import fs from 'fs';
import * as XLSX from 'xlsx';
import { ExcelLead } from '../database/interfaces';
import { ExcelLeadOrigin, TBoolean, TLeadOrigin } from '../database/interfaces/enums';
import { TLeadAlContado, TLeadHipoteca, TLeadShared } from '../database/interfaces/totalum';
import { MContactData, MSubscriber } from '../database/interfaces/manychat';
import { parse } from 'path';

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';

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

export function parseLeadFromExcelToTotalum(excelLead: ExcelLead): Partial<TLeadShared> {
  const [day, month, year, time] = excelLead.FECHA.split(/[/ ]/);
  const timestamp = new Date(`${year}-${month}-${day}T${time}`);

  return {
    mensaje_idealista: excelLead.MENSAJE,
    nombre: excelLead.USUARIO,
    telefono: excelLead.TELÉFONO,
    email: excelLead.EMAIL,
    fecha_contacto: timestamp,
    propiedad_interes: excelLead.DESCRIPCIÓN,
    chatbot_completado: TBoolean.No,
  };
}

export function parseExcelToTLeads(excel: Express.Multer.File): Partial<TLeadShared>[] {
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

export function parseLeadFromTotalumToManychat(lead: Partial<TLeadShared>): MSubscriber {
  const phone = lead.telefono ? formatPhoneNumber(lead.telefono) : '';

  return {
    first_name: lead.nombre || '',
    phone,
    whatsapp_phone: phone,
    email: lead.email || '',
    gender: '',
    has_opt_in_sms: false,
    has_opt_in_email: false,
    consent_phrase: '',
  };
}

export function parseHipotecaLeadFromManychatToTotalum(contactData: MContactData): Partial<TLeadHipoteca> {
  const { ahorros_disponibles, estado_hipoteca, cuando_quiere_mudarse, venta_actual_propiedad, chatbot_completado } =
    contactData.custom_fields;

  const phone = formatPhoneNumber(contactData.whatsapp_phone);

  return {
    nombre: contactData.name,
    telefono: phone,
    ahorros_disponibles,
    estado_hipoteca,
    cuando_quiere_mudarse: `${cuando_quiere_mudarse} meses`,
    venta_actual_propiedad,
    chatbot_completado: chatbot_completado || TBoolean.No,
  };
}

export function parseContadoLeadFromManychatToTotalum(contactData: MContactData): Partial<TLeadAlContado> {
  const { ahorros_disponibles, uso_vivienda, fin_inversion, zona_interes, chatbot_completado } = contactData.custom_fields;

  const phone = formatPhoneNumber(contactData.whatsapp_phone);

  return {
    nombre: contactData.name,
    telefono: phone,
    ahorros_disponibles,
    uso_vivienda,
    fin_inversion,
    zona_interes,
    chatbot_completado: chatbot_completado || TBoolean.No,
  };
}

export function parseHipotecaLeadFromMultipleSourcesToTotalum(
  manychatContactData: MContactData,
  totalumSharedLead: TLeadShared
): Partial<TLeadHipoteca> {
  const { email, mensaje_idealista, fecha_contacto, propiedad_interes } = totalumSharedLead;

  const parsedContactData = parseHipotecaLeadFromManychatToTotalum(manychatContactData);

  const phone = formatPhoneNumber(manychatContactData.whatsapp_phone);

  return {
    ...parsedContactData,
    nombre: manychatContactData.name,
    telefono: phone,
    email,
    mensaje_idealista,
    fecha_contacto,
    propiedad_interes,
  };
}

export function parseContadoLeadFromMultipleSourcesToTotalum(
  manychatContactData: MContactData,
  totalumSharedLead: TLeadShared
): Partial<TLeadAlContado> {
  const { email, mensaje_idealista, fecha_contacto, propiedad_interes } = totalumSharedLead;

  const parsedContactData = parseContadoLeadFromManychatToTotalum(manychatContactData);

  const phone = formatPhoneNumber(manychatContactData.whatsapp_phone);

  return {
    ...parsedContactData,
    nombre: manychatContactData.name,
    telefono: phone,
    email,
    mensaje_idealista,
    fecha_contacto,
    propiedad_interes,
  };
}
