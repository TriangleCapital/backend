import axios from 'axios';
import { SOLVIA_API } from '../../utils/constants';

export async function getSolviaExtendedRealty(realtyId: string): Promise<SolviaRealty> {
  try {
    const response: any = await axios.get(`${SOLVIA_API}/v3/${realtyId}`);

    return response.data;
  } catch (error) {
    throw new Error(`Error obteniendo el activo desde Solvia: ${error.response?.data?.errors || error.message}`);
  }
}

export async function getSolviaRealties(postalCodes: string[]): Promise<SolviaSimpleRealty[]> {
  const allRealties: any[] = [];
  const pageSize = 100;

  try {
    for (const postalCode of postalCodes) {
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const response: any = await axios.post(`${SOLVIA_API}/v2/buscarInmuebles`, {
          idProvincia: postalCode.slice(0, 2),
          tipoIperacion: 'COMPRA',
          idCategoriaTipoVivienda: '1',
          paginacion: {
            numeroPagina: page,
            tamanoPagina: pageSize,
          },
        });

        const realties = response.data.inmuebles;

        if (!Array.isArray(realties) || realties.length === 0) {
          hasMore = false;
        } else {
          allRealties.push(...realties);
          if (realties.length < pageSize) {
            hasMore = false;
          } else {
            page += 1;
          }
        }
      }
    }

    return allRealties;
  } catch (error: any) {
    throw new Error(`Error obteniendo los activos desde Solvia: ${error.response?.data?.errors || error.message}`);
  }
}

