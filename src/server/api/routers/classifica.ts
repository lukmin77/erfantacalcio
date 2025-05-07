import Logger from '~/lib/logger.server'
import { z } from 'zod'

import prisma from '~/utils/db'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const classificaSchema = z.object({
  idSquadra: z.number(),
  squadra: z.string(),
  foto: z.string().nullable(),
  punti: z.number(),
  vinte: z.number(),
  pareggi: z.number(),
  perse: z.number(),
  golFatti: z.number(),
  golSubiti: z.number(),
  differenzaReti: z.number(),
  giocate: z.number(),
  fantapunti: z.number(),
})


export const classificaRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        idTorneo: z.number(),
      }),
    )
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
            Utenti: {
              select: { nomeSquadra: true, foto: true },
            },
          },
          where: {
            idTorneo: idTorneo,
          },
          orderBy: [
            { punti: 'desc' },
            { golFatti: 'desc' },
            { golSubiti: 'asc' },
          ],
        })

        return result.map<z.infer<typeof classificaSchema>>((c) => ({
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
    }),
})

async function getFantapunti(idTorneo: number) {
  const puntiHome = (
    await prisma.partite.groupBy({
      by: ['idSquadraH'],
      _sum: { punteggioH: true },
      where: {
        Calendario: { idTorneo: idTorneo },
      },
    })
  ).map((c) => ({
    idSquadra: c.idSquadraH ?? 0,
    fantapunti: c._sum.punteggioH?.toNumber() ?? 0,
  }))
  //Logger.debug(`fantapuntiHome`, { ...puntiHome, action: 'getFantapunti' });

  const puntiAway = (
    await prisma.partite.groupBy({
      by: ['idSquadraA'],
      _sum: { punteggioA: true },
      where: {
        Calendario: { idTorneo: idTorneo },
      },
    })
  ).map((c) => ({
    idSquadra: c.idSquadraA ?? 0,
    fantapunti: c._sum.punteggioA?.toNumber() ?? 0,
  }))
  //Logger.debug(`fantapuntiAway`, { ...puntiAway, action: 'getFantapunti' });

  // Unisco i risultati delle due query in un unico array
  const punti = puntiHome.concat(puntiAway).reduce(
    (acc, curr) => {
      const idSquadra = curr.idSquadra ?? curr.idSquadra ?? 0
      const fantapunti = curr.fantapunti ?? curr.fantapunti ?? 0
      acc[idSquadra] = (acc[idSquadra] ?? 0) + fantapunti
      return acc
    },
    {} as Record<number, number>,
  )
  //Logger.debug(`fantapuntiTotali`, { ...punti, action: 'getFantapunti' });

  return punti
}
