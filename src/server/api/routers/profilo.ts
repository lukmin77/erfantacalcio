import Logger from "~/lib/logger";
import { z } from 'zod';
import { computeMD5Hash } from '~/utils/hashPassword';
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

import prisma from "~/utils/db";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { base64ToArrayBuffer } from "~/utils/stringUtils";



export const profiloRouter = createTRPCRouter({

  changePassword: protectedProcedure
    .input(z.object({
      id: z.number(),
      oldPassword: z.string(),
      newPassword: z.string()
    }))
    .mutation(async (opts) => {
      try {
        const user = await prisma.utenti.findUnique({
          where: {
            idUtente: opts.input.id
          }
        });

        if (!user) {
          throw new Error('Utente non trovato');
        }

        const oldPasswordHash = computeMD5Hash(opts.input.oldPassword);
        if (oldPasswordHash !== user.pwd) {
          throw new Error('La vecchia password non è corretta');
        }

        await prisma.utenti.update({
          where: {
            idUtente: opts.input.id
          },
          data: {
            pwd: computeMD5Hash(opts.input.newPassword)
          }
        })
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  uploadFoto: protectedProcedure
    .input(z.object({
      fileName: z.string(),
      fileSize: z.number(),
      blockDataBase64: z.string()
    }))
    .mutation(async (opts) => {
      try {
        const { fileName, fileSize, blockDataBase64 } = opts.input;
        const filePath = path.join(process.cwd(), `public/images/fotoprofili/${fileName}`);

        // Verifica se il file esiste già
        const fileExists = fs.existsSync(filePath);

        if (!fileExists) {
          fs.writeFileSync(filePath, Buffer.from(blockDataBase64, 'base64'), { flag: 'w' });
        } else {
          fs.appendFileSync(filePath, Buffer.from(blockDataBase64, 'base64'));
        }

        if (fs.statSync(filePath).size >= fileSize) {
          Logger.info(`Il file ${fileName} è stato completamente salvato.`);
        }
        return `/images/fotoprofili/${fileName}`;


      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  uploadFotoVercel: protectedProcedure
    .input(z.object({
      fileName: z.string(),
      fileData: z.string()
    }))
    .mutation(async (opts) => {
      try {
        const { fileName, fileData } = opts.input;
        const arrayBuffer = base64ToArrayBuffer(fileData);
        Logger.info('filedata:', fileData);
        Logger.info('arraybuffer:', arrayBuffer);
        const blob = await put(`fotoprofili/${fileName}`, arrayBuffer, {
          access: 'public',
          addRandomSuffix: false
        });
        Logger.info('file blob: ', blob);
        Logger.info(`Il file ${fileName} è stato completamente salvato.`);
        return blob.url;
        
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  deleteFoto: protectedProcedure
    .mutation(async (opts) => {
      try {
        const directory = "public/images/fotoprofili/";

        fs.readdir(directory, (err, files) => {
          if (err) throw err;

          for (const file of files) {
            const userFilePattern = new RegExp(`foto_${opts.ctx.session.user.idSquadra}_.*`);
            if (userFilePattern.test(file)) {
              fs.unlink(path.join(directory, file), (err) => {
                if (err) throw err;
              });
              Logger.info(`Eliminato file: ${file}`);
            }
          }
        });
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),



  updateFoto: protectedProcedure
    .input(z.object({
      fileName: z.string()
    }))
    .mutation(async (opts) => {
      try {
        /* const utente = await prisma.utenti.findUnique({
          select: { foto: true },
          where: { idUtente: opts.ctx.session.user.idSquadra }
        }); */

        //delete foto
        /* const fotoProfilo = opts.ctx.session.user.image ?? '';
        Logger.info(`Foto profilo precedente: public${fotoProfilo}`);
        if (fs.existsSync(`public${fotoProfilo}`)) {
          fs.unlinkSync(`public${fotoProfilo}`);
          Logger.info(`Foto profilo precedente eliminata: public${fotoProfilo}`);
        } */

        //update foto
        const filePath = opts.input.fileName;

        await prisma.utenti.update({
          data: {
            foto: filePath
          },
          where: {
            idUtente: opts.ctx.session.user.idSquadra
          }
        });
        Logger.info(`Foto profilo utente aggiornata: ${filePath}`);
        return filePath;

      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),
});


const base64ToBlob = (base64: string, mimeType: string = ''): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};