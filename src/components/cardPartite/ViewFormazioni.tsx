'use client'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { api } from '~/utils/api'
import { formatDateFromIso } from '~/utils/dateUtils'
import { Configurazione } from '~/config'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Modal from '../modal/Modal'
import { useSearchParams } from 'next/navigation'
import Giocatore from '../giocatori/Giocatore'

function ViewFormazioni() {
  const searchParams = useSearchParams()

  // Recupera i valori della query string
  const idPartita = searchParams?.get('idPartita')
  const idCalendario = searchParams?.get('idCalendario')

  // Stato per la partita e il calendario convertiti in numero
  const [partita, setPartita] = useState<number | null>(null)

  useEffect(() => {
    if (idPartita) {
      // Converte i valori in numeri
      const parsedPartita = Number(idPartita)

      // Verifica se entrambi i valori sono numeri validi
      if (!isNaN(parsedPartita)) {
        setPartita(parsedPartita)
      } else {
        setPartita(null)
      }
    }
  }, [idPartita, idCalendario])

  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('md'))
  const [idGiocatore, setIdGiocatore] = useState<number | undefined>()
  const [openModalCalendario, setOpenModalCalendario] = useState(false)

  const formazioniList = api.partita.getFormazioni.useQuery(
    { idPartita: partita! },
    {
      enabled: !!partita,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  const calendario = formazioniList.data?.Calendario
  const infoPartita = formazioniList.data?.Calendario.partite[0]
  const altrePartite = formazioniList.data?.AltrePartite
  const formazioneHome = formazioniList.data?.FormazioneHome
  const formazioneAway = formazioniList.data?.FormazioneAway

  const handleModalClose = () => {
    setOpenModalCalendario(false)
  }

  const handleStatGiocatore = (idGiocatore: number) => {
    setIdGiocatore(idGiocatore)
    setOpenModalCalendario(true)
  }

  return (
    <>
      <Grid container spacing={0}>
        {calendario && (
          <>
            <Grid item xs={12}>
              <Typography variant={'h4'}>{calendario.Title}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant={'body2'}>
                {`Calcio d'inizio ${calendario.SubTitle} il 
                                ${formatDateFromIso(
                                  calendario.data,
                                  'dd/MM/yyyy',
                                )} alle 
                                ${formatDateFromIso(calendario.data, 'HH:mm')}`}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ pr: '10px' }}>
              {calendario && (
                <Card>
                  <CardHeader
                    title={infoPartita?.squadraHome}
                    titleTypographyProps={{ variant: 'h4' }}
                    subheader={
                      formazioneHome
                        ? `${formatDateFromIso(
                            formazioneHome?.dataOra.toISOString(),
                            'dd/MM',
                          )} alle
                                        ${formatDateFromIso(
                                          formazioneHome?.dataOra.toISOString(),
                                          'HH:mm',
                                        )}`
                        : `Formazione non rilasciata, multa di ${Configurazione.importoMulta} €`
                    }
                    avatar={
                      <Avatar
                        alt={infoPartita?.squadraHome ?? ''}
                        src={infoPartita?.fotoHome ?? ''}
                        sx={{ display: { xs: 'none', sm: 'block' }, mr: '5px' }}
                      ></Avatar>
                    }
                  ></CardHeader>
                  <CardContent>
                    {formazioneHome && (
                      <>
                        <Grid container spacing={0}>
                          <Grid item xs={12} sm={7}>
                            <Typography variant={'h6'} sx={{ m: '3px' }}>
                              <b>Modulo: {formazioneHome.modulo}</b>
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sm={5}
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                          >
                            <Typography variant={'h6'}>
                              <b>Panchina</b>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={7}>
                            <Grid container spacing={0}>
                              {formazioneHome.Voti.filter(
                                (g) => g.titolare,
                              ).map((g) => (
                                <>
                                  <Grid item xs={2} sm={1}>
                                    <Tooltip
                                      title={
                                        g.Giocatori.Trasferimenti[0]
                                          ?.SquadreSerieA?.nome
                                      }
                                    >
                                      <Image
                                        src={`/images/maglie/${
                                          g.Giocatori.Trasferimenti[0]
                                            ?.SquadreSerieA?.maglia ??
                                          'NoSerieA.gif'
                                        }`}
                                        width={26}
                                        height={22}
                                        alt={g.Giocatori.nome}
                                      />
                                    </Tooltip>
                                  </Grid>
                                  <Grid item xs={2} sm={1}>
                                    <Typography variant="body2">
                                      {g.Giocatori.ruolo}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={8} sm={10}>
                                    <Typography
                                      variant="body2"
                                      sx={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        handleStatGiocatore(
                                          g.Giocatori.idGiocatore,
                                        )
                                      }
                                    >
                                      {g.Giocatori.nome}
                                    </Typography>
                                  </Grid>
                                </>
                              ))}
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{ display: { xs: 'block', sm: 'none' } }}
                          >
                            <Typography variant={'h6'}>
                              <b>Panchina</b>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Grid container spacing={0}>
                              {formazioneHome.Voti.filter(
                                (g) => !g.titolare,
                              ).map((g) => (
                                <>
                                  <Grid item xs={2} sm={2}>
                                    <Tooltip
                                      title={
                                        g.Giocatori.Trasferimenti[0]
                                          ?.SquadreSerieA?.nome
                                      }
                                    >
                                      <Image
                                        src={`/images/maglie/${
                                          g.Giocatori.Trasferimenti[0]
                                            ?.SquadreSerieA?.maglia ??
                                          'NoSerieA.gif'
                                        }`}
                                        width={26}
                                        height={22}
                                        alt={g.Giocatori.nome}
                                      />
                                    </Tooltip>
                                  </Grid>
                                  <Grid item xs={2} sm={2}>
                                    <Typography variant="body2">
                                      {g.Giocatori.ruolo} ({g.riserva})
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={8} sm={8}>
                                    <Typography
                                      variant="body2"
                                      sx={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        handleStatGiocatore(
                                          g.Giocatori.idGiocatore,
                                        )
                                      }
                                    >
                                      {g.Giocatori.nome}
                                    </Typography>
                                  </Grid>
                                </>
                              ))}
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={6} sx={{ pl: '10px' }}>
              {calendario && (
                <Card>
                  <CardHeader
                    title={infoPartita?.squadraAway}
                    titleTypographyProps={{ variant: 'h4' }}
                    subheader={
                      formazioneAway
                        ? `${formatDateFromIso(
                            formazioneAway?.dataOra.toISOString(),
                            'dd/MM',
                          )} alle
                                        ${formatDateFromIso(
                                          formazioneAway?.dataOra.toISOString(),
                                          'HH:mm',
                                        )}`
                        : `Formazione non rilasciata, prevista multa di ${Configurazione.importoMulta} €`
                    }
                    avatar={
                      <Avatar
                        alt={infoPartita?.squadraAway ?? ''}
                        src={infoPartita?.fotoAway ?? ''}
                        sx={{ display: { xs: 'none', sm: 'block' }, mr: '5px' }}
                      ></Avatar>
                    }
                  ></CardHeader>
                  <CardContent>
                    {formazioneAway && (
                      <>
                        <Grid container spacing={0}>
                          <Grid item xs={12} sm={7}>
                            <Typography variant={'h6'} sx={{ m: '3px' }}>
                              <b>Modulo: {formazioneAway.modulo}</b>
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sm={5}
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                          >
                            <Typography variant={'h6'}>
                              <b>Panchina</b>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={7}>
                            <Grid container spacing={0}>
                              {formazioneAway.Voti.filter(
                                (g) => g.titolare,
                              ).map((g) => (
                                <>
                                  <Grid item xs={2} sm={1}>
                                    <Tooltip
                                      title={
                                        g.Giocatori.Trasferimenti[0]
                                          ?.SquadreSerieA?.nome
                                      }
                                    >
                                      <Image
                                        src={`/images/maglie/${
                                          g.Giocatori.Trasferimenti[0]
                                            ?.SquadreSerieA?.maglia ??
                                          'NoSerieA.gif'
                                        }`}
                                        width={26}
                                        height={22}
                                        alt={g.Giocatori.nome}
                                      />
                                    </Tooltip>
                                  </Grid>
                                  <Grid item xs={2} sm={1}>
                                    <Typography variant="body2">
                                      {g.Giocatori.ruolo}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={8} sm={10}>
                                    <Typography
                                      variant="body2"
                                      sx={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        handleStatGiocatore(
                                          g.Giocatori.idGiocatore,
                                        )
                                      }
                                    >
                                      {g.Giocatori.nome}
                                    </Typography>
                                  </Grid>
                                </>
                              ))}
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{ display: { xs: 'block', sm: 'none' } }}
                          >
                            <Typography variant={'h6'}>
                              <b>Panchina</b>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Grid container spacing={0}>
                              {formazioneAway.Voti.filter(
                                (g) => !g.titolare,
                              ).map((g) => (
                                <>
                                  <Grid item xs={2} sm={2}>
                                    <Tooltip
                                      title={
                                        g.Giocatori.Trasferimenti[0]
                                          ?.SquadreSerieA?.nome
                                      }
                                    >
                                      <Image
                                        src={`/images/maglie/${
                                          g.Giocatori.Trasferimenti[0]
                                            ?.SquadreSerieA?.maglia ??
                                          'NoSerieA.gif'
                                        }`}
                                        width={26}
                                        height={22}
                                        alt={g.Giocatori.nome}
                                      />
                                    </Tooltip>
                                  </Grid>
                                  <Grid item xs={2} sm={2}>
                                    <Typography variant="body2">
                                      {g.Giocatori.ruolo} ({g.riserva})
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={8} sm={8}>
                                    <Typography
                                      variant="body2"
                                      sx={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        handleStatGiocatore(
                                          g.Giocatori.idGiocatore,
                                        )
                                      }
                                    >
                                      {g.Giocatori.nome}
                                    </Typography>
                                  </Grid>
                                </>
                              ))}
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </Grid>
          </>
        )}
        {partita && (
          <Grid item xs={12} justifyItems={'flex-end'}>
            <Typography variant={'h5'}>
              Altre partite:
              <Select
                size="small"
                variant="outlined"
                labelId="select-label-partita"
                margin="dense"
                required
                sx={{ ml: '10px' }}
                name="giornata"
                onChange={(e) => setPartita(e.target.value as number)}
                defaultValue={partita}
              >
                {altrePartite?.map((p, index) => (
                  <MenuItem
                    value={p.idPartita}
                    key={`giornata_${p.idPartita}`}
                    selected={index === 0}
                  >{`${p.Utenti_Partite_idSquadraHToUtenti?.nomeSquadra} - ${p.Utenti_Partite_idSquadraAToUtenti?.nomeSquadra}`}</MenuItem>
                ))}
              </Select>
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sx={{ height: '100px' }}>
          <></>
        </Grid>
      </Grid>

      <Modal
        title={'Statistica giocatore'}
        open={openModalCalendario}
        onClose={handleModalClose}
        width={isXs ? '98%' : '1266px'}
        height={isXs ? '98%' : ''}
      >
        <Divider />
        <Box sx={{ mt: 1, gap: '0px', flexWrap: 'wrap' }}>
          {idGiocatore !== undefined && <Giocatore idGiocatore={idGiocatore} />}
        </Box>
      </Modal>
    </>
  )
}

export default ViewFormazioni
