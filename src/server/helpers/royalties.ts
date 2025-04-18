import { ExcelDebtRealty, ExcelOkupaRealty, ExcelRealty } from '../../database/interfaces';
import { EstadoNegociacionDeuda, EstadoNegociacionOkupa, TRealtyType } from '../../database/interfaces/enums';
import { TDebtRealty, TOkupaRealty, TRealty } from '../../database/interfaces/totalum';
import { parseExcelDebtRealtyToTotalum, parseExcelOkupaRealtyToTotalum } from '../../utils/parser';
import { createDebtRealty, createOkupaRealty, updateDebtRealty, updateOkupaRealty } from '../services/totalum';

export async function processRealtiesUpload(realtyType: TRealtyType, existingRealties: TRealty[], validRealties: ExcelRealty[], setRealtiesAsNew: boolean) {
  try {
    let realtiesUploaded = 0;
    let realtiesOmitted = 0;

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
                const parsedRoyalty = parseExcelOkupaRealtyToTotalum(realty as ExcelOkupaRealty, setRealtiesAsNew);
                await createOkupaRealty(parsedRoyalty);
              }
    
              if (realtyType === TRealtyType.Deuda) {
                const parsedRoyalty = parseExcelDebtRealtyToTotalum(realty as ExcelDebtRealty, setRealtiesAsNew);
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
    throw new Error(`Error procesando la subida de las propiedades: ${error.message}`);
  }
}

export function existsRoyalty(allExistentRoyalties: TRealty[], newRoyalty: ExcelRealty): TRealty | false {
  try {
    if (!newRoyalty.direccion_completa) return false;

    const formattedNewDireccion = newRoyalty.direccion_completa.trim().toLowerCase();

    const existingRoyalty = allExistentRoyalties.find((royalty) => {
      const formattedDireccion = royalty.direccion_completa?.trim().toLowerCase();
      return formattedDireccion === formattedNewDireccion || royalty.ref_catastral === newRoyalty.ref_catastral;
    });

    return existingRoyalty || false;
  } catch (error) {
    throw new Error(`Error checking if royalty exists: ${(error as Error).message}`);
  }
}

export async function resetRealtiesStateNew(realties: TRealty[], realtyType: TRealtyType): Promise<void> {
  try {
    for (const realty of realties) {
      if (realtyType === TRealtyType.Okupados && realty.estado_negociacion === EstadoNegociacionOkupa.Nuevo) {
        await updateOkupaRealty(realty._id, { estado_negociacion: '' as EstadoNegociacionOkupa });
      } else if (realtyType === TRealtyType.Deuda && realty.estado_negociacion === EstadoNegociacionDeuda.Nuevo) {
        await updateDebtRealty(realty._id, { estado_negociacion: '' as EstadoNegociacionDeuda });
      }
    }
  } catch (error) {
    throw new Error(`No se ha podido resetear el estado del inmueble: ${error.message}`);
  }
}

export function filterValidRoyalties(royalties: ExcelRealty[], royaltyType: TRealtyType): ExcelRealty[] {
  try {
    const filteredRoyalties = royalties.filter(
      (royalty) => royalty && royalty.direccion_completa && royalty.direccion_completa.trim() !== ''
    );

    // if (royaltyType === TRealtyType.Deuda) {
    //   return filteredRoyalties.filter(
    //     (royalty: ExcelDebtRealty) => typeof royalty.diferencia_precio === 'number' && royalty.diferencia_precio > 0
    //   );
    // }

    return filteredRoyalties;
  } catch (error) {
    throw new Error(`Error filtering valid royalties: ${error.message}`);
  }
}

export function completeRealtyFromExcel(
  existing: TRealty,
  incoming: ExcelRealty,
  realtyType: TRealtyType
): Partial<TOkupaRealty> | Partial<TDebtRealty> {
  const isEmpty = (val: any) => val === undefined || val === null || val === '' || val === 0;

  if (realtyType === TRealtyType.Okupados) {
    const okupa = incoming as ExcelOkupaRealty;
    const existingOkupa = existing as TOkupaRealty;
    const update: Partial<TOkupaRealty> = {};

    if (isEmpty(existingOkupa.direccion_completa) && okupa.direccion_completa)
      update.direccion_completa = okupa.direccion_completa;

    if (isEmpty(existingOkupa.ref_catastral) && okupa.ref_catastral) update.ref_catastral = okupa.ref_catastral;

    if (isEmpty(existingOkupa.tipo_okupa) && okupa.tipo_okupa) update.tipo_okupa = okupa.tipo_okupa;

    if (isEmpty(existingOkupa.precio_inicial) && okupa.precio_inicial) update.precio_inicial = okupa.precio_inicial;

    if (isEmpty(existingOkupa.fase_okupacion) && okupa.fase_okupacion) update.fase_okupacion = okupa.fase_okupacion;

    if (isEmpty(existingOkupa.provincia) && okupa.provincia) update.provincia = okupa.provincia;

    if (isEmpty(existingOkupa.comarca) && okupa.comarca) update.comarca = okupa.comarca;

    if (isEmpty(existingOkupa.codigo_postal) && okupa.codigo_postal) update.codigo_postal = okupa.codigo_postal;

    return update;
  }

  if (realtyType === TRealtyType.Deuda) {
    const deuda = incoming as ExcelDebtRealty;
    const existingDeuda = existing as TDebtRealty;
    const update: Partial<TDebtRealty> = {};

    if (isEmpty(existingDeuda.direccion_completa) && deuda.direccion_completa)
      update.direccion_completa = deuda.direccion_completa;

    if (isEmpty(existingDeuda.ref_catastral) && deuda.ref_catastral) update.ref_catastral = deuda.ref_catastral;

    if (isEmpty(existingDeuda.uf) && deuda.uf) update.uf = deuda.uf;

    if (isEmpty(existingDeuda.valor_deuda) && deuda.valor_deuda) update.valor_deuda = deuda.valor_deuda;

    if (isEmpty(existingDeuda.valor_venta) && deuda.valor_venta) update.valor_venta = deuda.valor_venta;

    if (isEmpty(existingDeuda.valor_tasacion) && deuda.valor_tasacion) update.valor_tasacion = deuda.valor_tasacion;

    if (isEmpty(existingDeuda.fase_deuda) && deuda.fase_deuda) update.fase_deuda = deuda.fase_deuda;

    if (isEmpty(existingDeuda.enlace_idealista) && deuda.enlace_idealista) update.enlace_idealista = deuda.enlace_idealista;

    return update;
  }

  return {};
}
