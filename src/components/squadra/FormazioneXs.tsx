'use client'
import {
  Analytics,
  ExpandMore,
  HourglassTop,
  ResetTv,
  Looks3Outlined,
  Looks4Outlined,
  Looks5Outlined,
  Looks6Outlined,
  LooksOneOutlined,
  LooksTwoOutlined,
  Save,
} from '@mui/icons-material'
import {
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Divider,
  Tooltip,
  Slide,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { api } from '~/utils/api'
import React, { useEffect, useState } from 'react'
import { type Moduli } from '~/types/common'
import { getShortName, moduloDefault } from '~/utils/helper'
import {
  type GiocatoreFormazioneType,
  type GiocatoreType,
} from '~/types/squadre'
import Image from 'next/image'
import Modal from '../modal/Modal'
import Giocatore from '../giocatori/Giocatore'
import {
  checkDataFormazione,
  sortPlayersByRoleDescThenCostoDesc,
  sortPlayersByRoleDescThenRiserva,
  calcolaCodiceFormazione,
  allowedFormations,
  formatModulo,
  getPlayerStylePosition,
} from './utils'
import { giornataSchema } from '~/server/api/routers/common'
import { z } from 'zod'

function FormazioneXs() {
  const session = useSession()
  const idSquadra = parseInt(session.data?.user?.id ?? '0')
  const [idGiocatoreStat, setIdGiocatoreStat] = useState<number>()
  const [openModalCalendario, setOpenModalCalendario] = useState(false)
  const [enableRosa, setEnableRosa] = useState(false)
  const [message, setMessage] = useState('')
  const [giornate, setGiornate] = useState<z.infer<typeof giornataSchema>[]>([])
  const [idTorneo, setIdTorneo] = useState<number>()
  const [rosa, setRosa] = useState<GiocatoreFormazioneType[]>([])
  const [campo, setCampo] = useState<GiocatoreFormazioneType[]>([])
  const [panca, setPanca] = useState<GiocatoreFormazioneType[]>([])
  const [idPartita, setIdPartita] = useState<number>()
  const [modulo, setModulo] = useState<Moduli>(moduloDefault)
  const [openAlert, setOpenAlert] = useState(false)
  const [saving, setSaving] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'success',
  )

  const calendarioProssima = api.formazione.getGiornateDaGiocare.useQuery(
    undefined,
    { refetchOnWindowFocus: false, refetchOnReconnect: false },
  )
  const saveFormazione = api.formazione.create.useMutation({
    onSuccess: async () => {
      setAlertMessage('Salvataggio completato')
      setAlertSeverity('success')
    },
  })
  const formazioneList = api.formazione.get.useQuery(
    { idTorneo: idTorneo! },
    {
      enabled: !!idTorneo,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )
  const rosaList = api.squadre.getRosa.useQuery(
    { idSquadra: idSquadra, includeVenduti: false },
    {
      enabled: enableRosa,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  useEffect(() => {
    if (calendarioProssima.data) {
      if (
        calendarioProssima.data.length > 0 &&
        checkDataFormazione(calendarioProssima.data[0]?.data)
      ) {
        setEnableRosa(true)
        setIdTorneo(calendarioProssima.data[0]?.idTorneo)
      } else setMessage('Formazione non rilasciabile')
      setGiornate(calendarioProssima.data)
    }
  }, [calendarioProssima.data])

  useEffect(() => {
    if (rosaList.data) {
      const rosaConRuolo = rosaList.data.map((giocatore: GiocatoreType) => ({
        ...giocatore,
        titolare: false,
        riserva: null,
      }))

      setRosa(rosaConRuolo)
    }
  }, [rosaList.data, idTorneo])

  useEffect(() => {
    if (formazioneList.data) {
      setIdPartita(formazioneList.data.idPartita)
      setModulo(formazioneList.data.modulo as Moduli)
      setCampo(formazioneList.data.giocatori.filter((c) => c.titolare))
      setRosa(
        sortPlayersByRoleDescThenCostoDesc(
          formazioneList.data.giocatori.filter(
            (c) => !c.titolare && c.riserva === null,
          ),
        ),
      )
      setPanca(
        sortPlayersByRoleDescThenRiserva(
          formazioneList.data.giocatori.filter((c) => !c.titolare && c.riserva),
        ),
      )
    }
  }, [formazioneList.isFetching, formazioneList.isSuccess, formazioneList.data])

  const handleClickPlayer = async (playerClicked: GiocatoreFormazioneType) => {
    playerClicked.riserva = null
    playerClicked.titolare = false

    const canAdd = canAddPlayer(playerClicked.ruolo)

    if (
      rosa.some((c) => c.idGiocatore === playerClicked.idGiocatore) &&
      canAdd
    ) {
      // Va da rosa a campo
      playerClicked.titolare = true
      await updateLists(playerClicked, campo, setCampo, rosa, setRosa, false)
    } else if (rosa.some((c) => c.idGiocatore === playerClicked.idGiocatore)) {
      // Va da rosa a panca
      playerClicked.riserva = 100
      await updateLists(playerClicked, panca, setPanca, rosa, setRosa, true)
    } else if (campo.some((c) => c.idGiocatore === playerClicked.idGiocatore)) {
      // Va da campo a rosa
      await updateLists(playerClicked, rosa, setRosa, campo, setCampo, true)
    } else if (panca.some((c) => c.idGiocatore === playerClicked.idGiocatore)) {
      // Va da panca a rosa
      await updateLists(
        playerClicked,
        rosa,
        setRosa,
        panca,
        setPanca,
        false,
        true,
      )
    }
  }

  function canAddPlayer(ruoloGiocatore: string): boolean {
    const newState = calcolaCodiceFormazione(campo, ruoloGiocatore)
    const newStateStr = newState.toString().padStart(4, '0')

    const isValid = allowedFormations.some((formation) => {
      const formationStr = formation.toString().padStart(4, '0')

      for (let i = 0; i < 4; i++) {
        const currentRoleCount = parseInt(newStateStr.charAt(i), 10)
        const maxRoleCount = parseInt(formationStr.charAt(i), 10)

        if (currentRoleCount > maxRoleCount) {
          return false
        }
      }
      return true
    })

    if (isValid) {
      const moduloFormatted = formatModulo(newStateStr)
      setModulo(moduloFormatted as Moduli)
    }

    return isValid
  }

  const updateLists = async (
    playerSelected: GiocatoreFormazioneType,
    targetArray: GiocatoreFormazioneType[],
    setTargetArray: (value: GiocatoreFormazioneType[]) => void,
    sourceArray: GiocatoreFormazioneType[],
    setSourceArray: (value: GiocatoreFormazioneType[]) => void,
    orderTargetList = true,
    orderSourceList = false,
  ) => {
    if (
      playerSelected &&
      !targetArray.find((c) => c.idGiocatore === playerSelected.idGiocatore)
    ) {
      const updatedSourceArray = sourceArray.filter(
        (player) => player.idGiocatore !== playerSelected.idGiocatore,
      )
      setSourceArray(updatedSourceArray)
      const updatedTargetArray = [...targetArray, playerSelected]
      orderSourceList
        ? sortPlayersByRoleDescThenRiserva(updatedSourceArray)
        : setSourceArray(updatedSourceArray)
      orderTargetList
        ? setTargetArray(sortPlayersByRoleDescThenRiserva(updatedTargetArray))
        : setTargetArray(updatedTargetArray)
    }
  }

  const renderRosa = (roles: string[], title: string) => {
    const filteredRosa = rosa.filter((player) => roles.includes(player.ruolo))
    const filteredPanca = panca.filter((player) => roles.includes(player.ruolo))
    const handleStatGiocatore = (idGiocatore: number) => {
      setIdGiocatoreStat(idGiocatore)
      setOpenModalCalendario(true)
    }

    return (
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5">{title}</Typography>
          <List sx={{ bgcolor: 'background.paper' }}>
            {filteredRosa.map((player) => (
              <Grid container spacing={0} key={player.idGiocatore}>
                <Grid item xs={9}>
                  <div onClick={() => handleClickPlayer(player)}>
                    <ListItem
                      sx={{
                        cursor: 'pointer',
                        zIndex: 2,
                        paddingTop: '0px',
                        paddingBottom: '0px',
                        paddingLeft: '0px',
                      }}
                    >
                      <Image
                        src={player.urlCampioncinoSmall}
                        width={42}
                        height={42}
                        alt={player.nome}
                      />
                      <ListItemText
                        primary={getShortName(player.nome)}
                        secondary={`${
                          player.ruoloEsteso
                        } (${player.nomeSquadraSerieA
                          ?.toUpperCase()
                          .substring(0, 3)})`}
                      ></ListItemText>
                    </ListItem>
                  </div>
                </Grid>
                <Grid item xs={3} display={'flex'} justifyContent={'flex-end'}>
                  <Slide
                    direction="right"
                    in={true}
                    style={{ transitionDelay: '300ms' }}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Tooltip title={'Statistiche giocatore'}>
                      <IconButton
                        onClick={() => handleStatGiocatore(player.idGiocatore)}
                      >
                        <Analytics color="info" />
                      </IconButton>
                    </Tooltip>
                  </Slide>
                </Grid>
              </Grid>
            ))}
            {filteredPanca.map((player) => (
              <Grid container spacing={0} key={player.idGiocatore}>
                <Grid item xs={9}>
                  <div onClick={() => handleClickPlayer(player)}>
                    <ListItem
                      sx={{
                        cursor: 'pointer',
                        zIndex: 2,
                        paddingTop: '0px',
                        paddingBottom: '0px',
                        paddingLeft: '0px',
                      }}
                    >
                      <Image
                        src={player.urlCampioncinoSmall}
                        width={42}
                        height={42}
                        alt={player.nome}
                      />
                      <ListItemText
                        primary={getShortName(player.nome)}
                        secondary={`${
                          player.ruoloEsteso
                        } (${player.nomeSquadraSerieA
                          ?.toUpperCase()
                          .substring(0, 3)})`}
                      ></ListItemText>
                    </ListItem>
                  </div>
                </Grid>
                <Grid item xs={3} display={'flex'} justifyContent={'flex-end'}>
                  <Slide
                    direction="right"
                    in={true}
                    style={{ transitionDelay: '300ms' }}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Tooltip title={`Riserva ${player.riserva}`}>
                      <IconButton>
                        {filterIcons[(player.riserva ?? 0) - 1]}
                      </IconButton>
                    </Tooltip>
                  </Slide>
                </Grid>
              </Grid>
            ))}
          </List>
        </Box>
      </Grid>
    )
  }

  const filterIcons = [
    <LooksOneOutlined key={0} color="error" />,
    <LooksTwoOutlined key={1} color="error" />,
    <Looks3Outlined key={2} color="error" />,
    <Looks4Outlined key={3} color="error" />,
    <Looks5Outlined key={4} color="error" />,
    <Looks6Outlined key={5} color="error" />,
  ]

  const renderCampo = (roles: string[]) => {
    const filtered = campo.filter((player) => roles.includes(player.ruolo))
    return (
      <>
        {filtered.map((player, index) => {
          const style = getPlayerStylePosition(player.ruolo, index, modulo)
          return (
            <div
              key={player.idGiocatore}
              onClick={() => handleClickPlayer(player)}
              style={{
                cursor: 'pointer',
                zIndex: 2,
                minWidth: '120px',
                position: 'absolute',
                ...style,
              }}
            >
              <Stack
                direction={'column'}
                justifyContent="space-between"
                alignItems="center"
              >
                <Image
                  src={player.urlCampioncinoSmall}
                  key={player.idGiocatore}
                  width={48}
                  height={48}
                  alt={player.nome}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    backgroundColor: '#2e865f',
                    opacity: 0.8,
                    padding: '2px',
                  }}
                >
                  {player.nome}
                </Typography>
              </Stack>
            </div>
          )
        })}
      </>
    )
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (rosa.length > 0 || campo.length !== 11) {
      setAlertMessage('Completa la formazione')
      setAlertSeverity('error')
    } else if (!idPartita && idPartita !== 0) {
      setAlertMessage('Nessuna partita in programma, impossibile procedere')
      setAlertSeverity('error')
    } else {
      setSaving(true)
      if (idPartita !== 0) {
        await saveFormazione.mutateAsync({
          idPartita: idPartita,
          modulo: modulo,
          giocatori: [...campo, ...panca].map((giocatore) => ({
            idGiocatore: giocatore.idGiocatore,
            titolare: giocatore.titolare,
            riserva: giocatore.riserva,
          })),
        })
        setSaving(false)
      } else {
        await Promise.all(
          giornate.map(async (g) => {
            await saveFormazione.mutateAsync({
              idPartita: g.partite
                .filter((c) => c.idHome === idSquadra || c.idAway === idSquadra)
                .map((p) => p.idPartita)[0]!,
              modulo: modulo,
              giocatori: [...campo, ...panca].map((giocatore) => ({
                idGiocatore: giocatore.idGiocatore,
                titolare: giocatore.titolare,
                riserva: giocatore.riserva,
              })),
            })
          }),
        )
        setSaving(false)
      }
    }
    setOpenAlert(true)
  }

  const handleModalClose = () => {
    setOpenModalCalendario(false)
  }

  return (
    <>
      <Grid container spacing={1}>
        {((rosaList.isLoading && enableRosa) ||
          calendarioProssima.isLoading) && (
          <Grid item xs={12}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress color="warning" />
            </Box>
          </Grid>
        )}
        {enableRosa ? (
          <>
            <Grid item xs={8}>
              {giornate.length > 1 ? (
                <Select
                  size="small"
                  variant="outlined"
                  labelId="select-label-giornata"
                  margin="dense"
                  required
                  name="giornata"
                  onChange={(e) =>
                    e.target.value !== 0
                      ? setIdTorneo(e.target.value as number)
                      : setIdPartita(0)
                  }
                  defaultValue={giornate[0]?.idTorneo}
                >
                  <MenuItem value={0} key={`giornata_0`}>
                    Salva entrambe le formazioni
                  </MenuItem>
                  {giornate.map((g, index) => (
                    <MenuItem
                      value={g.idTorneo}
                      key={`giornata_${g.idTorneo}`}
                      selected={index === 0}
                    >{`${g.Title}`}</MenuItem>
                  ))}
                </Select>
              ) : (
                <Typography variant="h5" sx={{ lineHeight: 2 }}>
                  <b>{giornate[0]?.Title}</b>
                </Typography>
              )}
            </Grid>
            <Grid item xs={4} justifyItems={'end'}>
              <Box component="form" onSubmit={handleSave} noValidate>
                <Button
                  type="submit"
                  disabled={saving}
                  endIcon={!saving ? <Save /> : <HourglassTop />}
                  variant="contained"
                  color="error"
                  size="medium"
                  sx={{ fontSize: '10px' }}
                >
                  {saving ? 'Attendere...' : 'Salva'}
                </Button>
              </Box>
            </Grid>
            <Grid item sm={8} xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h5">
                    Rosa ({rosa.length}) / Panchina ({panca.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={0}>
                    {renderRosa(['P'], 'Portieri')}
                    {renderRosa(['D'], 'Difensori')}
                    {renderRosa(['C'], 'Centrocampisti')}
                    {renderRosa(['A'], 'Attaccanti')}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack
                    direction={'row'}
                    justifyContent="right"
                    alignItems="center"
                  >
                    <Typography variant="h5" mr={2}>
                      In campo ({campo.length})
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      borderStyle: 'none',
                      borderWidth: '0px',
                      position: 'relative',
                      width: '100%', //410px
                      aspectRatio: '360 / 509',
                      //height: '490px',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover', //100%
                      backgroundImage: "url('images/campo.jpg')",
                    }}
                  >
                    {renderCampo(['P'])}
                    {renderCampo(['D'])}
                    {renderCampo(['C'])}
                    {renderCampo(['A'])}
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ height: '30%' }}
                open={openAlert}
                autoHideDuration={3000}
                onClose={() => setOpenAlert(false)}
              >
                <Alert
                  onClose={() => setOpenAlert(false)}
                  severity={alertSeverity}
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {alertMessage}
                </Alert>
              </Snackbar>
            </Grid>
            <Grid item xs={12} minHeight={100} justifyItems={'end'}>
              <Button
                type="button"
                endIcon={<ResetTv />}
                variant="contained"
                onClick={() => {
                  setModulo(moduloDefault)
                  setCampo([])
                  setPanca([])
                  setRosa(
                    sortPlayersByRoleDescThenCostoDesc(
                      rosa.concat(campo, panca),
                    ),
                  )
                }}
                color="info"
                size="medium"
                sx={{ fontSize: '10px' }}
              >
                Reset
              </Button>
            </Grid>
          </>
        ) : (
          <Typography variant="h4" color="error">
            {message}
          </Typography>
        )}
      </Grid>

      <Modal
        title={'Statistica giocatore'}
        open={openModalCalendario}
        onClose={handleModalClose}
        width={'98%'}
        height={'98%'}
      >
        <Divider />
        <Box sx={{ mt: 1, gap: '0px', flexWrap: 'wrap' }}>
          {idGiocatoreStat !== undefined && (
            <Giocatore idGiocatore={idGiocatoreStat} />
          )}
        </Box>
      </Modal>
    </>
  )
}

export default FormazioneXs
