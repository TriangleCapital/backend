import { MContactData } from '../../database/interfaces/manychat';
import { TLeadAlContado, TLeadHipoteca, TLeadShared } from '../../database/interfaces/totalum';
import {
  formatPhoneNumber,
  parseContadoLeadFromManychatToTotalum,
  parseContadoLeadFromMultipleSourcesToTotalum,
  parseHipotecaLeadFromManychatToTotalum,
  parseHipotecaLeadFromMultipleSourcesToTotalum,
} from '../../utils/parser';
import {
  createContadoLead,
  createHipotecaLead,
  getAllContadoLeads,
  getAllHipotecaLeads,
  getAllSharedLeads,
  updateContadoLead,
  updateHipotecaLead,
} from '../services/totalum';

export async function filterNonSendedLeads(parsedExcelLeads: Partial<TLeadShared>[]): Promise<Partial<TLeadShared>[]> {
  try {
    const totalumSharedLeads = await getAllSharedLeads();
    const sharedPhones = totalumSharedLeads.map((lead: TLeadShared) => String(lead.telefono));

    const totalumHipotecaLeads = await getAllHipotecaLeads();
    const hipotecaPhones = totalumHipotecaLeads.map((lead: TLeadHipoteca) => String(lead.telefono));

    const totalumContadoLeads = await getAllContadoLeads();
    const contadoPhones = totalumContadoLeads.map((lead: TLeadAlContado) => String(lead.telefono));

    const totalumPhones = [...sharedPhones, ...hipotecaPhones, ...contadoPhones];
    const seenPhones = new Set<string>();

    const filteredLeads = parsedExcelLeads.filter((lead) => {
      if (!lead.telefono) return false;

      const phoneStr = String(lead.telefono).replace(/\s+/g, '');

      if (/[a-zA-Z]/.test(phoneStr)) {
        return false;
      }

      if (/[a-zA-Z]/.test(phoneStr) || phoneStr.length < 9 || totalumPhones.includes(phoneStr)) {
        return false;
      }

      if (seenPhones.has(phoneStr)) {
        return false;
      }

      seenPhones.add(phoneStr);
      return true;
    });

    return filteredLeads;
  } catch (error) {
    throw new Error(`Error filtrando los leads no trabajados: ${error.message}`);
  }
}

export async function findSharedLeadByPhone(phone: string): Promise<TLeadShared | null> {
  try {
    const allLeads = await getAllSharedLeads();
    const lead = allLeads.find((l) => formatPhoneNumber(l.telefono) === formatPhoneNumber(phone));

    return lead || null;
  } catch (error) {
    throw new Error(`Error buscando el lead compartido por teléfono: ${error.message}`);
  }
}

export async function findHipotecaLeadByPhone(phone: string): Promise<TLeadHipoteca | null> {
  try {
    const allLeads = await getAllHipotecaLeads();
    const lead = allLeads.find((l) => formatPhoneNumber(l.telefono) === formatPhoneNumber(phone));

    return lead || null;
  } catch (error) {
    throw new Error(`Error buscando el lead de hipoteca por teléfono: ${error.message}`);
  }
}

export async function findContadoLeadByPhone(phone: string): Promise<TLeadAlContado | null> {
  try {
    const allLeads = await getAllContadoLeads();
    const lead = allLeads.find((l) => formatPhoneNumber(l.telefono) === formatPhoneNumber(phone));

    return lead || null;
  } catch (error) {
    throw new Error(`Error buscando el lead de al contado por teléfono: ${error.message}`);
  }
}

export async function handleHipotecaInteraction(
  phoneNumber: string,
  contactData: MContactData,
  sharedLead: TLeadShared | null
): Promise<Partial<TLeadHipoteca>> {
  try {
    const hipotecaLead = await findHipotecaLeadByPhone(phoneNumber);

    if (hipotecaLead) {
      if (hipotecaLead.chatbot_completado === 'Si') return hipotecaLead;

      const update = parseHipotecaLeadFromManychatToTotalum(contactData);
      await updateHipotecaLead(hipotecaLead._id, update);

      return { ...hipotecaLead, ...update };
    } else {
      if (sharedLead) {
        const newLead = parseHipotecaLeadFromMultipleSourcesToTotalum(contactData, sharedLead);
        await createHipotecaLead(newLead);

        return newLead;
      }
    }
  } catch (error) {
    throw new Error(`Error manejando la interacción de hipoteca: ${error.message}`);
  }
}

export async function handleContadoInteraction(
  phoneNumber: string,
  contactData: MContactData,
  sharedLead: TLeadShared | null
): Promise<Partial<TLeadAlContado>> {
  try {
    const contadoLead = await findContadoLeadByPhone(phoneNumber);

    if (contadoLead) {
      if (contadoLead.chatbot_completado === 'Si') return contadoLead;

      const update = parseContadoLeadFromManychatToTotalum(contactData);
      await updateContadoLead(contadoLead._id, update);

      return { ...contadoLead, ...update };
    } else {
      if (sharedLead) {
        const newLead = parseContadoLeadFromMultipleSourcesToTotalum(contactData, sharedLead);
        await createContadoLead(newLead);

        return newLead;
      }
    }
  } catch (error) {
    throw new Error(`Error manejando la interacción de al contado: ${error.message}`);
  }
}
