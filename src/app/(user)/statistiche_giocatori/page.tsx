import { Grid } from '@mui/material'
import { Suspense } from 'react'
import Giocatori from '~/components/giocatori/Giocatori'

export default function GiocatoriPage() {
  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12}>
        <Suspense fallback={<div>Caricamento...</div>}>
          <Giocatori />
        </Suspense>
      </Grid>
    </Grid>
  )
}
