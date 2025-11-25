export type GiornataAdminType = {
  idCalendario: number
  idTorneo: number
  giornata: number
  giornataSerieA: number
  isGiocata: boolean
  isSovrapposta: boolean
  data: string | undefined
  dataFine: string | undefined
  girone: string | number | null
  partite: PartitaAdminType[]
  Torneo: string
  Descrizione: string
  Title: string
  SubTitle: string
}

export type votoGiocatoreType = {
  idVoto: number
  voto: Number | null
  ruolo: string
  ammonizione: Number | null
  espulsione: Number | null
  gol: Number | null
  assist: Number | null
  altriBonus: Number | null
  autogol: Number | null
  titolare: boolean
  riserva: number | null
  idGiocatore: number
  votoBonus: number
  isSostituito: boolean
  isVotoInfluente: boolean
}

export type PartitaAdminType = {
  idPartita: number
  idHome: number | null
  idFormazioneHome: number | undefined
  squadraHome: string | null | undefined
  fotoHome: string | null | undefined
  multaHome: boolean
  golHome: number | null
  idAway: number | null
  idFormazioneAway: number | undefined
  squadraAway: string | null | undefined
  fotoAway: string | null | undefined
  multaAway: boolean
  golAway: number | null
  isFattoreHome: boolean
  fattoreCasalingo: number
  tabellinoHome: votoGiocatoreType[]
  tabellinoAway: votoGiocatoreType[]
  bonusModuloHome: number
  bonusModuloAway: number
  bonusSenzaVotoHome: number
  bonusSenzaVotoAway: number
  fantapuntiHome: number
  fantapuntiAway: number
  calcoloGolSegnatiHome: number
  calcoloGolSegnatiAway: number
  totaleFantapuntiHome: number
  totaleFantapuntiAway: number
  escludi: boolean
}
