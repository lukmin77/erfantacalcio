'use client';

import { Grid, Typography } from "@mui/material";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import ViewTabellini from "~/components/cardPartite/ViewTabellini";

export default function Tabellino() {
  const searchParams = useSearchParams();
  
  // Recupera i valori della query string
  const idPartita = searchParams?.get('idPartita');
  const idCalendario = searchParams?.get('idCalendario');

  // Stato per la partita e il calendario convertiti in numero
  const [partita, setPartita] = useState<number | null>(null);
  const [calendario, setCalendario] = useState<number | null>(null);

  useEffect(() => {
    if (idPartita) {
      // Converte i valori in numeri
      const parsedPartita = Number(idPartita);
      const parsedCalendario = Number(idCalendario);

      // Verifica se entrambi i valori sono numeri validi
      if (!isNaN(parsedPartita)) {
        setPartita(parsedPartita);
        setCalendario(parsedCalendario);
      } else {
        setPartita(null);
        setCalendario(null);
      }
    }
  }, [idPartita, idCalendario]);


  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12}>
        {/* Se non ci sono idPartita o idCalendario, o se non sono numeri validi, mostra un messaggio di errore */}
        {!partita ? (
          <Typography variant="h6" color="error">
            Partita non valida
          </Typography>
        ) : (
          <ViewTabellini idPartita={partita}></ViewTabellini>
        )}
      </Grid>
    </Grid>
  );
}
