import { Configurazione } from '~/config'
import {
  getBonusModulo,
  getGiocatoriVotoInfluente,
  getBonusSenzaVoto,
  getGolSegnati,
  getTabellino,
} from '../../../utils/common'
import { Formazioni, Partite } from '~/server/db/entities'

export async function getFormazione(idPartita: number, idSquadra: number) {
  const formazioni = await Formazioni.find({
    select: { idFormazione: true, modulo: true },
    where: { idPartita, idSquadra },
  })
  return formazioni.length > 0 ? formazioni[0] : null
}

export function mapPartite(
  partite: Partite[],
  includeTabellini: boolean,
  backOfficeMode: boolean,
) {
  return Promise.all(
    partite.map(async (p) => {
      console.info(`IdPartita: ${p.idPartita}`)

      const formazioneHome = await getFormazione(p.idPartita, p.idSquadraH ?? 0)
      const formazioneAway = await getFormazione(p.idPartita, p.idSquadraA ?? 0)
      const tabellinoHome =
        includeTabellini && formazioneHome?.idFormazione
          ? await getTabellino(formazioneHome?.idFormazione)
          : []
      const tabellinoAway =
        includeTabellini && formazioneAway?.idFormazione
          ? await getTabellino(formazioneAway?.idFormazione)
          : []
      const fantapuntiHome = includeTabellini
        ? getGiocatoriVotoInfluente(tabellinoHome).reduce(
            (acc, cur) => acc + (cur.votoBonus ?? 0),
            0,
          )
        : 0
      const fantapuntiAway = includeTabellini
        ? getGiocatoriVotoInfluente(tabellinoAway).reduce(
            (acc, cur) => acc + (cur.votoBonus ?? 0),
            0,
          )
        : 0
      const bonusModuloHome =
        includeTabellini && fantapuntiHome > 0
          ? getBonusModulo(formazioneHome?.modulo ?? '')
          : 0
      const bonusModuloAway =
        includeTabellini && fantapuntiAway > 0
          ? getBonusModulo(formazioneAway?.modulo ?? '')
          : 0
      const bonusSenzaVotoHome =
        includeTabellini && fantapuntiHome > 0
          ? getBonusSenzaVoto(getGiocatoriVotoInfluente(tabellinoHome).length)
          : 0
      const bonusSenzaVotoAway =
        includeTabellini && fantapuntiAway > 0
          ? getBonusSenzaVoto(getGiocatoriVotoInfluente(tabellinoAway).length)
          : 0
      const totaleFantapuntiHome =
        includeTabellini && fantapuntiHome > 0
          ? fantapuntiHome +
            bonusModuloHome +
            bonusSenzaVotoHome +
            (p.fattoreCasalingo && fantapuntiHome > 0
              ? Configurazione.bonusFattoreCasalingo
              : 0)
          : 0
      const totaleFantapuntiAway =
        includeTabellini && fantapuntiAway > 0
          ? fantapuntiAway + bonusModuloAway + bonusSenzaVotoAway
          : 0
      const golSegnatiHome =
        includeTabellini && backOfficeMode && fantapuntiHome > 0
          ? getGolSegnati(totaleFantapuntiHome)
          : 0
      const golSegnatiAway =
        includeTabellini && backOfficeMode && fantapuntiAway > 0
          ? getGolSegnati(totaleFantapuntiAway)
          : 0

      return {
        idPartita: p.idPartita,
        escludi: false,
        idFormazioneHome: formazioneHome?.idFormazione,
        idHome: p.idSquadraH,
        isFattoreHome: p.fattoreCasalingo,
        fattoreCasalingo: Configurazione.bonusFattoreCasalingo,
        squadraHome: p.SquadraHome?.nomeSquadra,
        fotoHome: p.SquadraHome?.foto,
        multaHome: p.hasMultaH,
        golHome: p.golH,
        tabellinoHome: tabellinoHome,
        bonusModuloHome,
        bonusSenzaVotoHome,
        fantapuntiHome,
        calcoloGolSegnatiHome: golSegnatiHome,
        totaleFantapuntiHome,
        idFormazioneAway: formazioneAway?.idFormazione,
        idAway: p.idSquadraA,
        squadraAway: p.SquadraAway?.nomeSquadra,
        fotoAway: p.SquadraAway?.foto,
        multaAway: p.hasMultaA,
        golAway: p.golA,
        tabellinoAway: tabellinoAway,
        bonusModuloAway,
        bonusSenzaVotoAway,
        fantapuntiAway,
        calcoloGolSegnatiAway: golSegnatiAway,
        totaleFantapuntiAway,
      }
    }),
  )
}
