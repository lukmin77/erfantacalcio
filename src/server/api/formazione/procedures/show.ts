import Logger from '~/lib/logger.server'
import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import {
  getProssimaGiornata,
  getProssimaGiornataSerieA,
  getRosaDisponibile,
} from '~/server/utils/common'
import { GiocatoreFormazioneType } from '~/types/squadre'
import { moduloDefault } from '~/utils/helper'
import { Formazioni, Voti } from '~/server/db/entities'

export const show = protectedProcedure
  .input(
    z.object({
      idTorneo: z.number(),
    }),
  )
  .query(async (opts) => {
    const idSquadraUtente = opts.ctx.session.user.idSquadra
    const idTorneo = +opts.input.idTorneo
    try {
      const giornataSerieA = await getProssimaGiornataSerieA(false, 'asc')
      const prossimoCalendario = (
        await getProssimaGiornata(giornataSerieA)
      ).find((c) => c.idTorneo === idTorneo)
      const prossimaPartita = prossimoCalendario?.partite.find(
        (c) => c.idHome === idSquadraUtente || c.idAway === idSquadraUtente,
      )
      if (!prossimaPartita || !prossimoCalendario) {
        return null
      } else {
        const giocatoriSchierati = await Voti.find({
          select: {
            idGiocatore: true,
            titolare: true,
            riserva: true,
          },
          relations: { Formazioni: true },
          where: {
            idCalendario: prossimoCalendario.idCalendario,
            Formazioni: { idSquadra: idSquadraUtente },
          },
        })
        const datiFormazione = await Formazioni.findOne({
          select: { modulo: true },
          where: {
            idPartita: prossimaPartita.idPartita,
            idSquadra: idSquadraUtente,
          },
        })
        const rosa = await getRosaDisponibile(idSquadraUtente)
        const formazione: GiocatoreFormazioneType[] = rosa.map((r) => ({
          idGiocatore: r.idGiocatore,
          nome: r.nome,
          nomeFantagazzetta: r.nomeFantagazzetta,
          ruolo: r.ruolo,
          ruoloEsteso: r.ruoloEsteso,
          costo: r.costo,
          isVenduto: r.isVenduto,
          urlCampioncino: r.urlCampioncino,
          urlCampioncinoSmall: r.urlCampioncinoSmall,
          nomeSquadraSerieA: r.nomeSquadraSerieA,
          magliaSquadraSerieA: r.magliaSquadraSerieA,
          titolare:
            giocatoriSchierati.find((g) => g.idGiocatore === r.idGiocatore)
              ?.titolare ?? false,
          riserva:
            giocatoriSchierati.find((g) => g.idGiocatore === r.idGiocatore)
              ?.riserva ?? null,
        }))

        const dati = {
          idPartita: prossimaPartita.idPartita,
          data: prossimoCalendario.data,
          modulo: datiFormazione?.modulo ?? moduloDefault,
          giocatori: formazione,
        }

        return dati
      }
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })
