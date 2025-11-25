import { z } from 'zod'
import { uploadFile } from '~/utils/blobVercelUtils'
import { protectedProcedure } from '~/server/api/trpc'

export const uploadFotoVercelProcedure = protectedProcedure
  .input(z.object({ fileName: z.string(), fileData: z.string() }))
  .mutation(async (opts) => {
    try {
      const { fileName, fileData } = opts.input
      const blob = await uploadFile(fileData, fileName, 'fotoprofili')
      console.info('file blob: ', blob)
      console.info(`Il file ${fileName} è stato completamente salvato.`)
      return blob.url
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })
