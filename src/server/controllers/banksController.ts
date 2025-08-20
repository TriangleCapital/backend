import { NextFunction, Response } from 'express';
import { UploadRoyaltiesPayload } from '../../database/interfaces/import';
import { getSolviaRealties } from '../services/banks';
import { catchControllerError } from '../../errors/generalError';

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
