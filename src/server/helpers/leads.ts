import { TLead } from '../../database/interfaces/totalum';
import { getAllLeads } from '../services/totalum';

export async function filterNonSendedLeads(parsedExcelLeads: Partial<TLead>[]): Promise<Partial<TLead>[]> {
  try {
    const totalumLeads = await getAllLeads();
    const totalumPhones = totalumLeads.map((lead: TLead) => String(lead.telefono));

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
