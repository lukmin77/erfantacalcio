import { type Decimal } from '@prisma/client/runtime/library'

export type GiocatoreType = {
  idGiocatore: number
  nome: string
  nomeFantagazzetta: string | null
  ruolo: string
}

export interface iGiocatoreStats {
  media: Decimal | null
  mediabonus: Decimal | null
  golfatti: Decimal | null
  golsubiti: Decimal | null
  assist: Decimal | null
  ammonizioni: Decimal | null
  espulsioni: Decimal | null
  giocate: number | null
  ruolo: string | null
  nome: string
  nomefantagazzetta: string | null
  idgiocatore: number
  maglia: string
  squadraSerieA: string
  squadra: string | null
  idSquadra: number | null
}

export interface iRosaStats {
  media: Decimal | null
  mediabonus: Decimal | null
  golfatti: Decimal | null
  golsubiti: Decimal | null
  assist: Decimal | null
  giocate: number | null
  ruolo: string | null
  nome: string
  idgiocatore: number
  maglia: string
  squadraSerieA: string
  idSquadra: number | null
}
