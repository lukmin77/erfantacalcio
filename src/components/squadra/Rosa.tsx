'use client'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { api } from '~/utils/api'
import { useTheme } from '@mui/material/styles'
import {
  type GiocatoreFormazioneType,
  type GiocatoreType,
} from '~/types/squadre'
import Modal from '../modal/Modal'
import Giocatore from '../giocatori/Giocatore'

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

type RosaProps = {
  idSquadra: number
  squadra: string
}

function Rosa({ idSquadra, squadra }: RosaProps) {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('md'))

  const [selectedGiocatoreId, setSelectedGiocatoreId] = useState<number>()
  const [openModalCalendario, setOpenModalCalendario] = useState(false)

  const rosaList = api.squadre.getRosa.useQuery(
    { idSquadra: idSquadra, includeVenduti: true },
    { refetchOnWindowFocus: false, refetchOnReconnect: false },
  )
  const [rosa, setRosa] = useState<GiocatoreFormazioneType[]>([])
  const [value, setValue] = useState(3)

  useEffect(() => {
    if (rosaList.data) {
      const rosaConRuolo = rosaList.data.map((giocatore: GiocatoreType) => ({
        ...giocatore,
        titolare: false,
        riserva: null,
      }))

      setRosa(rosaConRuolo)
    }
  }, [rosaList.data])

  const handleGiocatoreSelected = async (idGiocatore: number | undefined) => {
    setSelectedGiocatoreId(idGiocatore)
    setOpenModalCalendario(true)
  }

  const handleModalClose = () => {
    setOpenModalCalendario(false)
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const renderRosa = (roles: string[], isVenduto: boolean) => {
    const filteredRosa = rosa.filter(
      (player) =>
        roles.includes(player.ruolo) && player.isVenduto === isVenduto,
    )
    return (
      <Grid container spacing={0}>
        {filteredRosa.map((giocatore, index) => (
          <Grid
            key={index}
            item
            xs={6}
            sm={1.5}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: '10px',
              mb: '10px',
              flexWrap: 'wrap',
            }}
          >
            <Card sx={{ marginBottom: '1px', maxWidth: '180px' }}>
              <CardMedia
                component="img"
                sx={{ cursor: 'pointer', width: '60' }}
                image={giocatore.urlCampioncino}
                alt={giocatore.nome}
                onClick={() => handleGiocatoreSelected(giocatore.idGiocatore)}
              />
              <CardContent sx={{ paddingBottom: '0px' }}>
                <Typography
                  gutterBottom
                  variant="body2"
                  sx={{
                    fontSize: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  component="div"
                >
                  {giocatore.nome}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body1"
                  sx={{
                    fontSize: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  component="div"
                >
                  {giocatore.nomeSquadraSerieA}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body1"
                  sx={{
                    fontSize: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  component="div"
                >
                  {giocatore.ruoloEsteso}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body1"
                  sx={{
                    fontSize: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  component="div"
                >
                  {giocatore.costo.toFixed(0)} M€
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
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

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    }
  }

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Typography variant="h4">Rosa</Typography>
        </Grid>
        {rosaList.isLoading ? (
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
        ) : (
          <Grid item xs={12}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="inherit"
                  variant={isXs ? 'scrollable' : 'fullWidth'}
                  sx={isXs ? { maxWidth: '350px' } : {}}
                  scrollButtons="auto"
                  aria-label="Rosa giocatori"
                >
                  <Tab label={isXs ? 'Por' : 'Portieri'} {...a11yProps(0)} />
                  <Tab label={isXs ? 'Dif' : 'Difensori'} {...a11yProps(1)} />
                  <Tab
                    label={isXs ? 'Cen' : 'Centrocampisti'}
                    {...a11yProps(2)}
                  />
                  <Tab label={isXs ? 'Att' : 'Attaccanti'} {...a11yProps(3)} />
                  <Tab label={isXs ? 'Ex' : 'Venduti'} {...a11yProps(4)} />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={value} index={0} dir={theme.direction}>
                  {renderRosa(['P'], false)}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                  {renderRosa(['D'], false)}
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                  {renderRosa(['C'], false)}
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                  {renderRosa(['A'], false)}
                </TabPanel>
                <TabPanel value={value} index={4} dir={theme.direction}>
                  {renderRosa(['P', 'D', 'C', 'A'], true)}
                </TabPanel>
              </Grid>
            </Grid>
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
          {selectedGiocatoreId !== undefined && (
            <Giocatore idGiocatore={selectedGiocatoreId} />
          )}
        </Box>
      </Modal>
    </>
  )
}

export default Rosa
