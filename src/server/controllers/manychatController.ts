import { NextFunction, Request, Response } from 'express';
import { CompletedChatbotPayload, HandleManychatInteractionPayload } from '../../database/interfaces/import';
import { catchControllerError } from '../../errors/generalError';
import { handleCompletedChatbot, handleManychatInteraction } from '../handlers/leads';
import { getFlows } from '../services/manychat';

export async function receiveManychatInteraction(req: HandleManychatInteractionPayload, res: Response, next: NextFunction) {
  try {
    const { phoneNumber, contactData } = req.body;

    if (!phoneNumber) {
      res.status(400).send(`No se ha recibido ningún teléfono`);
      return;
    }

    await handleManychatInteraction(phoneNumber, contactData);

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error actualizando el lead en el controlador', req.body, next);
  }
}

export async function completedChatbotController(req: CompletedChatbotPayload, res: Response, next: NextFunction) {
  try {
    const { leadPhoneNumber, receiverEmail, contactData } = req.body;

    if (!leadPhoneNumber) {
      res.status(400).send(`Falta el teléfono`);
      return;
    }

    await handleCompletedChatbot(leadPhoneNumber, contactData, receiverEmail);

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error enviando el email', req.body, next);
  }
}

export async function getManychatFlows(req: Request, res: Response, next: NextFunction) {
  try {
    const flows = await getFlows();

    res.status(200).json({ success: true, flows });
  } catch (error) {
    catchControllerError(error, 'Error actualizando el lead en el controlador', req.body, next);
  }
}
