import { NextFunction, Response } from 'express';
import { UploadRoyaltiesPayload } from '../../database/interfaces/import';
import { getSolviaRealties } from '../services/banks';
import { catchControllerError } from '../../errors/generalError';
import { getSolviaRealtiesFromSimpleRealties } from '../handlers/banks';
import { doserRealties } from '../helpers/realtiesDoser';
import { parseSolviaRealtyToDb } from '../helpers/bankParsers';
import { getAllOkupaRealties } from '../services/totalum';

export async function getAllSolviaRealties(req: UploadRoyaltiesPayload, res: Response, next: NextFunction) {
  try {
    const { postalCode } = req.params;

    const result = await getSolviaRealties(postalCode);

    res.status(200).json(result);
  } catch (error) {
    catchControllerError(error, 'Error procesando los activos de Solvia en el controlador', req.body, next);
  }
}

export async function updateSolviaRealties(req: UploadRoyaltiesPayload, res: Response, next: NextFunction) {
  try {
    const { postalCode } = req.params;

    const allDbRealties = await getAllOkupaRealties();

    const allSimpleRealties = await getSolviaRealties(postalCode);
    const allExtendedRealties = await getSolviaRealtiesFromSimpleRealties(allSimpleRealties);

    const result = await doserRealties({
      bankRealties: allExtendedRealties,
      dbRealties: allDbRealties,
      mapFetchedToDb: parseSolviaRealtyToDb,
    });

    const { created, updated, deleted, omitted } = result;

    res.status(200).json(result);
  } catch (error) {
    catchControllerError(error, 'Error procesando los activos de Solvia en el controlador', req.body, next);
  }
}
