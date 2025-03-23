import { DebtRoyalty, OkupaRoyalty, Royalty } from '../../database/interfaces';
import { TRoyaltieType } from '../../database/interfaces/enums';
import { parseExcelOkupaRealtyToTotalum } from '../../utils/parser';
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

    const validRoyalties = filterValidRoyalties(excelRoyalties);

    for (const royalty of validRoyalties) {
      if (existsRoyalty(existingRoyalties, royalty)) {
        royaltiesOmitted++;
      } else {
        if (royaltyType === TRoyaltieType.Okupados) {
          const parsedRoyalty = parseExcelOkupaRealtyToTotalum(royalty as OkupaRoyalty);
          await createOkupaRoyalty(parsedRoyalty);
        }

        if (royaltyType === TRoyaltieType.Deuda) {
          await createDebtRoyalty(royalty as DebtRoyalty);
        }

        royaltiesUploaded++;
      }
    }

    return { royaltiesUploaded, royaltiesOmitted };
  } catch (error) {
    console.error(`Error procesando los royalties: ${error.message}`);
  }
}
