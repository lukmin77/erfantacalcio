import React, { useEffect, useState } from 'react'
import { api } from '~/utils/api'
import { Alert, Box, Skeleton, Stack, Typography } from '@mui/material'
import CardPartite from '../cardPartite/CardPartite'
import CheckIcon from '@mui/icons-material/CheckCircle'
import { z } from 'zod'
import { giornataSchema } from '~/schemas/schemas'


interface CalendarioProps {
  prefixTitle: string
  tipo: 'risultati' | 'prossima'
}

export default function Calendario({ prefixTitle, tipo }: CalendarioProps) {
  const calendarioList =
    tipo === 'prossima'
      ? api.calendario.getProssimeGiornate.useQuery(undefined, {
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        })
      : api.calendario.getUltimiRisultati.useQuery(undefined, {
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        })
  const [errorMessage, setErrorMessage] = useState('')
  const [giornata, setGiornata] = useState<z.infer<typeof giornataSchema>[]>()

  useEffect(() => {
    if (
      !calendarioList.isFetching &&
      calendarioList.isSuccess &&
      calendarioList.data
    ) {
      setGiornata(calendarioList.data)
    }
  }, [calendarioList.data, calendarioList.isSuccess, calendarioList.isFetching])

  useEffect(() => {
    if (calendarioList.isError) {
      setErrorMessage('Si è verificato un errore in fase di caricamento')
    }
  }, [calendarioList.isError])

  return (
    <>
      {!calendarioList.isLoading && giornata && (
        <CardPartite
          giornata={giornata}
          prefixTitle={prefixTitle}
          maxWidth={600}
          withAvatar={true}
        ></CardPartite>
      )}
      {calendarioList.isLoading && (
        <Box>
          <Skeleton width="100%" height={70} animation="pulse">
            <Typography>.</Typography>
          </Skeleton>
          <Skeleton width="100%" height={70} animation="pulse">
            <Typography>.</Typography>
          </Skeleton>
          <Skeleton width="100%" height={70} animation="pulse">
            <Typography>.</Typography>
          </Skeleton>
          <Skeleton width="100%" height={70} animation="pulse">
            <Typography>.</Typography>
          </Skeleton>
        </Box>
      )}
      {errorMessage && (
        <Stack sx={{ width: '100%' }} spacing={0}>
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
            {errorMessage}
          </Alert>
        </Stack>
      )}
    </>
  )
}
