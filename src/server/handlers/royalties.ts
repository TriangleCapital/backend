import { DebtRoyalty, OkupaRoyalty, Royalty } from '../../database/interfaces';
import { TRoyaltieType } from '../../database/interfaces/enums';
import { parseExcelDebtRealtyToTotalum, parseExcelOkupaRealtyToTotalum } from '../../utils/parser';
import { existsRoyalty, filterValidRoyalties } from '../helpers/royalties';
import { createDebtRoyalty, createOkupaRoyalty, getAllDebtRoyalties, getAllOkupaRoyalties } from '../services/totalum';

export async function handleUploadRoyalties(
  excelRoyalties: Royalty[],
  royaltyType: TRoyaltieType
): Promise<{ royaltiesUploaded: number; royaltiesOmitted: number }> {
  try {
    let royaltiesUploaded = 0;
    let royaltiesOmitted = 0;

    const existingRoyalties =
      royaltyType === TRoyaltieType.Okupados ? await getAllOkupaRoyalties() : await getAllDebtRoyalties();

    const validRoyalties = filterValidRoyalties(excelRoyalties, royaltyType);

    for (const royalty of validRoyalties) {
      try {
        if (existsRoyalty(existingRoyalties, royalty)) {
          royaltiesOmitted++;
        } else {
          if (royaltyType === TRoyaltieType.Okupados) {
            const parsedRoyalty = parseExcelOkupaRealtyToTotalum(royalty as OkupaRoyalty);
            await createOkupaRoyalty(parsedRoyalty);
          }

          if (royaltyType === TRoyaltieType.Deuda) {
            const parsedRoyalty = parseExcelDebtRealtyToTotalum(royalty as DebtRoyalty);

            await createDebtRoyalty(parsedRoyalty);
          }

          royaltiesUploaded++;
        }
      } catch (error) {
        console.error(`Error procesando el royalty: ${error.message}`);
      }
    }

    return { royaltiesUploaded, royaltiesOmitted };
  } catch (error) {
    console.error(`Error procesando los royalties: ${error.message}`);
  }
}
