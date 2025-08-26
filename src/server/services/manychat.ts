import axios from 'axios';
import { MANYCHAT_API, MANYCHAT_FLOW_NS, manychatOptions } from '../../utils/constants';
import { parseLeadFromTotalumToManychat } from '../../utils/parser';
import { TLeadShared } from '../../database/interfaces/totalum';
import { MBotField, MSendFlow } from '../../database/interfaces/manychat';

export async function createSubscriber(lead: Partial<TLeadShared>): Promise<number> {
  try {
    const subscriber = parseLeadFromTotalumToManychat(lead);

    const response = await axios.post(`${MANYCHAT_API}/fb/subscriber/createSubscriber`, subscriber, manychatOptions);
    const id = Number(response.data.data.id);

    return id;
  } catch (error) {
    if (error.response.data) {
      throw new Error(`Error creando el subscriber en Manychat a: ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error(`Error creando el subscriber en Manychat b: ${error.message}`);
    }
  }
}

export async function updateSubscriberCustomField(subscriber_id: number, field_id: number, field_value: any) {
  try {
    if (!subscriber_id || !field_id) {
      throw new Error('No se ha proporcionado el subscriber_id o field_id para actualizar el campo de usuario en Manychat');
    }
    
    const options = { subscriber_id, field_id, field_value };

    await axios.post(`${MANYCHAT_API}/fb/subscriber/setCustomField`, options, manychatOptions);
  } catch (error) {
    if (error.response.data) {
      throw new Error(`Error actualizando el campo de usuario en Manychat a: ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error(`Error actualizando el campo de usuario en Manychat b: ${error.message}`);
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
