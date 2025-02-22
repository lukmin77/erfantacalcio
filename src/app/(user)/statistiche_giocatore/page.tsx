import { Grid } from "@mui/material";
import { Suspense } from "react";
import Giocatore from "~/components/giocatori/Giocatore";

export default function GiocatoriPage(idGiocatore: number) {
  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12}>
        <Suspense fallback={<div>Caricamento...</div>}>
          <Giocatore idGiocatore={idGiocatore} />
        </Suspense>
      </Grid>
    </Grid>
  );
}
