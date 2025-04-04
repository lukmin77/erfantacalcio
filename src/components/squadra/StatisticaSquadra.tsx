import { Ballot, Diversity1, SportsSoccer } from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { api } from '~/utils/api'
import { FrameType } from '~/utils/enums'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { PieChart } from '@mui/x-charts/PieChart'
import { type GiornataType } from '~/types/common'
import Link from 'next/link'

interface StatisticaSquadraProps {
  onActionChangePartita: (action: FrameType, idPartita: number) => void
  onActionGoToRosa: (
    action: FrameType,
    idSquadra: number,
    squadra: string,
  ) => void
  onActionGoToFormazione: (action: FrameType) => void
  idSquadra: number
}

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

function StatisticaSquadra({
  onActionChangePartita: onActionActivePartita,
  onActionGoToRosa: onActionActiveRosa,
  onActionGoToFormazione: onActionActiveFormazione,
  idSquadra,
}: StatisticaSquadraProps) {
  const { data: session } = useSession()
  const theme = useTheme()
  const apiSquadra = api.squadre.get.useQuery(
    { idSquadra: idSquadra },
    { refetchOnWindowFocus: false, refetchOnReconnect: false },
  )
  const apiAlbo = api.albo.get.useQuery(
    { idSquadra: idSquadra },
    { refetchOnWindowFocus: false, refetchOnReconnect: false },
  )
  const apiPartite = api.calendario.listPartiteBySquadra.useQuery(
    { idSquadra: idSquadra },
    { refetchOnWindowFocus: false, refetchOnReconnect: false },
  )
  const [value, setValue] = useState(0)

  const handleActionRosa = (
    newFrame: FrameType,
    idSquadra: number,
    squadra: string,
  ) => {
    onActionActiveRosa(newFrame, idSquadra, squadra)
  }

  const handleActionFormazione = (newFrame: FrameType) => {
    onActionActiveFormazione(newFrame)
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && children}
      </div>
    )
  }

  const datiSquadra = apiSquadra.data
  const datiAlbo = apiAlbo.data
  const datiPartite = apiPartite.data

  const renderPartite = (torneo: string) => (
    <Grid
      container
      spacing={1}
      sx={{ overflowY: 'auto', width: '100%', maxHeight: '360px' }}
    >
      {datiPartite
        ?.filter((c) => c.Torneo === torneo)
        .flatMap((c) =>
          c.partite.map((partita) => ({
            ...partita,
            isGiocata: c.isGiocata,
            giornata: c.giornata,
          })),
        )
        .map((partita, index) => (
          <Grid item xs={12} key={`card_partita_${index}_${partita.idPartita}`}>
            <Stack direction="row" spacing={0} justifyContent="space-between">
              <Typography
                variant="body2"
                component="div"
                color="text.secondary"
                key={`typography_${partita.idPartita}`}
              >
                {partita.giornata} - {partita.squadraHome} -{' '}
                {partita.squadraAway}
              </Typography>
              <Stack
                direction="row"
                spacing={0}
                justifyContent="flex-end"
                key={`stack2_${partita.idPartita}`}
              >
                <Typography
                  variant="body2"
                  component="div"
                  color="text.secondary"
                  key={`typography2_${partita.idPartita}`}
                >
                  {partita.golHome} - {partita.golAway}
                </Typography>
                {partita.isGiocata && (
                  <Tooltip title="Tabellino voti" placement="top-start">
                    <Link
                      href={`/tabellini?idPartita=${partita.idPartita}`}
                      passHref
                    >
                      <IconButton sx={{ height: '24px' }}>
                        <Ballot color="primary" fontSize="small" />
                      </IconButton>
                    </Link>
                  </Tooltip>
                )}
                {!partita.isGiocata && (
                  <Tooltip title="Visualizza Formazioni" placement="top-start">
                    <Link
                      href={`/formazioni?idPartita=${partita.idPartita}`}
                      passHref
                    >
                      <IconButton sx={{ height: '24px' }}>
                        <SportsSoccer color="primary" fontSize="small" />
                      </IconButton>
                    </Link>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
            <Divider></Divider>
          </Grid>
        ))}
    </Grid>
  )

  function getStatsPartite(torneo: string, datiPartite: GiornataType[]) {
    const vinte =
      datiPartite
        .filter((c) => c.Torneo === torneo && c.isGiocata)
        .flatMap((c) =>
          c.partite.filter(
            (c) =>
              c.idHome === idSquadra && (c.golHome ?? 0) > (c.golAway ?? 0),
          ),
        ).length +
      datiPartite
        .filter((c) => c.Torneo === torneo && c.isGiocata)
        .flatMap((c) =>
          c.partite.filter(
            (c) =>
              c.idAway === idSquadra && (c.golAway ?? 0) > (c.golHome ?? 0),
          ),
        ).length
    const pareggi =
      datiPartite
        .filter((c) => c.Torneo === torneo && c.isGiocata)
        .flatMap((c) =>
          c.partite.filter(
            (c) =>
              c.idHome === idSquadra && (c.golHome ?? 0) === (c.golAway ?? 0),
          ),
        ).length +
      datiPartite
        .filter((c) => c.Torneo === torneo && c.isGiocata)
        .flatMap((c) =>
          c.partite.filter(
            (c) =>
              c.idAway === idSquadra && (c.golAway ?? 0) === (c.golHome ?? 0),
          ),
        ).length
    const perse =
      datiPartite
        .filter((c) => c.Torneo === torneo && c.isGiocata)
        .flatMap((c) =>
          c.partite.filter(
            (c) =>
              c.idHome === idSquadra && (c.golHome ?? 0) < (c.golAway ?? 0),
          ),
        ).length +
      datiPartite
        .filter((c) => c.Torneo === torneo && c.isGiocata)
        .flatMap((c) =>
          c.partite.filter(
            (c) =>
              c.idAway === idSquadra && (c.golAway ?? 0) < (c.golHome ?? 0),
          ),
        ).length

    return [
      {
        data: [
          { id: 0, value: vinte, label: 'Vittorie' },
          { id: 1, value: pareggi, label: 'Pareggi' },
          { id: 2, value: perse, label: 'Sconfitte' },
        ],
      },
    ]
  }

  return (
    <Grid container spacing={0}>
      {(apiSquadra.isLoading || apiAlbo.isLoading || apiPartite.isLoading) && (
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
      {datiSquadra && datiAlbo && datiPartite && (
        <>
          <Grid item xs={8} sm={8}>
            <Typography variant={'h4'}>{datiSquadra.squadra}</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {session?.user && (
              <Tooltip title="Schiera formazione" placement="top-start">
                <IconButton
                  onClick={() =>
                    handleActionFormazione(FrameType.schieraFormazione)
                  }
                >
                  <Ballot color="primary" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Rosa">
              <IconButton
                onClick={() =>
                  handleActionRosa(
                    FrameType.rosa,
                    idSquadra,
                    datiSquadra.squadra,
                  )
                }
              >
                <Diversity1 color="success" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardHeader
                title={datiSquadra.presidente}
                titleTypographyProps={{ variant: 'h4' }}
                subheader={session?.user ? datiSquadra.email : ''}
              ></CardHeader>
              <CardMedia
                component="img"
                height="250"
                sx={{ paddingTop: 0, display: { xs: 'none', sm: 'block' } }}
                image={datiSquadra.foto ?? ''}
                alt={datiSquadra.presidente}
              />
              <CardContent>
                <Divider />
                <Box sx={{ p: 1 }}>
                  <Stack direction="column" spacing={1}>
                    <Typography color="primary" variant="body1">
                      Quota annua: {datiSquadra.importoAnnuale} €
                    </Typography>
                    <Typography color="primary" variant="body1">
                      Multe: {datiSquadra.importoMulte} €
                    </Typography>
                    <Typography color="primary" variant="body1">
                      Mercato gennaio: {datiSquadra.importoMercato} €
                    </Typography>
                    <Typography color="primary" variant="body1">
                      Fantamilioni rimanenti: {datiSquadra.fantamilioni}
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Grid container spacing={0} sx={{ m: '15px' }}>
              <Grid item xs={12} sm={6}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="inherit"
                  variant={'standard'}
                  aria-label="Partite squadra"
                >
                  <Tab label="Campionato" />
                  <Tab label="Champions" />
                </Tabs>
                <TabPanel value={value} index={0} dir={theme.direction}>
                  {renderPartite('Campionato')}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                  {renderPartite('Champions')}
                </TabPanel>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Box flexGrow={1}>
                  <Typography
                    variant="body2"
                    display={'flex'}
                    justifyContent={'center'}
                  >
                    Risultati Campionato
                  </Typography>
                  <PieChart
                    colors={['lightGreen', 'orange', 'red']}
                    series={getStatsPartite('Campionato', datiPartite)}
                    width={350}
                    height={200}
                  />
                </Box>
                <Box flexGrow={1}>
                  <Typography
                    variant="body2"
                    display={'flex'}
                    justifyContent={'center'}
                  >
                    Risultati Champions
                  </Typography>
                  <PieChart
                    series={getStatsPartite('Champions', datiPartite)}
                    width={350}
                    height={200}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      <Grid item xs={12} sx={{ height: '100px' }}>
        <></>
      </Grid>
    </Grid>
  )
}

export default StatisticaSquadra
