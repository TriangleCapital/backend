import { NextFunction, Request, Response } from 'express';
import { catchControllerError } from '../../errors/generalError';
import { handleExcelLeads } from '../handlers/leads';
import { CreateEvaluationForm, CreateMrfPdfForm, UploadRoyaltiesPayload } from '../../database/interfaces/import';
import { handleUploadRealties } from '../handlers/royalties';
import { getSolviaRealties } from '../services/funds';
import { createTEvaluationForm, createTMrfPdfForm } from '../services/totalum';

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

export async function uploadExcelRoyalties(req: UploadRoyaltiesPayload, res: Response, next: NextFunction) {
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

export async function uploadSolviaRoyalties(req: UploadRoyaltiesPayload, res: Response, next: NextFunction) {
  try {
    const { postalCode } = req.params;

    // const result: SolviaResult = {
    //   emptyRealties: { realtiesStock: 0, realtiesUploaded: 0, realtiesUpdated: 0, realtiesOmitted: 0 },
    //   okupaRealties: { realtiesStock: 0, realtiesUploaded: 0, realtiesUpdated: 0, realtiesOmitted: 0 },
    //   rentRealties: { realtiesStock: 0, realtiesUploaded: 0, realtiesUpdated: 0, realtiesOmitted: 0 },
    // };

    const result = await getSolviaRealties(postalCode);

    res.status(200).json(result);
  } catch (error) {
    catchControllerError(error, 'Error procesando los activos de Solvia en el controlador', req.body, next);
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
    catchControllerError(error, 'Error creando el evaluation form desde controller', req.body, next);
  }
}
