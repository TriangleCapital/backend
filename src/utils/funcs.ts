import { TLead } from '../database/interfaces/totalum';

export function generateLeadEmail(lead: TLead): string {
  return `
      Un nuevo lead ha completado el chatbot. Aquí están los detalles:
  
      - Nombre: ${lead.nombre} ${lead.apellidos || ''}
      - Teléfono: ${lead.telefono}
      - Correo electrónico: ${lead.email || ''}
      - Propiedad de interés: ${lead.propiedad_interes}
      - Tipo de financiación: ${lead.financiacion}
      ${lead.uso_vivienda ? `- Uso de la vivienda: ${lead.uso_vivienda}` : ''}
      ${lead.fin_inversion ? `- Finalidad de la inversión: ${lead.fin_inversion}` : ''}
      ${lead.ahorros_disponibles > 0 ? `- Ahorros disponibles: ${lead.ahorros_disponibles.toLocaleString()} €` : ''}

      Para acceder al Panel de leads: https://web.totalum.app/table/leads
  
      Seguimos! 🚀
    `;
}
