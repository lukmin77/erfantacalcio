export type CalendarioType = {
  id: number;
  idTorneo: number;
  nome: string;
  gruppoFase: string | null;
  giornata: number;
  giornataSerieA: number;
  isGiocata: boolean;
  isSovrapposta: boolean;
  isRecupero: boolean;
  data: string | undefined; // Stringa formattata come ISOString
  dataFine: string | undefined; // Stringa formattata come ISOString
  girone: number | null;
  isSelected: boolean;
};
