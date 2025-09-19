'use client' // Aggiungi questa direttiva in cima al file

import { Grid } from '@mui/material'
import { Suspense } from 'react'
import Formazione from '~/components/squadra/Formazione'
import FormazioneXs from '~/components/squadra/FormazioneXs'
import { useSearchParams } from 'next/navigation'
import FormazioneXsNew from '~/components/squadra/FormazioneXsNew'

export default function SchieraFormazione() {
  return (
    <Suspense fallback={<div>Caricamento dei parametri...</div>}>
      <InnerSchieraFormazione />
    </Suspense>
  )
}

function InnerSchieraFormazione() {
  const searchParams = useSearchParams()
  const isXsParam = searchParams?.get('isXs') ?? 'false' // Imposta 'false' se isXs non è presente
  const isXsNew = searchParams?.get('isXsNew') ?? 'false' // Imposta 'false' se isXsNew non è presente

  // Converti il valore da string a booleano
  const isXsBoolean = isXsParam === 'true'
  const isXsNewBoolean = isXsNew === 'true'

  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid item xs={12}>
        <Suspense fallback={<div>Caricamento...</div>}>
          {isXsBoolean && isXsNewBoolean ? <FormazioneXsNew /> : isXsBoolean ? <FormazioneXs /> : <Formazione />}
        </Suspense>
      </Grid>
    </Grid>
  )
}
