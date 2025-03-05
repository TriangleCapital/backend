import '../loadEnvironment';
import nodemailer from 'nodemailer';

const isTest = process.env.NODE_ENV !== 'production';

export const MANYCHAT_API = 'https://api.manychat.com';

export const MANYCHAT_BOT_FIELD_ID = 4591353;

export const MANYCHAT_FLOW_NS = 'content20250305092023_598482';

export const TOTALUM_LAST_PROPERTY_WORKED_ID = '67c7e8196437bca456dbd28f';

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
