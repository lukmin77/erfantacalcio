import nodemailer, { type Transporter } from 'nodemailer';
import { env } from "process";
import Logger from "~/lib/logger";

export async function SendMail(to: string, subject: string, htmlMessage: string) {

  const transporter: Transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: false,
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASSWORD
    }
  } as nodemailer.TransportOptions);

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: process.env.NODE_ENV === "production" ? to : 'lucianominni@gmail.com',
    subject: subject,
    html: htmlMessage,
  }).then(() => {
    Logger.info('Mail inviata con successo!!');
  }).catch((error) => {
    console.log(error);
    Logger.error('Si è verificato un problema nell\'invio della mail!!');
  });

}

