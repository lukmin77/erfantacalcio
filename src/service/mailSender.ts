import nodemailer, { type Transporter } from 'nodemailer';
import { env } from "process";
import Logger from "~/lib/logger";
import { Resend } from 'resend';


export async function SendMailAsync(to: string, subject: string, htmlMessage: string) {

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


export function SendMail(to: string, subject: string, htmlMessage: string) {

  const transporter: Transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: false,
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASSWORD
    }
  } as nodemailer.TransportOptions);

  transporter.sendMail({
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

const resend = new Resend(env.MAIL_API_KEY);

export async function ReSendMailAsync(to: string, subject: string, htmlMessage: string) {
  
  const { data, error } = await resend.emails.send({
    from: env.MAIL_FROM ?? 'notify@erfantacalcio.com',
    to: to,
    subject: subject,
    html: htmlMessage,
  });
  
  if (error) {
    return console.error({ error });
  }

  console.log({ data });

}

