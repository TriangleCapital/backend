import { ExcelRealty } from '../../database/interfaces';
import { TBank, TRealtyType } from '../../database/interfaces/enums';
import {
  filterValidRoyalties as filterValidRealties,
  processRealtiesUpload,
  resetRealtiesStateNew,
} from '../helpers/realties';
import { getAllDebtRealties, getAllOkupaRealties } from '../services/totalum';

export async function handleUploadRealties(
  fund: TBank,
  excelRoyalties: ExcelRealty[],
  realtyType: TRealtyType,
  resetRealties: boolean,
  setRealtiesAsNew: boolean
): Promise<{ realtiesUploaded: number; realtiesUpdated: number; realtiesOmitted: number }> {
  try {
    const existingRealties = realtyType === TRealtyType.Okupados ? await getAllOkupaRealties() : await getAllDebtRealties();

    const validRealties = filterValidRealties(excelRoyalties);

    const { realtiesUploaded, realtiesUpdated, realtiesOmitted } = await processRealtiesUpload(
      realtyType,
      existingRealties,
      validRealties,
      setRealtiesAsNew,
      fund
    );

    if (resetRealties) await resetRealtiesStateNew(existingRealties, realtyType, fund);

    return { realtiesUploaded, realtiesUpdated, realtiesOmitted };
  } catch (error) {
    console.error(`Error procesando los royalties: ${error.message}`);
  }
}
