import { TotalumApiSdk } from "totalum-api-sdk";
import { triangleTotalumOptions } from "../../utils/constants";

const totalumSdk = new TotalumApiSdk(triangleTotalumOptions);

// ------ inmueble_okupado ------
export async function getAllOkupaRealties(): Promise<any[]> {
  let allRealties: any[] = [];
  let page = 0;
  const limit = 999;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await totalumSdk.crud.getItems('vivienda_okupada', {
        pagination: { limit, page },
      });

      const realties = response.data.data;
      allRealties = allRealties.concat(realties);

      if (realties.length < limit) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allRealties;
  } catch (error) {
    throw new Error(
      `Error obteniendo todas las propiedades okupadas de Totalum: ${error.response?.data?.errors || error.message}`
    );
  }
}

export async function updateOkupaRealty(realtyId: string, update: any) {
  try {
    await totalumSdk.crud.editItemById('vivienda_okupada', realtyId, update);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error modificando el inmueble okupa de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error modificando el inmueble okupa de Totalum: ${error.message}`);
    }
  }
}