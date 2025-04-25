import { ExcelRealty } from '../../database/interfaces';
import { TFund, TRealtyType } from '../../database/interfaces/enums';
import {
  filterValidRoyalties as filterValidRealties,
  processRealtiesUpload,
  resetRealtiesStateNew,
} from '../helpers/royalties';
import { getAllDebtRealties, getAllOkupaRealties } from '../services/totalum';

export async function handleUploadRealties(
  fund: TFund,
  excelRoyalties: ExcelRealty[],
  realtyType: TRealtyType,
  resetRealties: boolean,
  setRealtiesAsNew: boolean
): Promise<{ royaltiesUploaded: number; royaltiesOmitted: number }> {
  try {
    const existingRealties = realtyType === TRealtyType.Okupados ? await getAllOkupaRealties() : await getAllDebtRealties();

    const validRealties = filterValidRealties(excelRoyalties);

    const { royaltiesUploaded, royaltiesOmitted } = await processRealtiesUpload(
      realtyType,
      existingRealties,
      validRealties,
      setRealtiesAsNew,
      fund
    );

    if (resetRealties) await resetRealtiesStateNew(existingRealties, realtyType, fund);

    return { royaltiesUploaded, royaltiesOmitted };
  } catch (error) {
    console.error(`Error procesando los royalties: ${error.message}`);
  }
}
