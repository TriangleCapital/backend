import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import CustomError from '../../errors/CustomError';
import { getAllOkupaRealties, removeOkupaRealty, updateOkupaRealty } from '../services/totalum';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.body;

    const royalties: any[] = await getAllOkupaRealties();

    for (const realty of royalties) {
      const formattedRefActivo = realty?.ref_activo?.trim();
      const formattedRefFondo = realty?.ref_fondo?.trim();

      if (formattedRefFondo?.length === 18) {
        try {

          await updateOkupaRealty(realty._id, { ref_activo: formattedRefFondo, ref_fondo: formattedRefActivo });
          console.info('Updated realty:', realty._id, 'with ref_activo:', formattedRefFondo, 'and ref_fondo:', formattedRefActivo);
        } catch (error) {
          console.error(`Error updating realty ${realty._id}: ${error.message}`);
        }
      }
    }

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
