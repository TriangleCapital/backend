import { getSolviaExtendedRealty } from '../services/banks';

export async function getSolviaRealtiesFromSimpleRealties(simpleRealties: SolviaSimpleRealty[]): Promise<SolviaRealty[]> {
  try {
    let solviaRealties: SolviaRealty[] = [];
    for (const simpleRealty of simpleRealties) {
      const solviaRealty = await getSolviaExtendedRealty(simpleRealty.id);

      if (solviaRealty) {
        solviaRealties.push(solviaRealty);
      }
    }
    return solviaRealties;
  } catch (error) {
    throw new Error(`No se han podido obtener los activos de Solvia desde los activos simples. ${error.message}`);
  }
}
