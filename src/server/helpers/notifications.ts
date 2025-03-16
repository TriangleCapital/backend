import { TLeadFinanciacion } from '../../database/interfaces/enums';
import { TLeadAlContado, TLeadHipoteca } from '../../database/interfaces/totalum';
import { generateContadoLeadEmailHtmlMessage, generateHipotecaLeadEmailHtmlMessage } from '../../utils/funcs';
import { sendEmail } from '../services/nodemailer';

export async function sendCompletedChatbotEmail(
  receiverEmail: string,
  leadType: TLeadFinanciacion,
  lead: Partial<TLeadHipoteca> | Partial<TLeadAlContado>
) {
  try {
    const subject = `✅ Chatbot completado por ${lead.nombre}: ${leadType}`;

    let htmlMessage = '';

    if (leadType === TLeadFinanciacion.Hipoteca) {
      htmlMessage = generateHipotecaLeadEmailHtmlMessage(lead as Partial<TLeadHipoteca>);
    }

    if (leadType === TLeadFinanciacion.AlContado) {
      htmlMessage = generateContadoLeadEmailHtmlMessage(lead as Partial<TLeadAlContado>);
    }

    console.log('sending email ', )

    await sendEmail(receiverEmail, subject, htmlMessage);
  } catch (error) {
    throw new Error(`Error enviando el email del chatbot completado: ${error.message}`);
  }
}
