import axios from "axios";
import { whatsappApi } from "../../utils/constants";
import { parsePhoneNumberForWhatsApp } from "../../utils/parsers";

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