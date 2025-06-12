import axios from 'axios';
import { SOLVIA_API } from '../../utils/constants';

export async function getSolviaRealties(postalCode: string) {
  const allRealties: any[] = [];
  const pageSize = 100;
  let page = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const response: any = await axios.post(`${SOLVIA_API}/buscarInmuebles`, {
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

    return allRealties;
  } catch (error) {
    throw new Error(`Error obteniendo las propiedades desde Solvia: ${error.response?.data?.errors || error.message}`);
  }
}
