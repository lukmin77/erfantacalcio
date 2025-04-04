import Logger from '~/lib/logger'
import { z } from 'zod'
import { getGiocatoriVenduti, getRosaDisponibile } from './common'

import prisma from '~/utils/db'

import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from '~/server/api/trpc'

export const squadreRouter = createTRPCRouter({
  list: publicProcedure.query(async (opts) => {
    try {
      let utenti = await prisma.utenti.findMany({
        orderBy: { nomeSquadra: 'asc' },
      })

      const idSquadraUtenteConnesso = opts.ctx.session?.user?.idSquadra

      if (idSquadraUtenteConnesso) {
        const userSquadraIndex = utenti.findIndex(
          (squadra) => squadra.idUtente === idSquadraUtenteConnesso,
        )
        if (userSquadraIndex !== -1) {
          const userSquadra = utenti.splice(userSquadraIndex, 1)[0]
          if (userSquadra) utenti = [userSquadra, ...utenti]
        }
      }

      return utenti.map((squadra) => ({
        id: squadra.idUtente,
        isAdmin: squadra.adminLevel,
        isLockLevel: squadra.lockLevel,
        presidente: squadra.presidente,
        email: squadra.mail,
        squadra: squadra.nomeSquadra,
        foto: squadra.foto,
        importoAnnuale: parseFloat(squadra.importoBase.toFixed(2)),
        importoMulte: parseFloat(squadra.importoMulte.toFixed(2)),
        importoMercato: parseFloat(squadra.importoMercato.toFixed(2)),
        fantamilioni: parseFloat(squadra.fantaMilioni.toFixed(2)),
      }))
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  }),

  get: publicProcedure
    .input(
      z.object({
        idSquadra: z.number(),
      }),
    )
    .query(async (opts) => {
      const idUtente = +opts.input.idSquadra
      try {
        const utente = await prisma.utenti.findUnique({
          where: {
            idUtente: idUtente,
          },
        })
        if (utente) {
          return {
            id: utente.idUtente,
            isAdmin: utente.adminLevel,
            isLockLevel: utente.lockLevel,
            presidente: utente.presidente,
            email: utente.mail,
            squadra: utente.nomeSquadra,
            foto: utente.foto,
            importoAnnuale: parseFloat(utente.importoBase.toFixed(2)),
            importoMulte: parseFloat(utente.importoMulte.toFixed(2)),
            importoMercato: parseFloat(utente.importoMercato.toFixed(2)),
            fantamilioni: parseFloat(utente.fantaMilioni.toFixed(2)),
          }
        } else return null
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  getRosa: publicProcedure
    .input(
      z.object({
        idSquadra: z.number(),
        includeVenduti: z.boolean(),
      }),
    )
    .query(async (opts) => {
      const { idSquadra, include } = {
        idSquadra: opts.input.idSquadra,
        include: opts.input.includeVenduti,
      }
      try {
        const rosaDisponibile = await getRosaDisponibile(idSquadra)
        if (include) {
          const giocatoriVenduti = await getGiocatoriVenduti(idSquadra)
          return [...rosaDisponibile, ...giocatoriVenduti]
        }
        return rosaDisponibile
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        isAdmin: z.boolean(),
        isLockLevel: z.boolean(),
        presidente: z.string(),
        email: z.string(),
        squadra: z.string(),
        importoAnnuale: z.number(),
        importoMulte: z.number(),
        importoMercato: z.number(),
        fantamilioni: z.number(),
      }),
    )
    .mutation(async (opts) => {
      try {
        await prisma.utenti.updateMany({
          where: {
            idUtente: opts.input.id,
          },
          data: {
            presidente: opts.input.presidente,
            mail: opts.input.email,
            nomeSquadra: opts.input.squadra,
            importoBase: opts.input.importoAnnuale,
            importoMulte: opts.input.importoMulte,
            importoMercato: opts.input.importoMercato,
            fantaMilioni: opts.input.fantamilioni,
            adminLevel: opts.input.isLockLevel ? true : opts.input.isAdmin,
          },
        })
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),
})
