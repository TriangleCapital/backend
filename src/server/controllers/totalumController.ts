import { NextFunction, Request, Response } from 'express';
import { catchControllerError } from '../../errors/generalError';
import { handleExcelLeads } from '../handlers/leads';

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
    catchControllerError(error, 'Error toggling totalum header content', req.body, next);
  }
}
