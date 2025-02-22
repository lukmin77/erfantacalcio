'use client'
import { Grid } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Rosa from "~/components/squadra/Rosa";

export default function SquadraPage() {
  const searchParams = useSearchParams();

  if (!searchParams) {
    return <p>Errore: Parametri non trovati</p>;
  }

  const idSquadra = searchParams.get("idSquadra");
  const squadra = searchParams.get("squadra");

  // Converte idSquadra in numero e gestisce eventuali errori
  const idSquadraNumber = idSquadra ? parseInt(idSquadra) : NaN;
  
  if (isNaN(idSquadraNumber)) {
    return <p>Errore: ID Squadra non valido</p>;
  }
  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12}>
        <Suspense fallback={<div>Caricamento...</div>}>
          <Rosa idSquadra={parseInt(idSquadra!)} squadra={squadra!} />
        </Suspense>
      </Grid>
    </Grid>
  );
}
