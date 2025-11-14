import Logger from '~/lib/logger.server'
import { protectedProcedure } from '~/server/api/trpc'
import fs from 'fs'
import path from 'path'

export const deleteFotoProcedure = protectedProcedure.mutation(async (opts) => {
  try {
    const directory = 'public/images/fotoprofili/'

    fs.readdir(directory, (err, files) => {
      if (err) throw err

      for (const file of files) {
        const userFilePattern = new RegExp(`foto_${opts.ctx.session.user.idSquadra}_.*`)
        if (userFilePattern.test(file)) {
          fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err
          })
          Logger.info(`Eliminato file: ${file}`)
        }
      }
    })
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})
