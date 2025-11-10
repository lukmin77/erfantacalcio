import fs from 'fs'
import Logger from '~/lib/logger.server'
import { adminProcedure } from '../../trpc'
import { z } from 'zod'
import path from 'path'

export const uploadVotiProcedure = adminProcedure
  .input(
    z.object({
      idCalendario: z.number(),
      fileName: z.string(),
      fileSize: z.number(),
      blockDataBase64: z.string(),
    }),
  )
  .mutation(async (opts) => {
    try {
      const { fileName, fileSize, blockDataBase64 } = opts.input
      const filePath = getPathVoti(fileName)

      fs.writeFileSync(filePath, Buffer.from(blockDataBase64, 'base64'), {
        flag: 'w',
      })

      if (fs.statSync(filePath).size >= fileSize) {
        Logger.info(`Il file ${fileName} è stato completamente salvato.`)
      }
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

function getPathVoti(fileName: string) {
  return path.join(process.cwd(), `public/voti/${fileName}`)
}
