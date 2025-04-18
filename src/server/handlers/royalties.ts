import { ExcelRealty } from '../../database/interfaces';
import { TRealtyType } from '../../database/interfaces/enums';
import {
  filterValidRoyalties as filterValidRealties,
  processRealtiesUpload,
  resetRealtiesStateNew,
} from '../helpers/royalties';
import { getAllDebtRealties, getAllOkupaRealties } from '../services/totalum';

export async function handleUploadRealties(
  excelRoyalties: ExcelRealty[],
  realtyType: TRealtyType,
  resetRealties: boolean,
  setRealtiesAsNew: boolean
): Promise<{ royaltiesUploaded: number; royaltiesOmitted: number }> {
  try {
    const existingRealties = realtyType === TRealtyType.Okupados ? await getAllOkupaRealties() : await getAllDebtRealties();

    const validRealties = filterValidRealties(excelRoyalties, realtyType);

    const { royaltiesUploaded, royaltiesOmitted } = await processRealtiesUpload(realtyType, existingRealties, validRealties, setRealtiesAsNew);

    if (resetRealties) await resetRealtiesStateNew(existingRealties, realtyType);

    return { royaltiesUploaded, royaltiesOmitted };
  } catch (error) {
    console.error(`Error procesando los royalties: ${error.message}`);
  }
}
