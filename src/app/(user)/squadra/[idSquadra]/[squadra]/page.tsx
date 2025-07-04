import { Grid } from '@mui/material'
import { Suspense } from 'react'
import Rosa from '~/components/squadra/Rosa'
import StatisticaSquadra from '~/components/squadra/Squadra';

export default function SquadraPage({
  params,
}: {
  params: { idSquadra: string; squadra: string }
}) {
  const idSquadra = Number(params.idSquadra)

  if (isNaN(idSquadra)) {
    return <p>Errore: ID Squadra non valido</p>
  }

  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12} md={2}>
        <Suspense fallback={<div>Caricamento...</div>}>
          <StatisticaSquadra idSquadra={idSquadra} />
        </Suspense>
      </Grid>
      <Grid item xs={12} md={10}>
        <Suspense fallback={<div>Caricamento...</div>}>
          <Rosa
            idSquadra={idSquadra}
            squadra={params.squadra.replace('%20', ' ')}
          />
        </Suspense>
      </Grid>
    </Grid>
  )
}
