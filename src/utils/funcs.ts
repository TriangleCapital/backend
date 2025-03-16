import { TBoolean } from '../database/interfaces/enums';
import { TLeadAlContado, TLeadHipoteca, TLeadShared } from '../database/interfaces/totalum';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateHipotecaLeadEmailHtmlMessage(hipotecaLead: Partial<TLeadHipoteca>): string {
  const formatBox = (label: string, value?: string | number) => {
    return value ? `<div class="info-box"><strong>${label}:</strong> ${value}</div>` : '';
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Lead de Hipoteca</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #007bff;
          text-align: center;
        }
        p {
          font-size: 16px;
          color: #333;
          line-height: 1.5;
        }
        .info-box {
          background: #f8f9fa;
          padding: 10px;
          border-left: 4px solid #007bff;
          margin-bottom: 10px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Nuevo Lead de Hipoteca para ${hipotecaLead.propiedad_interes}</h2>
        <p>Se ha recibido un nuevo lead con los siguientes datos:</p>

        ${formatBox('Nombre', hipotecaLead.nombre)}
        ${formatBox('Teléfono', hipotecaLead.telefono)}
        ${formatBox('Email', hipotecaLead.email ? `<a href="mailto:${hipotecaLead.email}">${hipotecaLead.email}</a>` : '')}
        ${formatBox('Estado de Hipoteca', hipotecaLead.estado_hipoteca)}
        ${formatBox('Cuándo quiere mudarse', hipotecaLead.cuando_quiere_mudarse)}
        ${formatBox(
          'Quiere vender su propiedad actual',
          hipotecaLead.venta_actual_propiedad === TBoolean.Si
            ? 'Sí'
            : hipotecaLead.venta_actual_propiedad === TBoolean.No
            ? 'No'
            : ''
        )}
        ${formatBox(
          'Ahorros Disponibles',
          hipotecaLead.ahorros_disponibles ? `€${hipotecaLead.ahorros_disponibles.toLocaleString()}` : ''
        )}
        ${formatBox('Mensaje que envió por Idealista', hipotecaLead.mensaje_idealista)}

        <p>Para acceder al Panel de leads: <a href="mailto:https://web.totalum.app/table/leads">https://web.totalum.app/table/leads</a></p>
  
        <p>Vamos! 🚀</p>
      </div>
    </body>
    </html>
  `;
}

export function generateContadoLeadEmailHtmlMessage(contadoLead: Partial<TLeadAlContado>): string {
  const formatBox = (label: string, value?: string | number) => {
    return value ? `<div class="info-box"><strong>${label}:</strong> ${value}</div>` : '';
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Lead al Contado</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #007bff;
          text-align: center;
        }
        p {
          font-size: 16px;
          color: #333;
          line-height: 1.5;
        }
        .info-box {
          background: #f8f9fa;
          padding: 10px;
          border-left: 4px solid #007bff;
          margin-bottom: 10px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Nuevo Lead al Contado para ${contadoLead.propiedad_interes}</h2>
        <p>Se ha recibido un nuevo lead con los siguientes datos:</p>

        ${formatBox('Nombre', contadoLead.nombre)}
        ${formatBox('Teléfono', contadoLead.telefono)}
        ${formatBox('Email', contadoLead.email ? `<a href="mailto:${contadoLead.email}">${contadoLead.email}</a>` : '')}
        ${formatBox('Uso de Vivienda', contadoLead.uso_vivienda)}
        ${formatBox('Finalidad de la Inversión', contadoLead.fin_inversion)}
        ${formatBox('Zona de Interés', contadoLead.zona_interes)}
        ${formatBox(
          'Ahorros Disponibles',
          contadoLead.ahorros_disponibles ? `€${contadoLead.ahorros_disponibles.toLocaleString()}` : ''
        )}
        ${formatBox('Mensaje que envió por Idealista', contadoLead.mensaje_idealista)}

        <p>Para acceder al Panel de leads: <a href="mailto:https://web.totalum.app/table/leads">https://web.totalum.app/table/leads</a></p>
  
        <p>Vamos! 🚀</p>
      </div>
    </body>
    </html>
  `;
}
