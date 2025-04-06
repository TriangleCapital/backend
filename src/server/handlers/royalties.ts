import { ExcelDebtRealty, ExcelOkupaRealty, ExcelRealty } from '../../database/interfaces';
import { TRealtyType } from '../../database/interfaces/enums';
import { TDebtRealty, TOkupaRealty } from '../../database/interfaces/totalum';
import { parseExcelDebtRealtyToTotalum, parseExcelOkupaRealtyToTotalum } from '../../utils/parser';
import { completeRealtyFromExcel, existsRoyalty, filterValidRoyalties } from '../helpers/royalties';
import {
  createDebtRealty,
  createOkupaRealty,
  getAllDebtRealties,
  getAllOkupaRealties,
  updateDebtRealty,
  updateOkupaRealty,
} from '../services/totalum';

export async function handleUploadRoyalties(
  excelRoyalties: ExcelRealty[],
  realtyType: TRealtyType
): Promise<{ royaltiesUploaded: number; royaltiesOmitted: number }> {
  try {
    let realtiesUploaded = 0;
    let realtiesOmitted = 0;

    const existingRealties = realtyType === TRealtyType.Okupados ? await getAllOkupaRealties() : await getAllDebtRealties();

    const validRealties = filterValidRoyalties(excelRoyalties, realtyType);

    for (const realty of validRealties) {
      try {
        const existingRealty = existsRoyalty(existingRealties, realty);

        if (existingRealty) {
          const update = completeRealtyFromExcel(existingRealty, realty, realtyType);

          if (Object.keys(update).length > 0) {
            if (realtyType === TRealtyType.Okupados) {
              await updateOkupaRealty(existingRealty._id, update as Partial<TOkupaRealty>);
            } else {
              await updateDebtRealty(existingRealty._id, update as Partial<TDebtRealty>);
            }
          }

          realtiesOmitted++;
        } else {
          if (realtyType === TRealtyType.Okupados) {
            const parsedRoyalty = parseExcelOkupaRealtyToTotalum(realty as ExcelOkupaRealty);
            await createOkupaRealty(parsedRoyalty);
          }

          if (realtyType === TRealtyType.Deuda) {
            const parsedRoyalty = parseExcelDebtRealtyToTotalum(realty as ExcelDebtRealty);
            await createDebtRealty(parsedRoyalty);
          }

          realtiesUploaded++;
        }
      } catch (error) {
        console.error(`Error procesando el royalty: ${error.message}`);
      }
    }

    return { royaltiesUploaded: realtiesUploaded, royaltiesOmitted: realtiesOmitted };
  } catch (error) {
    console.error(`Error procesando los royalties: ${error.message}`);
  }
}
