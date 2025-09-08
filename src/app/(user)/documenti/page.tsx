'use client'
import {
  Card,
  CardHeader,
  CardMedia,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Configurazione } from '~/config'

export default function DocumentiPage() {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Grid container justifyContent="center" spacing={0}>
      <Grid container xs={12}>
        <Grid
          item
          xs={6}
          sm={3}
          sx={!isXs ? { pr: '25px', pl: '0px', pt: '15px' } : { pr: '5px' }}
        >
          <Card>
            <CardHeader
              title={`Quotazioni Gazzetta (excel)`}
              titleTypographyProps={{ variant: 'h5' }}
            />
            <CardMedia
              component="img"
              image={'/images/giocatori.jpg'}
              width={'201px'}
              height={'139px'}
              alt={`Quotazioni Gazzetta`}
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                (window.location.href = `/docs/QuotazioniExcel.xlsx`)
              }
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={3}
          sx={!isXs ? { pr: '25px', pl: '0px', pt: '15px' } : { pl: '5px' }}
        >
          <Card>
            <CardHeader
              title={`Quotazioni Gazzetta (csv)`}
              titleTypographyProps={{ variant: 'h5' }}
            />
            <CardMedia
              component="img"
              image={'/images/giocatori.jpg'}
              width={'201px'}
              height={'139px'}
              alt={`Quotazioni Gazzetta`}
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                (window.location.href = `/docs/QuotazioniExcel.csv`)
              }
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={3}
          sx={!isXs ? { pr: '25px', pl: '0px', pt: '15px' } : { pl: '5px' }}
        >
          <Card>
            <CardHeader
              title={`Rose ${Configurazione.stagionePrecedente}`}
              titleTypographyProps={{ variant: 'h5' }}
            />
            <CardMedia
              component="img"
              image={'/images/giocatori2.png'}
              width={'201px'}
              height={'139px'}
              alt={`Rose ${Configurazione.stagionePrecedente}`}
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                (window.location.href = `/docs/rose_${Configurazione.stagionePrecedente}.csv`)
              }
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={3}
          sx={!isXs ? { pr: '0px', pl: '0px', pt: '15px' } : { pl: '5px' }}
        >
          <Card>
            <CardHeader
              title="Regolamento"
              titleTypographyProps={{ variant: 'h5' }}
            />
            <CardMedia
              component="img"
              image={'/images/regolamento.jpg'}
              width={'201px'}
              height={'139px'}
              alt={'Regolamento'}
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                (window.location.href = '/docs/Regolamento_erFantacalcio.pdf')
              }
            />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}
