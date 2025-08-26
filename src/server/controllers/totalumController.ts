import { NextFunction, Request, Response } from 'express';
import { catchControllerError } from '../../errors/generalError';
import { handleExcelLeads } from '../handlers/leads';
import { CreateEvaluationForm, CreateMrfPdfForm, UploadRoyaltiesPayload } from '../../database/interfaces/import';
import { handleUploadRealties } from '../handlers/realties';
import { getSolviaRealties } from '../services/banks';
import { createTEvaluationForm, createTMrfPdfForm, getFilteredPersons, getTFile, updateTFile } from '../services/totalum';
import { TOTALUM_MRF_PDF_FILE_ID } from '../../utils/constants';
import { TPersonAutomaticMessaging, TPersonRole } from '../../database/interfaces/enums';
import { parsePhoneNumberForWhatsApp, sanitizeWhatsAppId } from '../../utils/parser';
import { investorMessages, okupaMessages } from '../../utils/lists';
import {
  getGroupMembers,
  sendWhatsappMessage,
  sendZApiWhatsappMessage,
} from '../services/whatsapp';
import { sleep } from '../../utils/funcs';

export async function processExcelLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];
    const { realtyLink, flowNumber } = req.body;

    if (!files || files.length === 0 || !realtyLink) {
      res.status(400).send(`No se ha recibido ningún archivo o enlace de propiedad.`);
      return;
    }

    const { leadsProcessed, leadsOmitted } = await handleExcelLeads(files[0], realtyLink, flowNumber);

    res.status(200).json({ success: true, leadsProcessed, leadsOmitted });
  } catch (error) {
    catchControllerError(error, 'Error procesando el excel de leads en el controlador', req.body, next);
  }
}

export async function uploadExcelRealties(req: UploadRoyaltiesPayload, res: Response, next: NextFunction) {
  try {
    const { royalties, fund, royaltyType, resetRealties, setRealtiesAsNew } = req.body;

    const { realtiesUploaded, realtiesUpdated, realtiesOmitted } = await handleUploadRealties(
      fund,
      royalties,
      royaltyType,
      resetRealties,
      setRealtiesAsNew
    );

    res.status(200).json({ success: true, realtiesUploaded, realtiesUpdated, realtiesOmitted });
  } catch (error) {
    catchControllerError(error, 'Error procesando el excel de activos en el controlador', req.body, next);
  }
}

export async function createEvaluationForm(req: CreateEvaluationForm, res: Response, next: NextFunction) {
  try {
    const createdId = await createTEvaluationForm(req.body);

    res.status(200).json({ success: true, createdEvaluationFormId: createdId });
  } catch (error) {
    catchControllerError(error, 'Error creando el evaluation form desde controller', req.body, next);
  }
}

export async function createMrfPdfForm(req: CreateMrfPdfForm, res: Response, next: NextFunction) {
  try {
    const createdId = await createTMrfPdfForm(req.body);

    res.status(200).json({ success: true, createdEvaluationFormId: createdId });
  } catch (error) {
    catchControllerError(error, 'Error creando el mrf pdf form desde controller', req.body, next);
  }
}

export async function getMrfPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const file = await getTFile(TOTALUM_MRF_PDF_FILE_ID);

    const pdfUrl = file?.archivo?.[0]?.url;

    res.status(200).json({ success: true, pdfUrl });
  } catch (error) {
    catchControllerError(error, 'Error obteniendo el pdf de mrf desde controller', req.body, next);
  }
}

export async function updateDocumentViewedNumber(req: Request, res: Response, next: NextFunction) {
  try {
    const { documentId } = req.body;

    const file = await getTFile(documentId);
    const fileDownloadCount = file?.numero_descargas || 0;

    await updateTFile(documentId, { numero_descargas: fileDownloadCount + 1 });

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error obteniendo el pdf de mrf desde controller', req.body, next);
  }
}

export async function sendMessageToOkupas(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = [{ rol: TPersonRole.Okupa }, { mensajes_automatico: TPersonAutomaticMessaging.Activo }];

    const okupasPhoneNumbers = (await getFilteredPersons(filters)).map((okupa) => okupa.telefono).filter(Boolean);

    const parsedPhones = okupasPhoneNumbers.map((phone) => parsePhoneNumberForWhatsApp(phone));

    for (const phone of parsedPhones) {
      if (!phone) continue;

      try {
        const options = { phoneNumber: phone, message: okupaMessages.one };
        await sendWhatsappMessage(options);

        sleep(300);
      } catch (error) {
        console.error(`Error enviando mensaje a ${phone}:`, error);
        continue;
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error enviando el mensaje a los okupas', req.body, next);
  }
}

export async function sendMessageToGroupMembers(req: Request, res: Response, next: NextFunction) {
  try {
    const { groupChatId, chatIdsToAvoid, fromContactNumber, toContactNumber, instanceId, instanceToken } = req.body;

    if (!groupChatId) {
      res.status(400).send('No se ha proporcionado el ID del grupo de WhatsApp.');
      return;
    }

    const groupMembers = await getGroupMembers(groupChatId);

    const membersChatIds = groupMembers
      .map((member: any) => member.id._serialized)
      .filter((chatId: string) => {
        return chatId && !chatIdsToAvoid.includes(chatId);
      })
      .slice(fromContactNumber, toContactNumber);

    for (const chatId of membersChatIds) {
      const number = sanitizeWhatsAppId(chatId);
      if (!number) continue;

      try {
        await sleep(5000);
        await sendZApiWhatsappMessage({ phoneNumber: number, message: investorMessages.one, instanceId, instanceToken });
      } catch (error) {
        throw new Error(`Error enviando mensaje a ${chatId}: ${error.message}`);
      }
    }

    res.status(200).json({ success: true, membersChatIds });
  } catch (error) {
    catchControllerError(error, 'Error enviando el mensaje a los okupas', req.body, next);
  }
}

export async function sendMessageToChatIds(req: Request, res: Response, next: NextFunction) {
  try {
    const { chatIds, chatIdsToAvoid, fromNumber, toNumber, instanceId, instanceToken } = req.body;

    const membersChatIds = chatIds
      .filter((chatId: string) => {
        return chatId && !chatIdsToAvoid.includes(chatId);
      })
      .slice(fromNumber, toNumber);

    for (const chatId of membersChatIds) {
      const number = sanitizeWhatsAppId(chatId);
      if (!number) continue;

      try {
        await sleep(5000);
        await sendZApiWhatsappMessage({ phoneNumber: number, message: investorMessages.one, instanceId, instanceToken });
      } catch (error) {
        throw new Error(`Error enviando mensaje a ${chatId}: ${error.message}`);
      }
    }

    res.status(200).json({ success: true, membersChatIds });
  } catch (error) {
    catchControllerError(error, 'Error enviando el mensaje a los chat ids', req.body, next);
  }
}

export async function getGroupMembersChatIds(req: Request, res: Response, next: NextFunction) {
  try {
    const { groupChatId } = req.body;

    if (!groupChatId) {
      res.status(400).send('No se ha proporcionado el ID del grupo de WhatsApp.');
      return;
    }

    const groupMembers = await getGroupMembers(groupChatId);

    const membersChatIds = groupMembers.map((member: any) => member.id._serialized);

    res.status(200).json({ success: true, membersChatIds });
  } catch (error) {
    catchControllerError(error, 'Error enviando el mensaje a los okupas', req.body, next);
  }
}
