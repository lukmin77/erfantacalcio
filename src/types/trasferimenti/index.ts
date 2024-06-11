
export type trasferimentoType = {
    idTrasferimento: number;
    idGiocatore: number;
    idSquadraSerieA: number | null;
    idSquadra: number | null;
    costo: number;
    dataAcquisto: Date;
    dataCessione: Date | null;
}

export type trasferimentoListType = {
    idTrasferimento: number;
    nome: string;
    ruolo: string;
    squadra: string | null;
    squadraSerieA: string | null;
    maglia: string;
    costo: number;
    media: number;
    gol: number | null;
    assist: number | null;
    giocate: number | null;
    dataAcquisto: string;
    dataCessione: string | undefined;
    stagione: string;
};