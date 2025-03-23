import { Royalty } from '../../database/interfaces';

export function existsRoyalty(okupaRoyalties: Royalty[], newRoyalty: Royalty): boolean {
  return okupaRoyalties.some(
    (royalty) =>
      royalty.direccion_completa === newRoyalty.direccion_completa || royalty.ref_catastral === newRoyalty.ref_catastral
  );
}

export function filterValidRoyalties(royalties: Royalty[]): Royalty[] {
    return royalties.filter(
      (royalty) =>
        royalty && royalty.direccion_completa && royalty.direccion_completa.trim() !== ""
    );
  }