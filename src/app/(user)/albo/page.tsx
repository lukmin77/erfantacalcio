import { Grid } from "@mui/material";
import { Suspense } from "react";
import Albo from "~/components/home/Albo";

export default function AlboPage() {
  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12}>
        <Suspense fallback={<div>Caricamento...</div>}>
          <Albo />
        </Suspense>
      </Grid>
    </Grid>
  );
}
