import axios from 'axios';
import { TLead } from '../../database/interfaces/totalum';
import { MANYCHAT_API, manychatOptions } from '../../utils/constants';
import { parseLeadFromTotalumToManychat } from '../../utils/parser';

export async function createSubscriber(lead: Partial<TLead>) {
  try {
    const subscriber = parseLeadFromTotalumToManychat(lead);

    await axios.post(`${MANYCHAT_API}/fb/subscriber/createSubscriber`, subscriber, manychatOptions);
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
    const options: MBotField = { field_id: botFieldId, field_value: newValue };

    const result = await axios.post(`${MANYCHAT_API}/fb/page/setBotField`, options, manychatOptions);
    console.log(result.data);
  } catch (error) {
    if (error.response.data.message) {
      throw new Error(`Error actualizando el bot field en Manychat: ${error.response.data.message}`);
    } else {
      throw new Error(`Error actualizando el bot field en Manychat: ${error.message}`);
    }
  }
}
