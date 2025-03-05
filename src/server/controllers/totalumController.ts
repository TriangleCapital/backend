import { NextFunction, Request, Response } from 'express';
import { catchControllerError } from '../../errors/generalError';
import { handleExcelLeads } from '../handlers/leads';
import { getAllLeads, updateLead } from '../services/totalum';
import { formatPhoneNumber } from '../../utils/parser';
import { email } from '../../utils/constants';
import { sendEmail } from '../services/nodemailer';
import { generateLeadEmail } from '../../utils/funcs';

export async function processExcelLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).send(`No se ha recibido ningún archivo. Archivos: ${files}`);
      return;
    }

    const leadsProcessed = await handleExcelLeads(files[0]);

    res.status(200).json({ success: true, leadsProcessed });
  } catch (error) {
    catchControllerError(error, 'Error procesando el excel de leads en el controlador', req.body, next);
  }
}

export async function updateLeadByPhoneNumber(req: Request, res: Response, next: NextFunction) {
  try {
    const { phoneNumber, update } = req.body;

    if (!phoneNumber) {
      res.status(400).send(`No se ha recibido ningún teléfono`);
      return;
    }

    const allLeads = await getAllLeads();
    const lead = allLeads.find((l) => formatPhoneNumber(l.telefono) === formatPhoneNumber(phoneNumber));

    await updateLead(lead._id, update);

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error actualizando el lead en el controlador', req.body, next);
  }
}

export async function sendEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const { to, subject, message } = req.body;

    if (!to || !message) {
      res.status(400).send(`Falta el destinatario o el mensaje`);
      return;
    }

    await sendEmail(to, subject, message);

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error enviando el email', req.body, next);
  }
}

export async function sendChatbotCompletedEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { leadPhoneNumber, receiverEmail } = req.body;

    if (!leadPhoneNumber) {
      res.status(400).send(`Falta el teléfono`);
      return;
    }

    const allLeads = await getAllLeads();
    const lead = allLeads.find((l) => formatPhoneNumber(l.telefono) === formatPhoneNumber(leadPhoneNumber));

    const subject = `✅ Chatbot completado por ${lead.nombre}`;
    const message = generateLeadEmail(lead);

    await sendEmail(receiverEmail, subject, message);

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error enviando el email', req.body, next);
  }
}
