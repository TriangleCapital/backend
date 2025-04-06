import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import CustomError from '../../errors/CustomError';
import { getAllOkupaRealties, removeOkupaRealty } from '../services/totalum';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.body;

    const royalties: any[] = await getAllOkupaRealties();

    for (let i = 0; i < royalties.length; i++) {
      const royalty = royalties[i];

      // Format the string to lowercase and trim spaces before comparison
      const formattedDireccion = royalty.direccion_completa.trim().toLowerCase();

      for (let j = i + 1; j < royalties.length; j++) {
        const sub = royalties[j];

        // Format the string of sub as well
        const formattedSubDireccion = sub.direccion_completa.trim().toLowerCase();

        if (formattedDireccion === formattedSubDireccion) {
          // Determine which one to keep
          if (!royalty.ref_catastral && sub.ref_catastral) {
            await removeOkupaRealty(royalty._id); // Remove the current one
            royalties.splice(i, 1); // Remove from array
            i--; // Adjust index after removal
            break; // Exit inner loop and restart checking from this index
          } else {
            await removeOkupaRealty(sub._id); // Remove the duplicate
            royalties.splice(j, 1); // Remove from array
            j--; // Adjust index after removal
          }
        }
      }
    }

    console.log(royalties);

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
