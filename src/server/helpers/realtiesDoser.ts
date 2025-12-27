import { TOkupaRealty } from '../../database/interfaces/totalum';
import { createOkupaRealty, updateOkupaRealty } from '../services/pastTotalum';
import { getUpdatedSolviaRealty } from './bankParsers';
import { filterOkupaRealtiesFromBank } from './banks';

interface DoserOptions {
  bankRealties: SolviaRealty[];
  dbRealties: TOkupaRealty[];
  mapFetchedToDb: (bankRealty: SolviaRealty) => Partial<TOkupaRealty>;
}

export async function doserRealties({ bankRealties, dbRealties, mapFetchedToDb }: DoserOptions): Promise<{
  created: number;
  updated: number;
  deleted: number;
  omitted: number;
}> {
  let realtiesCreated = 0;
  let realtiesUpdated = 0;
  let realtiesDeleted = 0;
  let realtiesOmitted = 0;

  const newOkupaList = filterOkupaRealtiesFromBank(bankRealties);

  const byRefActivo = new Map<string, TOkupaRealty>();
  const byRefFondo = new Map<string, TOkupaRealty>();
  const byRefCatastral = new Map<string, TOkupaRealty>();

  for (const dbItem of dbRealties) {
    if (dbItem.ref_activo) byRefActivo.set(dbItem.ref_activo, dbItem);
    if (dbItem.ref_fondo) byRefFondo.set(dbItem.ref_fondo, dbItem);
    if (dbItem.ref_catastral) byRefCatastral.set(dbItem.ref_catastral, dbItem);
  }

  for (const fetched of newOkupaList) {
    const parsedRealty = mapFetchedToDb(fetched);
    let existing: TOkupaRealty | undefined;

    if (parsedRealty.ref_activo && byRefActivo.has(parsedRealty.ref_activo)) {
      existing = byRefActivo.get(parsedRealty.ref_activo);
    } else if (parsedRealty.ref_fondo && byRefFondo.has(parsedRealty.ref_fondo)) {
      existing = byRefFondo.get(parsedRealty.ref_fondo);
    } else if (parsedRealty.ref_catastral && byRefCatastral.has(parsedRealty.ref_catastral)) {
      existing = byRefCatastral.get(parsedRealty.ref_catastral);
    }

    if (!existing) {
      await createOkupaRealty(parsedRealty);

      realtiesCreated++;
    } else {
      const update = getUpdatedSolviaRealty(existing, parsedRealty);

      if (Object.keys(update).length > 0) {
        await updateOkupaRealty(existing._id, update as Partial<TOkupaRealty>);

        realtiesUpdated++;
      }

      // Implement delete functionality
      // const shouldDelete =
    }
  }

  return {
    created: realtiesCreated,
    updated: realtiesUpdated,
    deleted: realtiesDeleted,
    omitted: realtiesOmitted,
  };
}
