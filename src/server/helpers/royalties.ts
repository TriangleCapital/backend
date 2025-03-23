import { Royalty } from '../../database/interfaces';

export function existsRoyalty(okupaRoyalties: Royalty[], newRoyalty: Royalty): boolean {
  const formattedNewDireccion = newRoyalty.direccion_completa.trim().toLowerCase();

  return okupaRoyalties.some((royalty) => {
    const formattedDireccion = royalty.direccion_completa.trim().toLowerCase();
    return formattedDireccion === formattedNewDireccion || royalty.ref_catastral === newRoyalty.ref_catastral;
  });
}

export function filterValidRoyalties(royalties: Royalty[]): Royalty[] {
    return royalties.filter(
      (royalty) =>
        royalty && royalty.direccion_completa && royalty.direccion_completa.trim() !== ""
    );
  }