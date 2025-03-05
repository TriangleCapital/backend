import axios from 'axios';
import { TLead } from '../../database/interfaces/totalum';
import { MANYCHAT_API, MANYCHAT_FLOW_NS, manychatOptions } from '../../utils/constants';
import { parseLeadFromTotalumToManychat } from '../../utils/parser';

export async function createSubscriber(lead: Partial<TLead>): Promise<number> {
  try {
    const subscriber = parseLeadFromTotalumToManychat(lead);

    const response = await axios.post(`${MANYCHAT_API}/fb/subscriber/createSubscriber`, subscriber, manychatOptions);

    return Number(response.data.data.id);
  } catch (error) {
    if (error.response.data.message) {
      throw new Error(`Error creando el subscriber en Manychat: ${error.response.data.message}`);
    } else {
      throw new Error(`Error creando el subscriber en Manychat: ${error.message}`);
    }
  }
}

export async function updateBotField(botFieldId: number, newValue: string) {
  try {
    const body: MBotField = { field_id: botFieldId, field_value: newValue };

    await axios.post(`${MANYCHAT_API}/fb/page/setBotField`, body, manychatOptions);
  } catch (error) {
    if (error.response.data.message) {
      throw new Error(`Error actualizando el bot field en Manychat: ${error.response.data.message}`);
    } else {
      throw new Error(`Error actualizando el bot field en Manychat: ${error.message}`);
    }
  }
}

export async function sendFlowToSubscriber(subscriberId: number) {
  try {
    const body: MSendFlow = { subscriber_id: subscriberId, flow_ns: MANYCHAT_FLOW_NS };

    await axios.post(`${MANYCHAT_API}/fb/sending/sendFlow`, body, manychatOptions);
  } catch (error) {
    if (error.response.data.message) {
      throw new Error(`Error enviando el flow al subscriber en Manychat: ${error.response.data.message}`);
    } else {
      throw new Error(`Error enviando el flow al subscriber en Manychat: ${error.message}`);
    }
  }
}
