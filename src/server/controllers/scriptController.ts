import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import CustomError from '../../errors/CustomError';
import { filterOkupaRealtiesFromBank } from '../helpers/banks';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { realties } = req.body;

    const filtered = filterOkupaRealtiesFromBank(realties)


    res.status(200).json(filtered);
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
