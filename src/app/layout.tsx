'use client'
import { api } from '~/utils/api'
import ProvidersWrapper from '~/ProvidersWrapper'
import {
  CssBaseline,
  Box,
  Toolbar,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import AppAppBar from '~/components/appbar/AppBar'

function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('md'))
  const Footer = () => {
    return (
      <Box
        position="fixed"
        sx={{
          boxShadow: 0,
          width: '100%',
          height: 'auto',
          backgroundColor: 'transparent',
          bottom: 0,
          left: 0,
          padding: '0px',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="dense"
            sx={(theme) => ({
              display: 'flex',
              flexShrink: 0,
              padding: '0px',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              bgcolor: theme.palette.primary.dark,
              opacity: 0.9,
              backdropFilter: 'blur(24px)',
              maxHeight: '8px',
              marginBottom: '0px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: `1 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`,
            })}
          >
            <Grid container>
              <Grid item xs={6} display={'flex'} justifyContent={'flex-start'}>
                <a
                  href="mailto: lucianominni@gmail.com"
                  style={{ textDecoration: 'none' }}
                >
                  <Typography color="info.main" variant="subtitle2">
                    Powered by Luciano Minni
                  </Typography>
                </a>
              </Grid>
              <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
                <Typography color="info.main" variant="subtitle2">
                  NextJs | React | MUI | Prisma
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </Box>
    )
  }

  return (
    <>
      <html>
        <head></head>
        <body>
          <main>
            <ProvidersWrapper>
              <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppAppBar isXs={isXs} />

                <Box
                  component="main"
                  sx={{
                    //backgroundColor: (theme) => theme.palette.info.light,
                    flexGrow: '1',
                    height: '100vh',
                    overflow: 'unset',
                  }}
                >
                  <Toolbar></Toolbar>
                  <Container maxWidth="lg" sx={{ mt: '3px', mb: '3px' }}>
                    {children}
                  </Container>
                  <Footer />
                </Box>
              </Box>
            </ProvidersWrapper>
          </main>
        </body>
      </html>
    </>
  )
}

export default api.withTRPC(RootLayout)
