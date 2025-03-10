import { TBoolean } from '../../database/interfaces/enums';
import { MANYCHAT_BOT_FIELD_ID } from '../../utils/constants';
import { sleep } from '../../utils/funcs';
import { parseExcelToTLeads } from '../../utils/parser';
import { filterNonSendedLeads } from '../helpers/leads';
import { createSubscriber, sendFlowToSubscriber, updateBotField } from '../services/manychat';
import { createLead, getLastProperty, updateLastProperty, updateLead } from '../services/totalum';

export async function handleExcelLeads(excel: Express.Multer.File) {
  try {
    const parsedExcelLeads = parseExcelToTLeads(excel);

    const lastPropertyWorked = await getLastProperty();
    const leadsToCreate = await filterNonSendedLeads(parsedExcelLeads);

    let leadsWithError = 0;
    for (const lead of leadsToCreate) {
      try {
        if (lead.propiedad_interes !== lastPropertyWorked) {
          await updateBotField(MANYCHAT_BOT_FIELD_ID, lead.propiedad_interes);
          await updateLastProperty(lead.propiedad_interes);
        }

        const subscriberId = await createSubscriber(lead);

        const newLeadId = await createLead(lead);

        await sendFlowToSubscriber(subscriberId);

        await updateLead(newLeadId, { conversacion_iniciada: TBoolean.Si });

        await sleep(500);
      } catch (error) {
        console.error(`Error creando el lead: ${error.message}`);
        leadsWithError++;
      }
    }

    return {
      leadsProcessed: leadsToCreate.length - leadsWithError,
      leadsOmitted: parsedExcelLeads.length - leadsToCreate.length + leadsWithError,
    };
  } catch (error) {
    throw new Error(`Error manejando los leads del excel: ${error.message}`);
  }
}
