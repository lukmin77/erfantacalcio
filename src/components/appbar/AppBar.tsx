import * as React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

//material-ui
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Drawer from '@mui/material/Drawer'
import MenuIcon from '@mui/icons-material/Menu'
import {
  Avatar,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Tooltip,
} from '@mui/material'
import { CardGiftcard, AutoAwesome } from '@mui/icons-material'
import { RuoloUtente } from '~/utils/enums'
import { Cottage, ExitToApp, WorkHistory } from '@mui/icons-material'
import { adminListItems, guestListItems } from '../navigation/NavItems'
import { Configurazione } from '~/config'
import Link from 'next/link'
import useSeasonal from './seasonalHooks'
import getToolbarSx from './toolbarSx'
import getToolbarPresentation from './toolbarPresentation'

interface AppAppBarProps {
  isXs: boolean
}

function AppAppBar({ isXs }: AppAppBarProps) {
  const { data: session } = useSession()

  const { active: seasonalActive, canvasRef: seasonalCanvasRef, variant: seasonalVariant } = useSeasonal(isXs)
  const { titleColor, iconColor, buttonSx } = getToolbarPresentation(seasonalVariant)
  const handleGoToHome = () => {
    window.location.href = '/'
  }

  //gestione pulsanti menu backoffice
  const [anchorBo, setAnchorBo] = React.useState<null | HTMLElement>(null)
  const openBo = Boolean(anchorBo)
  const handleClickBo = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorBo(event.currentTarget)
  }
  const handleCloseBo = () => {
    setAnchorBo(null)
  }

  //gestione pulsanti menu avatar
  const [anchorAv, setAnchorAv] = React.useState<null | HTMLElement>(null)
  const openAv = Boolean(anchorAv)
  const handleClickAv = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorAv(event.currentTarget)
  }
  const handleCloseAv = () => {
    setAnchorAv(null)
  }

  //gestione drawer menu mobile
  const [open, setOpen] = React.useState(false)
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        marginTop: '0px',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Canvas-based seasonal effects (snow/rain/etc) */}
        {seasonalActive && (
          <canvas
            ref={seasonalCanvasRef}
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        )}
        <Toolbar variant="regular" sx={getToolbarSx(seasonalVariant)}>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              ml: '0px',
              px: 0,
            }}
          >
            {/* Festive title: small decorations left and right */}
            <Box
              onClick={handleGoToHome}
              sx={{
                mr: '30px',
                cursor: 'pointer',
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 1,
              }}
            >
              {seasonalVariant === 'christmas' && (
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="festive-left"
                  sx={{ color: iconColor }}
                >
                  <AutoAwesome />
                </IconButton>
              )}
              <Typography variant="h1" sx={{ color: titleColor }}>
                erFantacalcio {Configurazione.stagione}
              </Typography>
              {seasonalVariant === 'christmas' && (
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="festive-right"
                  sx={{ color: iconColor }}
                >
                  <CardGiftcard />
                </IconButton>
              )}
            </Box>

            <Box
              onClick={handleGoToHome}
              sx={{
                mr: '10px',
                fontSize: '20px',
                cursor: 'pointer',
                display: { xs: 'flex', sm: 'none' },
                alignItems: 'center',
                gap: 0.5,
                color: '#fff',
              }}
            >
              {seasonalVariant === 'christmas' && (<AutoAwesome sx={{ fontSize: 20 }} />)}
              <Typography variant="h1" sx={{ fontSize: '20px', color: titleColor }}>
                erFantacalcio {Configurazione.stagione}
              </Typography>
              {seasonalVariant === 'christmas' && (<CardGiftcard sx={{ fontSize: 20 }} />)}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              alignItems: 'center',
            }}
          >
            {!session ? (
              <Button
                color="info"
                variant="contained"
                size="small"
                component="a"
                onClick={() => void signIn('erFantacalcio')}
                sx={{ ...(buttonSx as any) }}
              >
                Sign in
              </Button>
            ) : (
              <>
                {session?.user?.ruolo === RuoloUtente.admin && (
                  <div>
                    <Tooltip title="Admin settings">
                      <IconButton
                        color="info"
                        onClick={handleClickBo}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={openBo ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openBo ? 'true' : undefined}
                      >
                        <WorkHistory />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={anchorBo}
                      id="account-menu"
                      open={openBo}
                      onClose={handleCloseBo}
                      onClick={handleCloseBo}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{
                        horizontal: 'right',
                        vertical: 'top',
                      }}
                      anchorOrigin={{
                        horizontal: 'right',
                        vertical: 'bottom',
                      }}
                    >
                      {adminListItems()}
                    </Menu>
                  </div>
                )}
                <div>
                  <Tooltip title="Configurazioni profilo">
                    <IconButton
                      onClick={handleClickAv}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={openAv ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openAv ? 'true' : undefined}
                    >
                      <Avatar
                        alt={session.user?.squadra}
                        src={session.user?.image?.toString()}
                        sx={{ mr: '5px' }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorAv}
                    id="account-menu"
                    open={openAv}
                    onClose={handleCloseAv}
                    onClick={handleCloseAv}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {guestListItems(false, true)}

                    <ListItemButton
                      sx={{ p: 1 }}
                      onClick={() => void signOut()}
                    >
                      <ListItemIcon sx={{ mr: 2 }}>
                        <ExitToApp color="primary"></ExitToApp>
                      </ListItemIcon>
                      <ListItemText secondary="Logout" />
                    </ListItemButton>
                  </Menu>
                </div>
              </>
            )}
          </Box>
          <Box sx={{ display: { sm: '', md: 'none' } }}>
            <Button
              variant="text"
              color="info"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ minWidth: '20px', p: '0px' }}
            >
              <MenuIcon />
            </Button>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
              <Box
                sx={{
                  minWidth: '60dvw',
                  p: 1,
                  //backgroundColor: "info.light",
                  flexGrow: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    flexGrow: 1,
                  }}
                ></Box>
                {guestListItems(true, session?.user !== undefined)}
                <Divider />
                {session?.user?.ruolo === RuoloUtente.admin && adminListItems()}
                {!session ? (
                  <MenuItem>
                        <Button
                          color="success"
                          variant="contained"
                          component="a"
                          onClick={() => void signIn('erFantacalcio')}
                          sx={{ width: '100%', ...(buttonSx as any) }}
                        >
                          Sign in
                        </Button>
                  </MenuItem>
                ) : (
                  <MenuItem>
                    <Button
                      color="success"
                      variant="contained"
                      component="a"
                      onClick={() => void signOut()}
                      sx={{ width: '100%' }}
                    >
                      Sign out
                    </Button>
                  </MenuItem>
                )}
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default AppAppBar
