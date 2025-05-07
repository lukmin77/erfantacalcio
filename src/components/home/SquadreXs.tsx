import React from 'react'
import { api } from '~/utils/api'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'

export default function SquadreXs() {
  const squadreList = api.squadre.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return (
    <>
      {squadreList.isLoading ? (
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <Grid container spacing={0}>
            {squadreList.data?.map((squadra, index) => (
              <Grid item xs={3} key={index}>
                <Card sx={{ minWidth: 90, maxWidth: 90, marginBottom: '2px' }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="68"
                      image={squadra.foto ?? ''}
                      alt={squadra.squadra}
                      onClick={() =>
                        (window.location.href = `/squadra/${squadra.id}/${squadra.squadra}`)
                      }
                    />
                    <CardContent
                      sx={{ paddingBottom: '1px', paddingLeft: '3px' }}
                    >
                      <Typography variant="body2">{squadra.squadra}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  )
}
