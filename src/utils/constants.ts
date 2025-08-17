import '../loadEnvironment';
import nodemailer from 'nodemailer';

const isTest = process.env.NODE_ENV !== 'production';

export const whatsappApi = 'http://localhost:3200';

export const MANYCHAT_API = 'https://api.manychat.com';

export const SOLVIA_API = 'https://www.solvia.es/api/inmuebles/v2';

export const MANYCHAT_REALTY_NAME_FIELD_ID = 4591353;
export const MANYCHAT_REALTY_LINK_FIELD_ID = 4599290;

export const MANYCHAT_FLOW_NS = 'content20250316053735_451986';

export const TOTALUM_LAST_PROPERTY_WORKED_ID = '67c7e8196437bca456dbd28f';
export const TOTALUM_LAST_LINK_WORKED_ID = '67d01b98111251dc7015e30b';
export const TOTALUM_MRF_PDF_FILE_ID = '6891a3f9fc887572d452d232';

export const PERSONAL_EMAIL = 'aronilie.code@gmail.com';

export const totalumOptions = {
  apiKey: {
    'api-key': process.env.TOTALUM_API_KEY,
  },
};

export const manychatOptions = {
  headers: {
    Authorization: `Bearer ${process.env.MANYCHAT_API_KEY}`,
    'Content-Type': 'application/json',
  },
};

export const email = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NOTIFICATION_EMAIL,
    pass: process.env.NOTIFICATION_EMAIL_PW,
  },
});
