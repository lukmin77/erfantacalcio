import { Grid } from "@mui/material";
import { Suspense } from "react";
import Rosa from "~/components/squadra/Rosa";

export default function SquadraPage({ params }: { params: { idSquadra: string; squadra: string } }) {
  const idSquadra = Number(params.idSquadra);

  if (isNaN(idSquadra)) {
    return <p>Errore: ID Squadra non valido</p>;
  }

  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12}>
        <Suspense fallback={<div>Caricamento...</div>}>
          <Rosa idSquadra={idSquadra} squadra={params.squadra} />
        </Suspense>
      </Grid>
    </Grid>
  );
}
