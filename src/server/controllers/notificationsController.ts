import { NextFunction, Request, Response } from 'express';
import { sendEmail } from '../services/nodemailer';
import { catchControllerError } from '../../errors/generalError';

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
