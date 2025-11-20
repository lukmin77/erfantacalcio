import Logger from '~/lib/logger.server'
import { publicProcedure } from '~/server/api/trpc'
import { Utenti } from '~/server/db/entities'

export const listSquadreProcedure = publicProcedure.query(async (opts) => {
  try {
    let utenti = await Utenti.find({
      select: {
        idUtente: true,
        adminLevel: true,
        lockLevel: true,
        presidente: true,
        mail: true,
        nomeSquadra: true,
        foto: true,
        importoBase: true,
        importoMulte: true,
        importoMercato: true,
        fantaMilioni: true,
      },
      order: { nomeSquadra: 'asc' },
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
})
