import axios from 'axios';
import { FundDiscounts, TFund } from '../database/interfaces/enums';
import { whatsappApi } from './constants';
import { parsePhoneNumberForWhatsApp } from './parsers';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

export function calculatePrecioVenta(precioInicial: number, fund: TFund): number {
  const discountPercentage = FundDiscounts[fund] ?? 0;
  const discountAmount = precioInicial * (discountPercentage / 100);
  return Math.floor(precioInicial - discountAmount);
}