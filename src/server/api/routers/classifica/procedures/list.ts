import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { classificaSchema } from '../../classifica/schema'
import { getFantapunti } from '../../classifica/services/getFantapunti'

export const listClassificaProcedure = publicProcedure
  .input(z.object({ idTorneo: z.number() }))
  .query(async (opts) => {
    const idTorneo = +opts.input.idTorneo
    try {
      const fantaPunti = await getFantapunti(idTorneo)
      const result = await prisma.classifiche.findMany({
        select: {
          idSquadra: true,
          punti: true,
          vinteCasa: true,
          vinteTrasferta: true,
          pareggiCasa: true,
          pareggiTrasferta: true,
          perseCasa: true,
          perseTrasferta: true,
          golFatti: true,
          golSubiti: true,
          differenzaReti: true,
          giocate: true,
          Utenti: { select: { nomeSquadra: true, foto: true, maglia: true } },
        },
        where: { idTorneo },
        orderBy: [
          { punti: 'desc' },
          { golFatti: 'desc' },
          { golSubiti: 'asc' },
        ],
      })
      return result.map((c) => ({
        id: c.idSquadra,
        idSquadra: c.idSquadra,
        squadra: c.Utenti.nomeSquadra,
        foto: c.Utenti.foto,
        punti: c.punti,
        vinte: c.vinteCasa + c.vinteTrasferta,
        pareggi: c.pareggiCasa + c.pareggiTrasferta,
        perse: c.perseCasa + c.perseTrasferta,
        golFatti: c.golFatti,
        golSubiti: c.golSubiti,
        differenzaReti: c.differenzaReti,
        giocate: c.giocate,
        fantapunti: fantaPunti[c.idSquadra] ?? 0,
      }))
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })
