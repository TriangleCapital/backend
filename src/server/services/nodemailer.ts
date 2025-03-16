import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log('*ERR: ', err);
          reject();
        }
        resolve(token);
      });
    });

    const transporterOptions: any = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.NOTIFICATION_EMAIL,
        accessToken,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    };

    const transporter = nodemailer.createTransport(transporterOptions);
    return transporter;
  } catch (err) {
    return err;
  }
};

export async function sendEmail(receiverEmail: string, subject: string, htmlMessage: string) {
  try {
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: receiverEmail,
      subject,
      html: htmlMessage,
    };

    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error(`Error sending gmail email: ${err.message}`);
  }
}
