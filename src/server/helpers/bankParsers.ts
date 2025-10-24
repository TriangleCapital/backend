import * as XLSX from 'xlsx';
import { TBank, TBoolean, TipoOkupa } from '../../database/interfaces/enums';
import { TOkupaRealty } from '../../database/interfaces/totalum';
import { enhance, styleHeader, zebra } from '../../utils/excel';

export function parseSolviaRealtyToDb(solviaRealty: SolviaRealty): Partial<TOkupaRealty> {
  return {
    ref_fondo: solviaRealty?.id || '',
    ref_activo: solviaRealty?.idVivienda || '',
    ref_catastral: solviaRealty?.datosBasicos?.caracteristicas?.refCatastral || '',
    tipo_okupa: getTipoOkupaFromSolviaRealty(solviaRealty),
    enlace_inmueble: solviaRealty?.urlPdfFicha || '',
    enlace_maps: solviaRealty?.datosBasicos?.geo?.direccionGoogle
      ? `https://www.google.com/maps?q=${solviaRealty.datosBasicos.geo.direccionGoogle}`
      : '',
    precio_inicial: solviaRealty?.datosBasicos?.precio || 0,
    precio_venta: solviaRealty?.datosBasicos?.precio ? solviaRealty.datosBasicos.precio * 0.9 : 0,
    direccion_completa:
      solviaRealty?.datosBasicos?.direccion && solviaRealty?.datosBasicos?.poblacion?.name
        ? `${solviaRealty.datosBasicos.direccion}, ${solviaRealty.datosBasicos.poblacion.name}`
        : solviaRealty?.datosBasicos?.referenciaComercial || '',
    provincia: solviaRealty?.datosBasicos?.provincia?.name || '',
    comercializador: TBank.Solvia,
    m2: solviaRealty?.datosBasicos?.m2 || 0,
    numero_habitaciones: solviaRealty?.datosBasicos?.totalDormitorios || 0,
    numero_banos: solviaRealty?.datosBasicos?.totalBanyos || 0,
    tiene_garaje: solviaRealty?.datosBasicos?.caracteristicas?.garaje ? TBoolean.Si : TBoolean.No,
    tiene_trastero: solviaRealty?.datosBasicos?.caracteristicas?.trastero ? TBoolean.Si : TBoolean.No,
    tiene_piscina: solviaRealty?.datosBasicos?.caracteristicas?.piscina ? TBoolean.Si : TBoolean.No,
    certificacion_energetica: solviaRealty?.datosBasicos?.certificacionEnergetica || '',
    fecha_primera_publicacion: solviaRealty?.datosBasicos?.fichaFechaPrimeraPub
      ? parseSolviaDate(solviaRealty.datosBasicos.fichaFechaPrimeraPub)
      : null,
    fecha_publicacion: solviaRealty?.datosBasicos?.fichaFechaActualizacionProducto
      ? parseSolviaDate(solviaRealty.datosBasicos.fichaFechaActualizacionProducto)
      : null,
    ficha_origen_producto: solviaRealty?.datosBasicos?.fichaOrigenProducto || '',
    ficha_macro: solviaRealty?.datosBasicos?.fichaMacro || '',
    ficha_territorial: solviaRealty?.datosBasicos?.fichaTerritorial || '',
    ficha_rango_precio: solviaRealty?.datosBasicos?.fichaRangoPrecio || '',
  };
}

export function getTipoOkupaFromSolviaRealty(solviaRealty: SolviaRealty): TipoOkupa {
  const disclaimer = solviaRealty?.datosBasicos?.campanya?.disclaimer;

  const disponibleArray = solviaRealty?.tiposDisponibles?.[0]?.disponibles;
  const disponible = Array.isArray(disponibleArray) && disponibleArray.length > 0 ? disponibleArray[0] : undefined;

  const disclaimerObjArray = disponible?.disclaimers;
  const disclaimerObj =
    Array.isArray(disclaimerObjArray) && disclaimerObjArray.length > 0 ? disclaimerObjArray[0] : undefined;

  const isExTenant =
    disclaimerObj?.id === 4 ||
    (typeof disclaimerObj?.texto === 'string' &&
      disclaimerObj.texto.includes('El inmueble ha sido adquirido a través de un procedimiento judicial')) ||
    (typeof disclaimer === 'string' &&
      disclaimer.includes('El inmueble ha sido adquirido a través de un procedimiento judicial'));

  const isBorrower =
    (typeof disclaimerObj?.texto === 'string' && disclaimerObj.texto.includes('arrendado a tercero')) ||
    (typeof disclaimer === 'string' && disclaimer.includes('arrendado a tercero'));

  if (
    isExTenant ||
    isBorrower ||
    (typeof disclaimer === 'string' && disclaimer.includes('ocupado')) ||
    (typeof disclaimerObj?.texto === 'string' && disclaimerObj.texto.includes('ocupado'))
  ) {
    if (isExTenant) {
      return TipoOkupa.ExTenant;
    } else if (isBorrower) {
      return TipoOkupa.Borrower;
    } else {
      return TipoOkupa.ExBorrowerOSquatter;
    }
  } else {
    return TipoOkupa.Vacio;
  }
}

export function getNeedsReformFromSolviaRealty(solviaRealty: SolviaRealty): boolean {
  const disclaimer = solviaRealty?.datosBasicos?.campanya?.disclaimer;

  const disponibleArray = solviaRealty?.tiposDisponibles?.[0]?.disponibles;
  const disponible = Array.isArray(disponibleArray) && disponibleArray.length > 0 ? disponibleArray[0] : undefined;

  const disclaimerObjArray = disponible?.disclaimers;
  const disclaimerObj =
    Array.isArray(disclaimerObjArray) && disclaimerObjArray.length > 0 ? disclaimerObjArray[0] : undefined;

  const needsReformFromText =
    (typeof disclaimerObj?.texto === 'string' && disclaimerObj.texto.includes('reforma')) ||
    (typeof disclaimer === 'string' && disclaimer.includes('reforma'));

  if (needsReformFromText || solviaRealty?.reformar === 'S') {
    return true;
  } else {
    return false;
  }
}

function setUpdate<K extends keyof TOkupaRealty>(obj: Partial<TOkupaRealty>, key: K, value: TOkupaRealty[K]) {
  obj[key] = value;
}

export function getUpdatedSolviaRealty(
  existing: Partial<TOkupaRealty>,
  updated: Partial<TOkupaRealty>
): Partial<TOkupaRealty> {
  const isEmpty = (val: any) => val === undefined || val === null || val === '' || val === 0 || val === '###';
  const isDifferent = (a: any, b: any) => a !== b;

  const update: Partial<TOkupaRealty> = {};

  for (const key of Object.keys(updated) as Array<keyof TOkupaRealty>) {
    const newValue = updated[key];
    const oldValue = existing[key];

    if ((!oldValue || isDifferent(oldValue, newValue)) && !isEmpty(newValue)) {
      setUpdate(update, key, newValue as any);
    }
  }

  return update;
}

function parseSolviaDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const [datePart, timePart] = dateStr.split(' ');
  if (!datePart || !timePart) return null;

  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  if ([day, month, year, hours, minutes, seconds].some((n) => Number.isNaN(n))) {
    return null;
  }

  return new Date(year, month - 1, day, hours, minutes, seconds);
}

function toFlatRows(solviaRealties: SolviaRealty[]) {
  return solviaRealties.map((realty) => ({
    id: realty.id,
    id_promocion: realty.idPromocion,
    okupado: getTipoOkupaFromSolviaRealty(realty),

    referencia_catastral: realty.datosBasicos?.caracteristicas?.refCatastral,
    precio: realty.datosBasicos?.precio,
    fecha_primera_publicacion: realty.datosBasicos?.fichaFechaPrimeraPub,
    fecha_publicacion_componente: realty.datosBasicos?.fichaFechaPubComponente,
    fecha_ultima_actualizacion: realty.datosBasicos?.fichaFechaActualizacionProducto,

    referencia_comercial: realty.datosBasicos?.referenciaComercial,

    provincia_id: realty.datosBasicos?.provincia?.id,
    codigo_postal: realty.datosBasicos?.cp,
    poblacion: realty.datosBasicos?.poblacion?.name,
    direccion: realty.datosBasicos?.direccion,
    direccion_google: realty.datosBasicos?.geo?.direccionGoogle,
    metros2: realty.datosBasicos?.m2,
    superficie_construida: realty.datosBasicos?.caracteristicas?.supConstruida,
    banos: realty.datosBasicos?.totalBanyos,
    dormitorios: realty.datosBasicos?.totalDormitorios,

    necesita_reforma: getNeedsReformFromSolviaRealty(realty),
    reservado: realty.reservado,
    ficha_pdf_url: realty.urlPdfFicha,
    url_activo: `https://www.solvia.es/es/comprar/viviendas?texto=PM${realty.idPromocion}&palabraClave=true`,
    url_info_detallada: `https://www.solvia.es/api/inmuebles/v3/${realty.id}`,
  }));
}

function buildWorkbook(rows: any[], sheetName = 'Activos Solvia') {
  const headers = Object.keys(rows[0] ?? {});
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

  styleHeader(ws, headers);
  zebra(ws);
  enhance(ws, headers);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return wb;
}

export function generateExcelBuffer(data: SolviaRealty[], filename = 'activos_solvia.xlsx') {
  const rows = toFlatRows(data);
  const wb = buildWorkbook(rows, 'Activos Solvia');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', cellStyles: true });
  return { buffer, filename };
}
