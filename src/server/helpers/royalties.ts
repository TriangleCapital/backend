import { ExcelDebtRealty, ExcelOkupaRealty, ExcelRealty } from '../../database/interfaces';
import { EstadoNegociacionDeuda, EstadoNegociacionOkupa, TFund, TRealtyType } from '../../database/interfaces/enums';
import { TDebtRealty, TOkupaRealty, TRealty } from '../../database/interfaces/totalum';
import { normalizeAddress, normalizeString } from '../../utils/funcs';
import { parseExcelDebtRealtyToTotalum, parseExcelOkupaRealtyToTotalum } from '../../utils/parser';
import { createDebtRealty, createOkupaRealty, updateDebtRealty, updateOkupaRealty } from '../services/totalum';

export async function processRealtiesUpload(
  realtyType: TRealtyType,
  existingRealties: TRealty[],
  validRealties: ExcelRealty[],
  setRealtiesAsNew: boolean,
  fund: TFund
) {
  try {
    let realtiesUploaded = 0;
    let realtiesUpdated = 0;
    let realtiesOmitted = 0;

    for (const realty of validRealties) {
      try {
        const existingRealty = existsRoyalty(existingRealties, realty, fund);

        if (existingRealty) {
          const update = completeRealtyFromExcel(existingRealty, realty, realtyType, fund);

          if (Object.keys(update).length > 0) {
            if (realtyType === TRealtyType.Okupados) {
              await updateOkupaRealty(existingRealty._id, update as Partial<TOkupaRealty>);
            } else {
              await updateDebtRealty(existingRealty._id, update as Partial<TDebtRealty>);
            }

            realtiesUpdated++;
          } else {
            realtiesOmitted++;
          }
        } else {
          if (realtyType === TRealtyType.Okupados) {
            const parsedRoyalty = parseExcelOkupaRealtyToTotalum(realty as ExcelOkupaRealty, setRealtiesAsNew, fund);
            await createOkupaRealty(parsedRoyalty);
          }

          if (realtyType === TRealtyType.Deuda) {
            const parsedRoyalty = parseExcelDebtRealtyToTotalum(realty as ExcelDebtRealty, setRealtiesAsNew, fund);
            await createDebtRealty(parsedRoyalty);
          }

          realtiesUploaded++;
        }
      } catch (error) {
        realtiesOmitted++;

        console.error(`Error procesando el royalty: ${error.message}`);
      }
    }

    return { realtiesUploaded, realtiesUpdated, realtiesOmitted };
  } catch (error) {
    throw new Error(`Error procesando la subida de las propiedades: ${error.message}`);
  }
}

export function existsRoyalty(allExistentRoyalties: TRealty[], newRoyalty: ExcelRealty, fund: TFund): TRealty | false {
  try {
    if (!newRoyalty.direccion_completa && !newRoyalty.ref_catastral && !newRoyalty.ref_activo && !newRoyalty.ref_fondo)
      return false;

    const formattedNewDireccion = newRoyalty.direccion_completa ? normalizeAddress(newRoyalty.direccion_completa) : '';
    const newCatastral = newRoyalty.ref_catastral?.trim();

    const existingRoyalty = allExistentRoyalties.find((royalty) => {
      const formattedDireccion = royalty.direccion_completa ? normalizeAddress(royalty.direccion_completa) : '';
      const sameDireccion = formattedDireccion === formattedNewDireccion;

      const sameCatastral = royalty.ref_catastral === newCatastral;

      const hasComercializador = royalty.comercializador && royalty.comercializador.trim() !== '';
      const hasRefActivo = royalty.ref_activo && royalty.ref_activo.trim() !== '';
      const hasRefFondo = royalty.ref_fondo && royalty.ref_fondo.trim() !== '';
      
      const matchesComercializador = normalizeString(royalty.comercializador || '') === normalizeString(fund || '');
      const matchesRefActivo = hasRefActivo && royalty.ref_activo === newRoyalty.ref_activo?.trim();
      const matchesRefFondo = hasRefFondo && royalty.ref_fondo === newRoyalty.ref_fondo?.trim();

      const matchesAny = sameDireccion || sameCatastral || matchesRefActivo || matchesRefFondo;

      return matchesAny && (!hasComercializador || matchesComercializador);
    });

    return existingRoyalty || false;
  } catch (error) {
    throw new Error(`Error checking if royalty exists: ${(error as Error).message}`);
  }
}

export async function resetRealtiesStateNew(
  realties: TRealty[],
  realtyType: TRealtyType,
  fund: TFund | '' | null
): Promise<void> {
  try {
    for (const realty of realties) {
      const matchesFund = !fund || realty.comercializador === fund;

      if (!matchesFund) continue;

      if (realtyType === TRealtyType.Okupados && realty.estado_negociacion === EstadoNegociacionOkupa.Nuevo) {
        await updateOkupaRealty(realty._id, { estado_negociacion: '' as EstadoNegociacionOkupa });
      } else if (realtyType === TRealtyType.Deuda && realty.estado_negociacion === EstadoNegociacionDeuda.Nuevo) {
        await updateDebtRealty(realty._id, { estado_negociacion: '' as EstadoNegociacionDeuda });
      }
    }
  } catch (error) {
    throw new Error(`No se ha podido resetear el estado del inmueble: ${(error as Error).message}`);
  }
}

export function filterValidRoyalties(realties: ExcelRealty[]): ExcelRealty[] {
  try {
    const filteredRoyalties = realties.filter(
      (realty) => (realty && realty.direccion_completa?.trim() !== '') || realty.ref_catastral?.trim() !== ''
    );

    return filteredRoyalties;
  } catch (error) {
    throw new Error(`Error filtering valid royalties: ${error.message}`);
  }
}

export function completeRealtyFromExcel(
  existing: TRealty,
  incoming: ExcelRealty,
  realtyType: TRealtyType,
  fund: TFund
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

    if (isEmpty(existingOkupa.ref_activo) && okupa.ref_activo) update.ref_activo = okupa.ref_activo;

    if (isEmpty(existingOkupa.ref_fondo) && okupa.ref_fondo) update.ref_fondo = okupa.ref_fondo;

    if (isEmpty(existingOkupa.comercializador) && fund) update.comercializador = fund;

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

    if (isEmpty(existingDeuda.provincia) && deuda.provincia) update.provincia = deuda.provincia;

    if (isEmpty(existingDeuda.codigo_postal) && deuda.codigo_postal) update.codigo_postal = deuda.codigo_postal;

    if (isEmpty(existingDeuda.comercializador) && fund) update.comercializador = fund;

    if (isEmpty(existingDeuda.ref_activo) && deuda.ref_activo) update.ref_activo = deuda.ref_activo;

    if (isEmpty(existingDeuda.ref_fondo) && deuda.ref_fondo) update.ref_fondo = deuda.ref_fondo;

    return update;
  }

  return {};
}
