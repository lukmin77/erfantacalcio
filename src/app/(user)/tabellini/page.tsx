import { Grid } from "@mui/material";
import { Suspense } from "react";
import ViewTabellini from "~/components/cardPartite/ViewTabellini";

export default function Tabellino() {
  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12}>
        <Suspense fallback={<div>Caricamento...</div>}>
          <ViewTabellini></ViewTabellini>
        </Suspense>
      </Grid>
    </Grid>
  );
}
