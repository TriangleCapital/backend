import { DebtRoyalty, Royalty } from '../../database/interfaces';
import { TRoyaltieType } from '../../database/interfaces/enums';

export function existsRoyalty(allExistentRoyalties: Royalty[], newRoyalty: Royalty): boolean {
  try {
    if (!newRoyalty.direccion_completa) return false;

    const formattedNewDireccion = newRoyalty.direccion_completa.trim().toLowerCase();

    return allExistentRoyalties.some((royalty) => {
      const formattedDireccion = royalty.direccion_completa?.trim().toLowerCase();
      return formattedDireccion === formattedNewDireccion || royalty.ref_catastral === newRoyalty.ref_catastral;
    });
  } catch (error) {
    throw new Error(`Error checking if exists royalty: ${error.message}`);
  }
}

export function filterValidRoyalties(royalties: Royalty[], royaltyType: TRoyaltieType): Royalty[] {
  try {
    const filteredRoyalties = royalties.filter(
      (royalty) => royalty && royalty.direccion_completa && royalty.direccion_completa.trim() !== ''
    );

    if (royaltyType === TRoyaltieType.Deuda) {
      return filteredRoyalties.filter(
        (royalty: DebtRoyalty) => typeof royalty.diferencia_precio === 'number' && royalty.diferencia_precio > 0
      );
    }

    return filteredRoyalties;
  } catch (error) {
    throw new Error(`Error filtering valid royalties: ${error.message}`);
  }
}
