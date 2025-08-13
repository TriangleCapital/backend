import { TotalumApiSdk } from 'totalum-api-sdk';
import {
  TOTALUM_LAST_LINK_WORKED_ID,
  TOTALUM_LAST_PROPERTY_WORKED_ID,
  TOTALUM_MRF_PDF_FILE_ID,
  totalumOptions,
} from '../../utils/constants';
import {
  TArchivo,
  TDebtRealty,
  TEvaluationForm,
  TFormularioMrfPdfI,
  TLastPropertyWorked,
  TLeadAlContado,
  TLeadHipoteca,
  TLeadShared,
  TOkupaRealty,
} from '../../database/interfaces/totalum';

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
export async function getAllOkupaRealties(): Promise<TOkupaRealty[]> {
  let allRoyalties: TOkupaRealty[] = [];
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

export async function createOkupaRealty(royalty: Partial<TOkupaRealty>): Promise<string> {
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

export async function updateOkupaRealty(realtyId: string, update: Partial<TOkupaRealty>) {
  try {
    await totalumSdk.crud.editItemById('inmueble_okupado', realtyId, update);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error modificando el inmueble okupa de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error modificando el inmueble okupa de Totalum: ${error.message}`);
    }
  }
}

export async function removeOkupaRealty(royaltyId: string) {
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
export async function getAllDebtRealties(): Promise<TDebtRealty[]> {
  let allRoyalties: TDebtRealty[] = [];
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

export async function createDebtRealty(royalty: Partial<TDebtRealty>): Promise<string> {
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

export async function updateDebtRealty(realtyId: string, update: Partial<TDebtRealty>) {
  try {
    await totalumSdk.crud.editItemById('inmueble_deuda', realtyId, update);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error modificando el inmueble deuda de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error modificando el inmueble deuda de Totalum: ${error.message}`);
    }
  }
}

// ------ evaluacion formulario ------
export async function createTEvaluationForm(evaluationForm: Partial<TEvaluationForm>): Promise<string> {
  try {
    const response = await totalumSdk.crud.createItem('formulario_evaluacion', evaluationForm);
    return response.data.data.insertedId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando evaluation form de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando el evaluation form de Totalum: ${error.message}`);
    }
  }
}

// ------ formulario_pdf_mrf ------
export async function createTMrfPdfForm(mrfForm: Partial<TFormularioMrfPdfI>): Promise<string> {
  try {
    const response = await totalumSdk.crud.createItem('formulario_pdf_mrf', mrfForm);
    return response.data.data.insertedId;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando mrf pdf form de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando el mrf pdf form de Totalum: ${error.message}`);
    }
  }
}

// ------ archivo ------
export async function getTFile(fileId: string): Promise<TArchivo> {
  try {
    const response = await totalumSdk.crud.getItemById('archivo', TOTALUM_MRF_PDF_FILE_ID);

    return response.data?.data;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error obteniendo el archivo de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error obteniendo el archivo form de Totalum: ${error.message}`);
    }
  }
}

export async function updateTFile(fileId: string, update: Partial<TArchivo>) {
  try {
    await totalumSdk.crud.editItemById('archivo', fileId, update);
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error modificando el archivo de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error modificando el archivo de Totalum: ${error.message}`);
    }
  }
}

// ------ persona ------
export async function getTPerson(fileId: string): Promise<TArchivo> {
  try {
    const response = await totalumSdk.crud.getItemById('persona', fileId);

    return response.data?.data;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error obteniendo la persona de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error obteniendo la persona form de Totalum: ${error.message}`);
    }
  }
}
