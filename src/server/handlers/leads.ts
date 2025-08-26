import { TLeadFinanciacion } from '../../database/interfaces/enums';
import { MContactData } from '../../database/interfaces/manychat';
import { TLeadAlContado, TLeadHipoteca } from '../../database/interfaces/totalum';
import {
  MANYCHAT_REALTY_NAME_FIELD_ID,
  MANYCHAT_REALTY_LINK_FIELD_ID,
  MANYCHAT_EMAIL_FIELD_ID,
} from '../../utils/constants';
import { sleep } from '../../utils/funcs';
import { parseExcelToTLeads } from '../../utils/parser';
import {
  filterNonSendedLeads,
  findSharedLeadByPhone,
  handleContadoInteraction,
  handleHipotecaInteraction,
} from '../helpers/leads';
import { sendCompletedChatbotEmail } from '../helpers/notifications';
import { createSubscriber, sendFlowToSubscriber, updateBotField, updateSubscriberCustomField } from '../services/manychat';
import {
  getLastLink,
  getLastProperty,
  updateLastLink,
  updateLastProperty,
  createSharedLead,
  removeSharedLead,
} from '../services/totalum';

export async function handleExcelLeads(excel: Express.Multer.File, realtyLink: string) {
  try {
    const parsedExcelLeads = parseExcelToTLeads(excel);

    const lastPropertyWorked = await getLastProperty();
    const leadsToCreate = await filterNonSendedLeads(parsedExcelLeads);

    const lastLinkWorked = await getLastLink();

    let leadsWithError = 0;
    for (const lead of leadsToCreate) {
      try {
        if (lead.propiedad_interes !== lastPropertyWorked) {
          await updateBotField(MANYCHAT_REALTY_NAME_FIELD_ID, lead.propiedad_interes);
          await updateLastProperty(lead.propiedad_interes);
        }

        if (realtyLink !== lastLinkWorked) {
          await updateBotField(MANYCHAT_REALTY_LINK_FIELD_ID, realtyLink);
          await updateLastLink(realtyLink);
        }
        const subscriberId = await createSubscriber(lead);
        if (lead.email) await updateSubscriberCustomField(subscriberId, MANYCHAT_EMAIL_FIELD_ID, lead.email);

        await sendFlowToSubscriber(subscriberId);

        await createSharedLead(lead);

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

export async function handleManychatInteraction(phoneNumber: string, contactData: MContactData) {
  try {
    const leadType: TLeadFinanciacion = contactData.custom_fields.tipo_financiacion;

    const sharedLead = await findSharedLeadByPhone(phoneNumber);

    if (leadType && leadType === TLeadFinanciacion.Hipoteca) {
      await handleHipotecaInteraction(phoneNumber, contactData, sharedLead);
    }

    if (leadType && leadType === TLeadFinanciacion.AlContado) {
      await handleContadoInteraction(phoneNumber, contactData, sharedLead);
    }

    if (sharedLead) await removeSharedLead(sharedLead._id);
  } catch (error) {
    throw new Error(`Error manejando la interacción de Manychat: ${error.message}`);
  }
}

export async function handleCompletedChatbot(phoneNumber: string, contactData: MContactData, receiverEmail: string) {
  const leadType: TLeadFinanciacion = contactData.custom_fields.tipo_financiacion;

  const sharedLead = await findSharedLeadByPhone(phoneNumber);

  let lead: Partial<TLeadHipoteca> | Partial<TLeadAlContado>;
  let alreadyHandled: boolean = false;

  if (leadType && leadType === TLeadFinanciacion.Hipoteca) {
    const leadData = await handleHipotecaInteraction(phoneNumber, contactData, sharedLead);

    lead = leadData.lead;
    alreadyHandled = leadData.alreadyHandled;
  }

  if (leadType && leadType === TLeadFinanciacion.AlContado) {
    const leadData = await handleContadoInteraction(phoneNumber, contactData, sharedLead);

    lead = leadData.lead;
    alreadyHandled = leadData.alreadyHandled;
  }

  if (!alreadyHandled) {
    await sendCompletedChatbotEmail(receiverEmail, leadType, lead);
  }

  if (sharedLead) await removeSharedLead(sharedLead._id);

  try {
  } catch (error) {
    throw new Error(`Error manejando el chatbot completado: ${error.message}`);
  }
}
