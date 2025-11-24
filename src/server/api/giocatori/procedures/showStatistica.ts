import { z } from 'zod'
import { publicProcedure } from '../../trpc'
import { Configurazione } from '~/config'
import { getRuoloEsteso, normalizeCampioncinoUrl } from '~/utils/helper'
import { Giocatori, Trasferimenti, Voti } from '~/server/db/entities'
import { IsNull } from 'typeorm'

export const showStatistica = publicProcedure
  .input(
    z.object({
      idGiocatore: z.number(),
    }),
  )
  .query(async (opts) => {
    const idGiocatore = +opts.input.idGiocatore
    try {
      const giocatore = await Giocatori.findOne({
        select: { ruolo: true, nome: true, nomeFantaGazzetta: true },
        where: { idGiocatore: idGiocatore },
      })

      const trasferimento = await Trasferimenti.findOne({
        select: {
          costo: true,
          dataAcquisto: true,
          SquadreSerieA: { nome: true, maglia: true },
          Utenti: { nomeSquadra: true },
        },
        relations: { SquadreSerieA: true, Utenti: true },
        where: { idGiocatore: idGiocatore , dataCessione: IsNull() },
        order: { idTrasferimento: 'desc' },
      })

      if (giocatore) {
        const raw = await Voti.createQueryBuilder('voti')
          .select('AVG(voti.voto)', 'avgVoto')
          .addSelect('SUM(voti.ammonizione)', 'sumAmmonizione')
          .addSelect('SUM(voti.espulsione)', 'sumEspulsione')
          .addSelect('SUM(voti.gol)', 'sumGol')
          .addSelect('SUM(voti.assist)', 'sumAssist')
          .addSelect('COUNT(voti.idCalendario)', 'countCalendario')
          .leftJoin('voti.Calendario', 'calendario')
          .where('voti.idGiocatore = :idGiocatore', { idGiocatore })
          .andWhere('voti.voto > 0')
          .andWhere(
            '(calendario.hasSovrapposta = false OR (calendario.hasSovrapposta = true AND calendario.idTorneo = :idTorneo))',
            { idTorneo: 1 },
          )
          .getRawOne()

        const result = {
          _avg: { voto: raw?.avgVoto != null ? Number(raw.avgVoto) : null },
          _sum: {
            ammonizione: Number(raw?.sumAmmonizione ?? 0),
            espulsione: Number(raw?.sumEspulsione ?? 0),
            gol: Number(raw?.sumGol ?? 0),
            assist: Number(raw?.sumAssist ?? 0),
          },
          _count: { idCalendario: Number(raw?.countCalendario ?? 0) },
        }

        return {
          ruolo: giocatore.ruolo,
          nome: giocatore.nome,
          nomeFantagazzetta: giocatore.nomeFantaGazzetta,
          media: result._avg.voto?.toFixed(2),
          gol:
            giocatore.ruolo === 'P'
              ? Number(result._sum.gol) * Configurazione.bonusGolSubito
              : Number(result._sum.gol) / Configurazione.bonusGol,
          assist: Number(result._sum.assist) / Configurazione.bonusAssist,
          ammonizioni: Math.abs(
            Number(result._sum.ammonizione) / Configurazione.bonusAmmonizione,
          ),
          espulsioni: Math.abs(
            Number(result._sum.espulsione) / Configurazione.bonusEspulsione,
          ),
          giocate: Number(result._count.idCalendario),
          costo: trasferimento?.costo,
          dataAcquisto: trasferimento?.dataAcquisto,
          squadraSerieA: trasferimento?.SquadreSerieA?.nome,
          magliaSerieA: trasferimento?.SquadreSerieA?.maglia,
          squadra: trasferimento?.Utenti?.nomeSquadra,
          ruoloEsteso: getRuoloEsteso(giocatore.ruolo),
          isVenduto: false,
          urlCampioncino: normalizeCampioncinoUrl(
            Configurazione.urlCampioncino,
            giocatore.nome,
            giocatore.nomeFantaGazzetta,
          ),
          urlCampioncinoSmall: normalizeCampioncinoUrl(
            Configurazione.urlCampioncinoSmall,
            giocatore.nome,
            giocatore.nomeFantaGazzetta,
          ),
        }
      }
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })
