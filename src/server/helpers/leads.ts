import { TLead } from '../../database/interfaces/totalum';
import { getAllLeads } from '../services/totalum';

export async function filterNonSendedLeads(parsedExcelLeads: Partial<TLead>[]): Promise<Partial<TLead>[]> {
  try {
    const totalumLeads = await getAllLeads();
    const totalumPhones = totalumLeads.map((lead: TLead) => String(lead.telefono));

    const filteredLeads = parsedExcelLeads.filter((lead, index, self) => {
      if (!lead.telefono || lead.telefono === 'undefined') return false;
      const phoneStr = String(lead.telefono).replace(/\s+/g, '');

      return (
        phoneStr.length >= 9 &&
        !totalumPhones.includes(phoneStr) &&
        self.findIndex((l) => String(l.telefono) === phoneStr) === index
      );
    });

    console.log(filteredLeads);

    return filteredLeads;
  } catch (error) {
    throw new Error(`Error filtrando los leads no trabajados: ${error.message}`);
  }
}
