import { NextFunction, Request, Response } from 'express';
import { catchControllerError } from '../../errors/generalError';
import { handleExcelLeads } from '../handlers/leads';

export async function processExcelLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];
    const { realtyLink } = req.body;

    if (!files || files.length === 0 || !realtyLink) {
      res.status(400).send(`No se ha recibido ningún archivo o enlace de propiedad.`);
      return;
    }

    const { leadsProcessed, leadsOmitted } = await handleExcelLeads(files[0], realtyLink);

    res.status(200).json({ success: true, leadsProcessed, leadsOmitted });
  } catch (error) {
    catchControllerError(error, 'Error procesando el excel de leads en el controlador', req.body, next);
  }
}
