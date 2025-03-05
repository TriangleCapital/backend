import { MANYCHAT_BOT_FIELD_ID } from '../../utils/constants';
import { parseExcelToTLeads } from '../../utils/parser';
import { filterNonSendedLeads } from '../helpers/leads';
import { createSubscriber, sendFlowToSubscriber, updateBotField } from '../services/manychat';
import { createLead, getLastProperty, updateLastProperty } from '../services/totalum';

export async function handleExcelLeads(excel: Express.Multer.File) {
  try {
    const parsedExcelLeads = parseExcelToTLeads(excel);

    const lastPropertyWorked = await getLastProperty();
    const leadsToCreate = await filterNonSendedLeads(parsedExcelLeads);

    for (const lead of leadsToCreate) {
      if (lead.propiedad_interes !== lastPropertyWorked) {
        await updateBotField(MANYCHAT_BOT_FIELD_ID, lead.propiedad_interes);
        await updateLastProperty(lead.propiedad_interes);
      }

      const subscriberId = await createSubscriber(lead);

      await createLead(lead);

      await sendFlowToSubscriber(subscriberId);

      // Update totalum sended
    }

    return leadsToCreate.length;
  } catch (error) {
    throw new Error(`Error manejando los leads del excel: ${error.message}`);
  }
}
