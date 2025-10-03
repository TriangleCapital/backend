import { sleep } from '../../utils/funcs';
import { getSolviaExtendedRealty } from '../services/banks';

export async function getSolviaRealtiesFromSimpleRealties(simpleRealties: SolviaSimpleRealty[]): Promise<SolviaRealty[]> {
  try {
    let solviaRealties: SolviaRealty[] = [];
    const total = simpleRealties.length;

    for (const [i, simpleRealty] of simpleRealties.entries()) {
      try {
        const solviaRealty = await getSolviaExtendedRealty(simpleRealty.id);

        if (solviaRealty) {
          solviaRealties.push(solviaRealty);
          console.info(`🏠 Activo ${simpleRealty.id} obtenido correctamente.`);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error obteniendo el detalle del activo ${simpleRealty.id}: ${msg}`);
      } finally {
        const processed = i + 1;
        const remaining = total - processed;
        const pct = Math.round((processed / total) * 100);
        console.info(`⏳ Progreso: ${processed}/${total} (${pct}%) · Restantes: ${remaining}`);
        console.info(hr());  
        await sleep(1000 + Math.random() * 2000);
      }
    }
    console.info(`✅ Total de activos obtenidos: ${solviaRealties.length}`);

    return solviaRealties;
  } catch (error) {
    throw new Error(`No se han podido obtener los activos de Solvia desde los activos simples. ${error.message}`);
  }
}

const hr = () => {
  const width = Math.min(process.stdout?.columns ?? 80, 100);
  return `\x1b[90m${"─".repeat(width)}\x1b[0m`;
};