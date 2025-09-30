import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  Paper,
  Tooltip,
  Avatar,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Gavel } from '@mui/icons-material'
import { formatDateFromIso } from '~/utils/dateUtils'
import { z } from 'zod'
import { giornataSchema } from '~/server/api/routers/common'

interface GiornataCardProps {
  prefixTitle: string
  giornata: z.infer<typeof giornataSchema>[]
  maxWidth: number | string
  withAvatar: boolean
}

export default function CardPartite({
  prefixTitle,
  giornata,
  maxWidth,
  withAvatar,
}: GiornataCardProps) {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      {giornata.map((g) => (
        <Paper
          elevation={0}
          key={`card_${g.idCalendario}`}
          sx={{ maxWidth: maxWidth }}
        >
          <Card sx={{ maxWidth: maxWidth }} key={`card_${g.idCalendario}`}>
            <CardHeader
              title={`${prefixTitle} ${g?.Title}`}
              subheader={`${g.SubTitle}: ${formatDateFromIso(
                g.data,
                'DD/MM HH:mm',
              )}`}
              titleTypographyProps={{ variant: 'h5' }}
              subheaderTypographyProps={{ variant: 'h6' }}
            />
            <CardContent
              sx={{ paddingBottom: '3px', paddingTop: '3px', m: '4px' }}
              key={`card_content_${g.idCalendario}`}
            >
              {g.partite.length > 0 ? (
                g.partite.map((partita) => (
                  <a
                    href={
                      g.isGiocata
                        ? `/tabellini?idPartita=${partita.idPartita}&idCalendario=${g.idCalendario}`
                        : `/formazioni?idPartita=${partita.idPartita}&idCalendario=${g.idCalendario}`
                    }
                    key={`grid_${partita.idPartita}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Grid
                      container
                      spacing={0}
                      padding={1}
                      key={`grid_${partita.idPartita}`}
                    >
                      {withAvatar && (
                        <Grid item xs={!isXs ? 1 : 1.3} alignSelf={'center'}>
                          <Avatar
                            alt={partita.squadraHome ?? ''}
                            src={partita.fotoHome ?? ''}
                            variant="rounded"
                          ></Avatar>
                        </Grid>
                      )}
                      <Grid
                        item
                        xs={withAvatar ? (!isXs ? 4 : 3.7) : 5}
                      >
                        <Typography variant="h6">
                          {partita.squadraHome}
                          {partita.multaHome ?? (
                            <Tooltip title="Multa">
                              <Gavel color="error" fontSize="small" />
                            </Tooltip>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="h5">
                          {partita.golHome ?? '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="h5">
                          {partita.golAway ?? '-'}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={withAvatar ? (!isXs ? 4 : 3.7) : 5}
                        textAlign={'right'}
                        paddingRight={2}
                      >
                        <Typography variant="h6">
                          {partita.squadraAway}
                          {partita.multaAway ?? (
                            <Tooltip title="Multa">
                              <Gavel color="error" fontSize="small" />
                            </Tooltip>
                          )}
                        </Typography>
                      </Grid>
                      {withAvatar && (
                        <Grid
                          item
                          xs={!isXs ? 1 : 1.3}
                          alignSelf={'center'}
                          textAlign={'right'}
                          alignContent={'flex-end'}
                          alignItems={'flex-end'}
                        >
                          <Avatar
                            alt={partita.squadraAway ?? ''}
                            src={partita.fotoAway ?? ''}
                            variant="rounded"
                          ></Avatar>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    </Grid>
                  </a>
                ))
              ) : (
                <Grid container spacing={0} key={`grid_0`}>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      component="div"
                      color="text.secondary"
                      key={`CardPartiteEmpty_${g.idCalendario}`}
                    >
                      Nessuna partita in programma
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Paper>
      ))}
    </>
  )
}
