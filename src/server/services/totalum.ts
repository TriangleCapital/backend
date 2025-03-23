import { TotalumApiSdk } from 'totalum-api-sdk';
import { TOTALUM_LAST_LINK_WORKED_ID, TOTALUM_LAST_PROPERTY_WORKED_ID, totalumOptions } from '../../utils/constants';
import { TDebtRealty, TLastPropertyWorked, TLeadAlContado, TLeadHipoteca, TLeadShared, TOkupaRealty } from '../../database/interfaces/totalum';
import { DebtRoyalty, OkupaRoyalty } from '../../database/interfaces';

const totalumSdk = new TotalumApiSdk(totalumOptions);

// ------ lead sin respuesta ------
export async function getAllSharedLeads(): Promise<TLeadShared[]> {
  try {
    const response = await totalumSdk.crud.getItems('lead', {
      pagination: {
        limit: 999,
        page: 0,
      },
    });
    return response.data.data;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error obteniendo todos los leads de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error obteniendo todos los leads de Totalum: ${error.message}`);
    }
  }
}

export async function createSharedLead(lead: Partial<TLeadShared>): Promise<string> {
  try {
    const response = await totalumSdk.crud.createItem('lead', lead);
    return response.data.data.insertedId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando el lead de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando el lead de Totalum: ${error.message}`);
    }
  }
}

export async function updateSharedLead(leadId: string, update: Partial<TLeadShared>) {
  try {
    if (!leadId) return;

    await totalumSdk.crud.editItemById('lead', leadId, update);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error actualizando el lead de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error actualizando el lead de Totalum: ${error.message}`);
    }
  }
}

export async function removeSharedLead(leadId: string) {
  try {
    if (!leadId) return;

    await totalumSdk.crud.deleteItemById('lead', leadId);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error borrando el lead de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error borrando el lead de Totalum: ${error.message}`);
    }
  }
}

// ------ lead hipoteca ------
export async function getAllHipotecaLeads(): Promise<TLeadHipoteca[]> {
  try {
    const response = await totalumSdk.crud.getItems('lead_hipoteca', {
      pagination: {
        limit: 999,
        page: 0,
      },
    });
    return response.data.data;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error obteniendo todos los leads hipoteca de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error obteniendo todos los leads hipoteca de Totalum: ${error.message}`);
    }
  }
}

export async function createHipotecaLead(lead: Partial<TLeadHipoteca>): Promise<string> {
  try {
    const response = await totalumSdk.crud.createItem('lead_hipoteca', lead);
    return response.data.data.insertedId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando el lead hipoteca de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando el lead hipoteca de Totalum: ${error.message}`);
    }
  }
}

export async function updateHipotecaLead(leadId: string, update: Partial<TLeadHipoteca>) {
  try {
    if (!leadId) return;

    await totalumSdk.crud.editItemById('lead_hipoteca', leadId, update);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error actualizando el lead hipoteca de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error actualizando el lead hipoteca de Totalum: ${error.message}`);
    }
  }
}

// ------ lead contado ------
export async function getAllContadoLeads(): Promise<TLeadAlContado[]> {
  try {
    const response = await totalumSdk.crud.getItems('lead_al_contado', {
      pagination: {
        limit: 999,
        page: 0,
      },
    });
    return response.data.data;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error obteniendo todos los leads contado de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error obteniendo todos los leads contado de Totalum: ${error.message}`);
    }
  }
}

export async function createContadoLead(lead: Partial<TLeadAlContado>): Promise<string> {
  try {
    const response = await totalumSdk.crud.createItem('lead_al_contado', lead);
    return response.data.data.insertedId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando el lead contado de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando el lead contado de Totalum: ${error.message}`);
    }
  }
}

export async function updateContadoLead(leadId: string, update: Partial<TLeadAlContado>) {
  try {
    if (!leadId) return;

    await totalumSdk.crud.editItemById('lead_al_contado', leadId, update);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error actualizando el lead contado de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error actualizando el lead contado de Totalum: ${error.message}`);
    }
  }
}

// ------ ultima_propiedad_trabajada ------
export async function getLastProperty(): Promise<string> {
  try {
    const response = await totalumSdk.crud.getItems('ultima_propiedad_trabajada');
    return response.data.data[0].descripcion;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error obteniendo la última propiedad trabajada de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error obteniendo la última propiedad trabajada de Totalum: ${error.message}`);
    }
  }
}

export async function updateLastProperty(newPropertyDescription: string) {
  try {
    const options: Partial<TLastPropertyWorked> = { descripcion: newPropertyDescription };

    await totalumSdk.crud.editItemById('ultima_propiedad_trabajada', TOTALUM_LAST_PROPERTY_WORKED_ID, options);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error actualizando la última propiedad trabajada de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error actualizando la última propiedad trabajada de Totalum: ${error.message}`);
    }
  }
}

// ------ ultimo_enlace_trabajado ------
export async function getLastLink(): Promise<string> {
  try {
    const response = await totalumSdk.crud.getItems('ultimo_enlace_trabajado');
    return response.data.data[0].enlace;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error obteniendo la última propiedad trabajada de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error obteniendo la última propiedad trabajada de Totalum: ${error.message}`);
    }
  }
}

export async function updateLastLink(newLink: string) {
  try {
    const options = { enlace: newLink };

    await totalumSdk.crud.editItemById('ultimo_enlace_trabajado', TOTALUM_LAST_LINK_WORKED_ID, options);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error actualizando el último enlace trabajado de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error actualizando el último enlace trabajado de Totalum: ${error.message}`);
    }
  }
}

// ------ inmueble_okupado ------
export async function getAllOkupaRoyalties(): Promise<OkupaRoyalty[]> {
  let allRoyalties: OkupaRoyalty[] = [];
  let page = 0;
  const limit = 999;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await totalumSdk.crud.getItems('inmueble_okupado', {
        pagination: { limit, page },
      });

      const royalties = response.data.data;
      allRoyalties = allRoyalties.concat(royalties);

      if (royalties.length < limit) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allRoyalties;
  } catch (error) {
    throw new Error(
      `Error obteniendo todas las propiedades okupadas de Totalum: ${error.response?.data?.errors || error.message}`
    );
  }
}

export async function createOkupaRoyalty(royalty: Partial<TOkupaRealty>): Promise<string> {
  try {
    const response = await totalumSdk.crud.createItem('inmueble_okupado', royalty);

    return response.data.data.insertedId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando el inmueble okupa de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando el inmueble okupa de Totalum: ${error.message}`);
    }
  }
}

export async function removeOkupaRoyalty(royaltyId: string) {
  try {
    if (!royaltyId) return;

    await totalumSdk.crud.deleteItemById('inmueble_okupado', royaltyId);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error borrando el inmueble okupa de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error borrando el inmueble okupa de Totalum: ${error.message}`);
    }
  }
}

// ------ inmueble_deuda ------
export async function getAllDebtRoyalties(): Promise<DebtRoyalty[]> {
  let allRoyalties: DebtRoyalty[] = [];
  let page = 0;
  const limit = 999;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await totalumSdk.crud.getItems('inmueble_deuda', {
        pagination: { limit, page },
      });

      const royalties = response.data.data;
      allRoyalties = allRoyalties.concat(royalties);

      if (royalties.length < limit) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allRoyalties;
  } catch (error) {
    throw new Error(
      `Error obteniendo todas las propiedades deuda de Totalum: ${error.response?.data?.errors || error.message}`
    );
  }
}

export async function createDebtRoyalty(royalty: Partial<TDebtRealty>): Promise<string> {
  try {
    const response = await totalumSdk.crud.createItem('inmueble_deuda', royalty);

    return response.data.data.insertedId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando el inmueble deuda de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando el inmueble deuda de Totalum: ${error.message}`);
    }
  }
}