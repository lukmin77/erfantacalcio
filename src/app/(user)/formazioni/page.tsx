import { Grid } from '@mui/material'
import { Suspense } from 'react'
import ViewFormazioni from '~/components/cardPartite/ViewFormazioni'

export default function Formazione() {
  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12}>
        <Suspense fallback={<div>Caricamento...</div>}>
          <ViewFormazioni></ViewFormazioni>
        </Suspense>
      </Grid>
    </Grid>
  )
}
