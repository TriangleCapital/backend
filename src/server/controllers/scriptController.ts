import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { TOTALUM_MRF_PDF_FILE_ID, totalumOptions } from '../../utils/constants';
import CustomError from '../../errors/CustomError';
import { getAllOkupaRealties, getTFile, removeOkupaRealty, updateOkupaRealty, updateTFile } from '../services/totalum';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.body;

    const file = await getTFile('6891a3f9fc887572d452d232');
    const fileDownloadCount = file?.numero_descargas || 0;

    await updateTFile('6891a3f9fc887572d452d232', { numero_descargas: fileDownloadCount + 1 });


    res.status(200).json(true);
  } catch (error) {
    console.error(error.message);
    const finalError = new CustomError(
      400,
      `Error running script. ${error.message}.`,
      `Error running script. ${error.message}.`
    );
    next(finalError);
  }
}

export async function runSecondScript(req: Request, res: Response, next: NextFunction) {
  try {
    await totalumSdk.crud.createItem('pedido', {
      matricula: '9999999',
      socio_profesional: '669cca57ab9b3aabb59ace26',
    });

    res.status(200).json({ client: true });
  } catch (error) {
    console.error(error.message);
    const finalError = new CustomError(
      400,
      'Error generating invoices.',
      `Error generating invoices.
      ${error}.`
    );
    next(finalError);
  }
}
