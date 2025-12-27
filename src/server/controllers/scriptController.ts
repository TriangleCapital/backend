import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import CustomError from '../../errors/CustomError';
import { filterOkupaRealtiesFromBank } from '../helpers/banks';
import { getNeedsReformFromSolviaRealty } from '../helpers/bankParsers';
import { getAllOkupaRealties, updateOkupaRealty } from '../services/totalum';

const totalumSdk = new TotalumApiSdk(totalumOptions);

type OkupaRecord = {
  _id: string;
  notas?: string | null;
};

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
    const all = (await getAllOkupaRealties()) as any[];

    let matched = 0;
    let updated = 0;
    const failures: { id: string; error: string }[] = [];

    for (const v of all) {
      const validacion = (v.validacion || '').trim();
      const notas = v.notas || '';

      // CONDICIÓN NUEVA
      const isAprOrAnr = validacion === 'APR' || validacion === 'ANR';
      const hasAeAsignado = notas.includes('AE asignado:');

      if (!isAprOrAnr || !hasAeAsignado) continue;

      matched++;

      try {
        await updateOkupaRealty(v._id, {
          notas: '', // ← BORRADO TOTAL
        });
        updated++;
      } catch (e) {
        failures.push({
          id: v._id,
          error: e instanceof Error ? e.message : 'Error desconocido',
        });
      }
    }

    const result = {
      scanned: all.length,
      matched,
      updated,
      failed: failures.length,
      failures,
    };

    res.status(200).json(result);
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
