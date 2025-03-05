import { TotalumApiSdk } from 'totalum-api-sdk';
import { TOTALUM_LAST_PROPERTY_WORKED_ID, totalumOptions } from '../../utils/constants';
import { TLastPropertyWorked, TLead } from '../../database/interfaces/totalum';

const totalumSdk = new TotalumApiSdk(totalumOptions);

// ------ lead ------
export async function getAllLeads(): Promise<TLead[]> {
  try {
    const response = await totalumSdk.crud.getItems('lead');
    return response.data.data;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error obteniendo todos los leads de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error obteniendo todos los leads de Totalum: ${error.message}`);
    }
  }
}

export async function createLead(lead: Partial<TLead>) {
  try {
    const response = await totalumSdk.crud.createItem('lead', lead);
    return response.data.data;
  } catch (error) {
    if (error.response.data.errors) {
      throw new Error(`Error creando el lead de Totalum: ${error.response.data.errors}`);
    } else {
      throw new Error(`Error creando el lead de Totalum: ${error.message}`);
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
