'use client'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import AutocompleteTextbox, {
  type iElements,
} from '~/components/autocomplete/AutocompleteGiocatore'
import DataTable, {
  type ActionOptions,
  type Column,
} from '~/components/tables/datatable'
import { type GiocatoreType } from '~/types/giocatori'
import {
  type trasferimentoType,
  type trasferimentoListType,
} from '~/types/trasferimenti'
import { api } from '~/utils/api'
import { ruoliList, getRuoloEsteso } from '~/utils/helper'
import CheckIcon from '@mui/icons-material/CheckCircle'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { Configurazione } from '~/config'
import dayjs from 'dayjs'
import { convertFromIsoToDatetimeMUI } from '~/utils/dateUtils'

export default function Giocatori() {
  const [selectedGiocatoreId, setSelectedGiocatoreId] = useState<number>()
  const [selectedGiocatore, setSelectedGiocatore] = useState<string>()
  const [selectedTrasferimentoId, setSelectedTrasferimentoId] =
    useState<number>()
  const [selectedTrasferimentoStagione, setSelectedTrasferimentoStagione] =
    useState<string>()
  const trasferimentiList = api.trasferimenti.list.useQuery(
    { idGiocatore: selectedGiocatoreId! },
    { enabled: !!selectedGiocatoreId },
  )
  const [errorMessageTrasferimenti, setErrorMessageTrasferimenti] = useState('')
  const giocatoriList = api.giocatori.listAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
  const giocatoreOne = api.giocatori.get.useQuery(
    { idGiocatore: selectedGiocatoreId! },
    {
      enabled: !!selectedGiocatoreId,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )
  const squadreList = api.squadre.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
  const squadreSerieAList = api.squadreSerieA.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
  const giocatoreUpsert = api.giocatori.upsert.useMutation({
    onSuccess: async () => {
      await giocatoriList.refetch()
    },
  })
  const giocatoreDelete = api.giocatori.delete.useMutation({
    onSuccess: async () => {
      await giocatoriList.refetch()
      await trasferimentiList.refetch()
    },
  })
  const trasferimentoOne = api.trasferimenti.get.useQuery(
    { idTrasferimento: selectedTrasferimentoId! },
    {
      enabled: !!selectedTrasferimentoId,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )
  const [giocatori, setGiocatori] = useState<iElements[]>([])
  const [squadre, setSquadre] = useState<iElements[]>([])
  const [squadreSerieA, setSquadreSerieA] = useState<iElements[]>([])
  const [trasferimenti, setTrasferimenti] = useState<trasferimentoListType[]>(
    [],
  )
  const trasferimentoUpsert = api.trasferimenti.upsert.useMutation({
    onSuccess: async () => {
      await trasferimentiList.refetch()
    },
  })
  const trasferimentoDelete = api.trasferimenti.delete.useMutation({
    onSuccess: async () => {
      await trasferimentiList.refetch()
    },
  })
  const [errorMessageGiocatore, setErrorMessageGiocatore] = useState('')
  const [messageGiocatore, setMessageGiocatore] = useState('')
  const [errorMessageTrasferimento, setErrorMessageTrasferimento] = useState('')
  const [messageTrasferimento, setMessageTrasferimento] = useState('')
  const defaultGiocatore: GiocatoreType = {
    idGiocatore: 0,
    nome: '',
    nomeFantagazzetta: '',
    ruolo: 'P',
  }
  const [giocatore, setGiocatore] = useState<GiocatoreType>(defaultGiocatore)
  const defaultTrasferimento: trasferimentoType = {
    idTrasferimento: 0,
    idGiocatore: 0,
    idSquadra: null,
    idSquadraSerieA: null,
    costo: 0,
    dataAcquisto: dayjs(new Date()).toDate(),
    dataCessione: null,
  }
  const [trasferimento, setTrasferimento] =
    useState<trasferimentoType>(defaultTrasferimento)
  const columns: Column[] = [
    { key: 'idTrasferimento', type: 'number', align: 'left', visible: false },
    {
      key: 'ruolo',
      type: 'string',
      align: 'left',
      header: 'Ruolo',
      sortable: false,
    },
    {
      key: 'squadra',
      type: 'string',
      align: 'left',
      header: 'Squadra',
      sortable: false,
    },
    {
      key: 'squadraSerieA',
      type: 'string',
      align: 'left',
      header: 'Serie A',
      sortable: false,
    },
    {
      key: 'dataAcquisto',
      type: 'date',
      align: 'left',
      header: 'Data',
      sortable: false,
    },
    {
      key: 'stagione',
      type: 'string',
      align: 'left',
      header: 'Stagione',
      sortable: false,
    },
    {
      key: 'stagione',
      type: 'string',
      align: 'left',
      header: 'Stagione',
      sortable: false,
    },
    { key: '', type: 'action', align: 'center', width: '1%' },
  ]
  const actionEdit = (idTrasferimento: string, stagione: string) => {
    return (
      <div>
        <Tooltip
          title={'Modifica'}
          onClick={() => handleEditTrasferimento(+idTrasferimento, stagione)}
          placement="left"
        >
          <EditNoteIcon />
        </Tooltip>
      </div>
    )
  }
  const actionOptions: ActionOptions[] = [
    {
      keyFields: ['idTrasferimento', 'stagione'],
      keyEvalVisibility: 'isEditVisible',
      component: actionEdit,
    },
  ]
  const GiocatoreSchema = z.object({
    idGiocatore: z.number(),
    nome: z.string().min(3),
    nomeFantagazzetta: z.string().nullable().optional(),
    ruolo: z.string(),
  })
  const TrasferimentoSchema = z.object({
    idTrasferimento: z.number(),
    idGiocatore: z.number(),
    idSquadraSerieA: z.number().optional().nullable(),
    idSquadra: z.number().optional().nullable(),
    costo: z.number(),
    dataAcquisto: z.date().optional(),
    dataCessione: z.date().optional().nullable(),
  })

  useEffect(() => {
    if (trasferimentiList.data) {
      setTrasferimenti(trasferimentiList.data)
    }
  }, [trasferimentiList.data])

  useEffect(() => {
    if (trasferimentiList.isError) {
      setErrorMessageTrasferimenti(
        'Si è verificato un errore in fase di caricamento dei trasferimenti',
      )
    }
  }, [trasferimentiList.isError])

  useEffect(() => {
    if (giocatoriList.data) {
      setGiocatori(giocatoriList.data)
    }
  }, [giocatoriList.data])

  useEffect(() => {
    if (squadreList.data) {
      const newData: iElements[] = [
        { id: 0, label: '' },
        ...squadreList.data.map((item) => ({
          id: item.id,
          label: item.squadra,
        })),
      ]
      setSquadre(newData)
    }
  }, [squadreList.data])

  useEffect(() => {
    if (squadreSerieAList.data) {
      const newData: iElements[] = [
        { id: 0, label: '' },
        ...squadreSerieAList.data.map((item) => ({
          id: item.idSquadraSerieA,
          label: item.nome,
        })),
      ]
      setSquadreSerieA(newData)
    }
  }, [squadreSerieAList.data])

  useEffect(() => {
    if (
      !giocatoreOne.isFetching &&
      giocatoreOne.isSuccess &&
      giocatoreOne.data
    ) {
      setGiocatore(giocatoreOne.data)
      setErrorMessageGiocatore('')
      setMessageGiocatore('')
    }
  }, [giocatoreOne.data, giocatoreOne.isSuccess, giocatoreOne.isFetching])

  useEffect(() => {
    if (
      !trasferimentoOne.isFetching &&
      trasferimentoOne.isSuccess &&
      trasferimentoOne.data
    ) {
      setTrasferimento(trasferimentoOne.data)
      setErrorMessageTrasferimento('')
      setMessageTrasferimento('')
    }
  }, [
    trasferimentoOne.data,
    trasferimentoOne.isSuccess,
    trasferimentoOne.isFetching,
  ])

  //#region anagrafica

  const handleGiocatoreSelected = async (
    idGiocatore: number | undefined,
    nome: string | undefined,
  ) => {
    setSelectedGiocatoreId(idGiocatore)
    setSelectedGiocatore(nome)
    setSelectedTrasferimentoId(undefined)
    setSelectedTrasferimentoStagione(Configurazione.stagione)
    setGiocatore(defaultGiocatore)
    await handleCancelTrasferimento()
  }

  const handleCancelGiocatore = async () => {
    setGiocatore(defaultGiocatore)
    setSelectedGiocatoreId(undefined)
    setSelectedGiocatore(undefined)
    setSelectedTrasferimentoId(undefined)
    setSelectedTrasferimentoStagione(Configurazione.stagione)
    document?.getElementById('search_items')?.focus()
  }

  const handleUpsertGiocatore = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setErrorMessageGiocatore('')
    setMessageGiocatore('')
    const responseVal = GiocatoreSchema.safeParse(giocatore)
    if (!responseVal.success) {
      setErrorMessageGiocatore(
        responseVal.error.issues
          .map(
            (issue) => `campo ${issue.path.toLocaleString()}: ${issue.message}`,
          )
          .join(', '),
      )
    } else {
      try {
        const idGiocatore = await giocatoreUpsert.mutateAsync({
          idGiocatore: giocatore.idGiocatore,
          nome: giocatore.nome,
          nomeFantagazzetta: giocatore.nomeFantagazzetta,
          ruolo: giocatore.ruolo,
        })
        setSelectedGiocatoreId(idGiocatore)
        setSelectedTrasferimentoStagione(Configurazione.stagione)
        setMessageGiocatore('Salvataggio completato')
        document?.getElementById('costo')?.focus()
      } catch (error) {
        setErrorMessageGiocatore(
          "Si è verificato un errore nel salvataggio dell'anagrafica giocatore",
        )
      }
    }
  }

  const handleDeleteGiocatore = async () => {
    setErrorMessageGiocatore('')
    setMessageGiocatore('')
    if (selectedGiocatoreId) {
      try {
        await giocatoreDelete.mutateAsync(selectedGiocatoreId)
        await handleCancelGiocatore()
        setMessageGiocatore('Eliminazione completata')
        document?.getElementById('search_items')?.focus()
      } catch (error) {
        setErrorMessageGiocatore(
          "Si è verificato un errore nell'eliminazione del giocatore",
        )
      }
    }
  }

  //#endregion anagrafica

  //#region trasferimento

  const handleCancelTrasferimento = async () => {
    setSelectedTrasferimentoId(undefined)
    setSelectedTrasferimentoStagione(Configurazione.stagione)
    setTrasferimento(defaultTrasferimento)
    document?.getElementById('search_items')?.focus()
  }

  const handleEditTrasferimento = async (
    _idTrasferimento: number,
    stagione: string,
  ) => {
    setSelectedTrasferimentoStagione(stagione)

    if (Configurazione.stagione === stagione) {
      setSelectedTrasferimentoId(_idTrasferimento)
    } else {
      setSelectedTrasferimentoId(undefined)
      setTrasferimento(defaultTrasferimento)
    }
    document?.getElementById('costo')?.focus()
  }

  const handleUpsertTrasferimento = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    console.log('selectedGiocatoreId:', selectedGiocatoreId)
    setErrorMessageTrasferimento('')
    setMessageTrasferimento('')
    const responseVal = TrasferimentoSchema.safeParse(trasferimento)
    if (!responseVal.success) {
      setErrorMessageTrasferimento(
        responseVal.error.issues
          .map(
            (issue) => `campo ${issue.path.toLocaleString()}: ${issue.message}`,
          )
          .join(', '),
      )
    } else {
      try {
        const idTrasferimento = await trasferimentoUpsert.mutateAsync({
          idTrasferimento: trasferimento.idTrasferimento,
          idGiocatore: selectedGiocatoreId ?? 0,
          idSquadra: trasferimento.idSquadra,
          idSquadraSerieA: trasferimento.idSquadraSerieA,
          costo: trasferimento.costo,
          dataAcquisto: trasferimento.dataAcquisto,
          dataCessione: trasferimento.dataCessione,
        })
        setSelectedTrasferimentoId(idTrasferimento)
        setSelectedTrasferimentoStagione(Configurazione.stagione)
        setMessageTrasferimento('Salvataggio completato')
        //document?.getElementById("search_items")?.focus();
      } catch (error) {
        setErrorMessageTrasferimento(
          'Si è verificato un errore nel salvataggio del trasferimento giocatore',
        )
      }
    }
  }

  const handleDeleteTrasferimento = async () => {
    setErrorMessageTrasferimento('')
    setMessageTrasferimento('')
    try {
      await trasferimentoDelete.mutateAsync(trasferimento.idTrasferimento)
      await handleCancelTrasferimento()
      setMessageTrasferimento('Eliminazione completata')
      document?.getElementById('search_items')?.focus()
    } catch (error) {
      setErrorMessageTrasferimento(
        "Si è verificato un errore nell'eliminazione del trasferimento",
      )
    }
  }

  //#endregion trasferimento

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    form: 'anagrafica' | 'trasferimento',
  ) => {
    const { name, value, type, checked } = event.currentTarget
    if (form === 'anagrafica')
      setGiocatore((prevState) => ({
        ...prevState,
        [name]:
          type === 'number'
            ? +value
            : type === 'checkbox'
              ? checked
              : type === 'datetime-local'
                ? dayjs(value).toDate()
                : value,
      }))
    if (form === 'trasferimento')
      setTrasferimento((prevState) => ({
        ...prevState,
        [name]:
          type === 'number'
            ? +value
            : type === 'checkbox'
              ? checked
              : type === 'datetime-local'
                ? dayjs(value).toDate()
                : value,
      }))
  }

  const handleSelectChange = (
    event: SelectChangeEvent,
    form: 'anagrafica' | 'trasferimento',
  ) => {
    if (form === 'anagrafica')
      setGiocatore((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }))
    if (form === 'trasferimento')
      setTrasferimento((prevState) => ({
        ...prevState,
        [event.target.name]:
          event.target.value === '0' ? null : parseInt(event.target.value),
      }))
  }

  return (
    <Stack
      direction="column"
      spacing={1}
      justifyContent="space-between"
      paddingTop={2}
      paddingBottom={2}
    >
      <Typography variant="h5">Gestione giocatori</Typography>
      <AutocompleteTextbox
        onItemSelected={handleGiocatoreSelected}
        items={giocatori ?? []}
      ></AutocompleteTextbox>
      <Stack direction="row" spacing={1} justifyContent="flex-start">
        <Typography variant="h5">IdGiocatore: {selectedGiocatoreId}</Typography>
        <Typography variant="h5">
          IdTrasferimento: {selectedTrasferimentoId}
        </Typography>
      </Stack>
      <Card sx={{ p: 0 }}>
        <CardHeader
          title="Anagrafica giocatore"
          subheader="Inserisci/aggiorna giocatore"
          titleTypographyProps={{ variant: 'h4' }}
        />
        <CardContent>
          <Box
            component="form"
            onSubmit={handleUpsertGiocatore}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={0}>
              <Grid item xs={8}>
                <Stack direction="row" spacing={1} justifyContent="flex-start">
                  <TextField
                    margin="normal"
                    size="small"
                    variant="outlined"
                    required
                    sx={{ m: 2 }}
                    label="Nome"
                    name="nome"
                    value={giocatore?.nome ?? selectedGiocatore}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(event, 'anagrafica')
                    }
                  />
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="select-label-ruolo">Ruolo</InputLabel>
                    <Select
                      size="small"
                      variant="outlined"
                      labelId="select-label-ruolo"
                      label="Ruolo"
                      sx={{ m: 0 }}
                      name="ruolo"
                      value={giocatore?.ruolo ?? 'P'}
                      onChange={(event: SelectChangeEvent) =>
                        handleSelectChange(event, 'anagrafica')
                      }
                    >
                      {ruoliList.map((item) => (
                        <MenuItem
                          key={item}
                          value={item}
                          sx={{ color: 'black' }}
                        >
                          {getRuoloEsteso(item)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    margin="normal"
                    size="small"
                    variant="outlined"
                    required
                    sx={{ m: 2 }}
                    label="Nome fantagazzetta"
                    name="nomeFantagazzetta"
                    value={giocatore?.nomeFantagazzetta ?? ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(event, 'anagrafica')
                    }
                  />
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    type="button"
                    onClick={handleCancelGiocatore}
                    color="warning"
                    variant="outlined"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Chiudi
                  </Button>
                  {selectedGiocatoreId !== undefined && (
                    <Button
                      type="button"
                      onClick={handleDeleteGiocatore}
                      color="error"
                      variant="outlined"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Elimina
                    </Button>
                  )}
                  <Button
                    type="submit"
                    color="info"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {selectedGiocatoreId
                      ? 'Aggiorna giocatore'
                      : 'Aggiungi giocatore'}
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                >
                  {messageGiocatore && (
                    <Stack sx={{ width: '100%' }} spacing={0}>
                      <Alert
                        icon={<CheckIcon fontSize="inherit" />}
                        severity="success"
                      >
                        {messageGiocatore}
                      </Alert>
                    </Stack>
                  )}
                  {errorMessageGiocatore && (
                    <Stack sx={{ width: '100%' }} spacing={0}>
                      <Alert
                        icon={<CheckIcon fontSize="inherit" />}
                        severity="error"
                      >
                        {errorMessageGiocatore}
                      </Alert>
                    </Stack>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      {selectedGiocatoreId !== undefined && (
        <Paper elevation={3}>
          <Card sx={{ p: 0 }}>
            <CardHeader
              title="Trasferimento giocatore"
              subheader="Inserisci/aggiorna trasferimento"
              titleTypographyProps={{ variant: 'h4' }}
            />
            <CardContent>
              <Box
                component="form"
                onSubmit={handleUpsertTrasferimento}
                noValidate
                sx={{ mt: 1 }}
              >
                <Grid container spacing={0}>
                  <Grid item xs={8}>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-start"
                    >
                      <TextField
                        margin="normal"
                        size="small"
                        variant="outlined"
                        required
                        sx={{ m: 2 }}
                        id="costo"
                        label="Costo"
                        name="costo"
                        type="number"
                        value={trasferimento.costo}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => handleInputChange(event, 'trasferimento')}
                      />
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="select-label-fantasquadra">
                          Fantasquadra
                        </InputLabel>
                        <Select
                          size="small"
                          variant="outlined"
                          labelId="select-label-fantasquadra"
                          label="Fantasquadra"
                          sx={{ m: 0 }}
                          id="idSquadra"
                          name="idSquadra"
                          value={
                            trasferimento.idSquadra?.toLocaleString() ?? '0'
                          }
                          onChange={(event: SelectChangeEvent) =>
                            handleSelectChange(event, 'trasferimento')
                          }
                        >
                          {squadre.map((item) => (
                            <MenuItem
                              key={item.id}
                              value={item.id?.toLocaleString()}
                              sx={{ color: 'black' }}
                            >
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="select-label-squadra">
                          Squadra
                        </InputLabel>
                        <Select
                          size="small"
                          variant="outlined"
                          labelId="select-label-squadra"
                          label="Squadra"
                          sx={{ m: 0 }}
                          id="idSquadraSerieA"
                          name="idSquadraSerieA"
                          value={
                            trasferimento.idSquadraSerieA?.toLocaleString() ??
                            '0'
                          }
                          onChange={(event: SelectChangeEvent) =>
                            handleSelectChange(event, 'trasferimento')
                          }
                        >
                          {squadreSerieA.map((item) => (
                            <MenuItem
                              key={item.id}
                              value={item.id?.toLocaleString()}
                              sx={{ color: 'black' }}
                            >
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        margin="normal"
                        size="small"
                        variant="outlined"
                        required
                        type="datetime-local"
                        sx={{ m: 2 }}
                        id="dataAcquisto"
                        label="Data Acquisto"
                        name="dataAcquisto"
                        value={convertFromIsoToDatetimeMUI(
                          dayjs(trasferimento.dataAcquisto).toISOString(),
                        )}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => handleInputChange(event, 'trasferimento')}
                      />
                      <TextField
                        margin="normal"
                        size="small"
                        variant="outlined"
                        required
                        type="datetime-local"
                        sx={{ m: 2 }}
                        id="dataCessione"
                        //label='Data Cessione'
                        name="dataCessione"
                        value={
                          trasferimento.dataCessione !== null
                            ? convertFromIsoToDatetimeMUI(
                                dayjs(trasferimento.dataCessione).toISOString(),
                              )
                            : null
                        }
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => handleInputChange(event, 'trasferimento')}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        type="button"
                        onClick={handleCancelTrasferimento}
                        color="warning"
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Chiudi
                      </Button>
                      {selectedTrasferimentoId !== undefined &&
                        selectedTrasferimentoStagione ===
                          Configurazione.stagione && (
                          <Button
                            type="button"
                            onClick={handleDeleteTrasferimento}
                            color="error"
                            variant="outlined"
                            sx={{ mt: 3, mb: 2 }}
                          >
                            Elimina
                          </Button>
                        )}
                      {selectedTrasferimentoStagione ===
                        Configurazione.stagione && (
                        <Button
                          type="submit"
                          color="info"
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          {selectedTrasferimentoId
                            ? 'Aggiorna trasferimento'
                            : 'Aggiungi trasferimento'}
                        </Button>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="space-between"
                    >
                      {messageTrasferimento && (
                        <Stack sx={{ width: '100%' }} spacing={0}>
                          <Alert
                            icon={<CheckIcon fontSize="inherit" />}
                            severity="success"
                          >
                            {messageTrasferimento}
                          </Alert>
                        </Stack>
                      )}
                      {errorMessageTrasferimento && (
                        <Stack sx={{ width: '100%' }} spacing={0}>
                          <Alert
                            icon={<CheckIcon fontSize="inherit" />}
                            severity="error"
                          >
                            {errorMessageTrasferimento}
                          </Alert>
                        </Stack>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      )}
      {trasferimentiList.isLoading &&
      !trasferimentiList.isSuccess &&
      selectedGiocatoreId !== undefined ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress color="info" />
        </div>
      ) : selectedGiocatoreId === undefined ? (
        <span></span>
      ) : (
        <DataTable
          title={`Trasferimenti ${giocatoreOne.data?.nome}`}
          pagination={false}
          data={trasferimenti}
          errorMessage={errorMessageTrasferimenti}
          columns={columns}
          actionOptions={actionOptions}
        />
      )}
    </Stack>
  )
}
