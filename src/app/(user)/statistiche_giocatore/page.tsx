import { Grid } from "@mui/material";
import { Suspense } from "react";
import Giocatore from "~/components/giocatori/Giocatore";

export default function GiocatoriPage({ params }: { params: { idGiocatore: string } }) {
  const id = Number(params.idGiocatore); 

  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12}>
        <Suspense fallback={<div>Caricamento...</div>}>
          <Giocatore idGiocatore={id} />
        </Suspense>
      </Grid>
    </Grid>
  );
}
