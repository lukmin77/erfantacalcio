import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { publicProcedure } from '~/server/api/trpc'
import { number, z } from 'zod'
import { Configurazione } from '~/config'

export const listTrasferimentiProcedure = publicProcedure
  .input(z.object({ idGiocatore: number() }))
  .query(async (opts) => {
    const idGiocatore = +opts.input.idGiocatore
    try {
      const query = await prisma.trasferimenti.findMany({
        select: {
          idTrasferimento: true,
          idGiocatore: false,
          costo: true,
          media: true,
          gol: true,
          assist: true,
          giocate: true,
          dataAcquisto: true,
          dataCessione: true,
          stagione: true,
          nomeSquadra: true,
          nomeSquadraSerieA: true,
          Utenti: { select: { nomeSquadra: true } },
          Giocatori: { select: { nome: true, ruolo: true, id_pf: true } },
          SquadreSerieA: { select: { nome: true, maglia: true } },
        },
        where: {
          AND: [
            { idGiocatore: idGiocatore },
            { hasRitirato: false },
          ],
        },
        orderBy: [{ stagione: 'desc' }, { dataAcquisto: 'desc' }],
      })

      return query.map((t) => ({
        id: t.idTrasferimento,
        id_pf: t.Giocatori.id_pf,
        idTrasferimento: t.idTrasferimento,
        nome: t.Giocatori.nome,
        ruolo: t.Giocatori.ruolo,
        squadra:
          t.Utenti?.nomeSquadra === undefined
            ? t.nomeSquadra
            : t.Utenti.nomeSquadra,
        maglia: t.SquadreSerieA?.maglia
          ? `/images/maglie/${t.SquadreSerieA.maglia}`
          : `/images/maglie/${t.nomeSquadraSerieA?.toLowerCase()}.gif`,
        squadraSerieA:
          t.SquadreSerieA?.nome === undefined
            ? t.nomeSquadraSerieA
            : t.SquadreSerieA.nome,
        costo: t.costo,
        media: t.media ? parseFloat(t.media.toFixed(2)) : 0,
        gol: t.gol,
        assist: t.assist,
        giocate: t.giocate,
        dataAcquisto: t.dataAcquisto,
        dataCessione: t.dataCessione,
        stagione: t.stagione,
        isEditVisible: t.stagione === Configurazione.stagione,
      }))
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })
