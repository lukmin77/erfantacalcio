export type GiornataType = {
  idCalendario: number
  idTorneo: number
  giornata: number
  giornataSerieA: number
  isGiocata: boolean
  isSovrapposta: boolean
  isRecupero: boolean
  data: string | undefined
  dataFine: string | undefined
  girone: string | number | null
  partite: PartitaType[]
  Torneo: string
  Descrizione: string
  Title: string
  SubTitle: string
}

type PartitaType = {
  idPartita: number
  idHome: number | null
  squadraHome: string | null | undefined
  fotoHome: string | null | undefined
  multaHome: boolean
  golHome: number | null
  idAway: number | null
  squadraAway: string | null | undefined
  fotoAway: string | null | undefined
  multaAway: boolean
  golAway: number | null
  isFattoreHome: boolean
}

export interface iTornei {
  idTorneo: number
  nome: string
  gruppoFase: string | null
}

export interface iUtentePartita {
  nomeSquadra: string | null
  foto: string | null
}

export interface iPartita {
  idPartita: number
  idSquadraH: number | null
  idSquadraA: number | null
  hasMultaH: boolean
  hasMultaA: boolean
  golH: number | null
  golA: number | null
  fattoreCasalingo: boolean
  Utenti_Partite_idSquadraHToUtenti: iUtentePartita | null
  Utenti_Partite_idSquadraAToUtenti: iUtentePartita | null
}

export interface iCalendarioPartite {
  idCalendario: number
  giornata: number
  giornataSerieA: number
  hasGiocata: boolean // Modificato il nome della proprietà
  hasSovrapposta: boolean // Modificato il nome della proprietà
  hasDaRecuperare: boolean
  data: Date | null
  dataFine: Date | null
  girone: string | number | null // Modificato il tipo per accettare anche number | null
  Tornei: iTornei
  Partite: iPartita[]
}

export type Moduli =
  | '3-4-3'
  | '4-3-3'
  | '4-4-2'
  | '3-5-2'
  | '5-3-2'
  | '5-4-1'
  | '4-5-1'
export type Ruoli = 'P' | 'D' | 'C' | 'A'
