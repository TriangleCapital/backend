import axios from 'axios';
import { whatsappApi, ZAPI_API, ZAPI_CLIENT_TOKEN } from '../../utils/constants';
import { parsePhoneNumberForWhatsApp } from '../../utils/parsers';

export async function sendWhatsappMessage({ phoneNumber, message }: { phoneNumber: string; message: string }) {
  try {
    const formattedPhoneNumber = parsePhoneNumberForWhatsApp(phoneNumber);

    const endpoint = `${whatsappApi}/messages/send`;
    const options = { phoneNumber: formattedPhoneNumber, message };

    const response = await axios.post(endpoint, options);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error enviando el mensaje de whatsapp: ${error.response}`);
    } else {
      throw new Error(`Error enviando el mensaje de whatsapp: ${error.response}`);
    }
  }
}

export async function sendWhatsappMessageToChatId({ chatId, message }: { chatId: string; message: string }) {
  try {
    const endpoint = `${whatsappApi}/messages/send-any-chat`;
    const options = { chatId, message };

    const response = await axios.post(endpoint, options);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error enviando el mensaje de whatsapp al chat id: ${error.response}`);
    } else {
      throw new Error(`Error enviando el mensaje de whatsapp al chat id: ${error.response}`);
    }
  }
}

export async function sendWhatsappMessagesToChatIds(chatIds: string[], message: string) {
  try {
    const endpoint = `${whatsappApi}/messages/send-messages-to-chat-ids`;
    const options = { chatIds, message };

    const response = await axios.post(endpoint, options);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error enviando el mensaje de whatsapp: ${error.response}`);
    } else {
      throw new Error(`Error enviando el mensaje de whatsapp: ${error.response}`);
    }
  }
}

export async function getGroupMembers(chatId: string) {
  try {
    const endpoint = `${whatsappApi}/messages/group-members/${chatId}`;

    const response = await axios.get(endpoint);

    return response.data.participants;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error obteniendo los miembros del grupo de whatsapp: ${error.response}`);
    } else {
      throw new Error(`Error obteniendo los miembros del grupo de whatsapp: ${error.message}`);
    }
  }
}

export async function sendZApiWhatsappMessage({
  phoneNumber,
  message,
  instanceId,
  instanceToken,
}: {
  phoneNumber: string;
  message: string;
  instanceId: string;
  instanceToken: string;
}) {
  try {
    const formattedPhoneNumber = parsePhoneNumberForWhatsApp(phoneNumber);

    const endpoint = `${ZAPI_API}/instances/${instanceId}/token/${instanceToken}/send-text`;

    const options = { phone: formattedPhoneNumber, message };
    const headers = {
      'Client-Token': ZAPI_CLIENT_TOKEN,
    };

    const response = await axios.post(endpoint, options, { headers });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error enviando el mensaje de whatsapp mediante z-api: ${error.response}`);
    } else {
      throw new Error(`Error enviando el mensaje de whatsapp mediante z-api: ${error.response}`);
    }
  }
}
