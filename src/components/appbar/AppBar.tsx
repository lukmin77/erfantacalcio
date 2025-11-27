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

interface AppAppBarProps {
  isXs: boolean
}

function AppAppBar({ isXs }: AppAppBarProps) {
  const { data: session } = useSession()

  // Festive mode: enabled automatically in December or when forcing via env var
  const [isChristmasMode, setIsChristmasMode] = React.useState(false)
  React.useEffect(() => {
    try {
      const month = new Date().getMonth()
      //solo dicembre e gennaio
      setIsChristmasMode(month === 11 || month === 0)
    } catch (e) {
      setIsChristmasMode(false)
    }
  }, [])

  // Canvas ref + animation control
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const animRef = React.useRef<number | null>(null)

  // Canvas-based snow animation
  React.useEffect(() => {
    if (!isChristmasMode) {
      // clear canvas if present
      const c = canvasRef.current
      if (c) {
        const ctx = c.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, c.width, c.height)
      }
      return
    }

    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = window.devicePixelRatio || 1
    let width = canvas.clientWidth
    let height = canvas.clientHeight

    const resize = () => {
      width = canvas.clientWidth || window.innerWidth
      height = canvas.clientHeight || 48
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    // observe resize for the canvas container
    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize)
      ro.observe(canvas)
    } else {
      window.addEventListener('resize', resize)
    }

    // particle setup
    type Particle = {
      x: number
      y: number
      r: number
      vy: number
      swayAmp: number
      swayFreq: number
      phase: number
      opacity: number
    }

    const count = isXs ? 30 : 80
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: 1 + Math.random() * 6,
        vy: 0.3 + Math.random() * 1.6,
        swayAmp: 8 + Math.random() * 40,
        swayFreq: 0.002 + Math.random() * 0.006,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.6 + Math.random() * 0.4,
      })
    }

    let last = performance.now()

    const drawParticle = (p: Particle) => {
      const x = p.x
      const y = p.y
      const r = Math.max(0.5, p.r)
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(255,255,255,${p.opacity})`)
      g.addColorStop(0.6, `rgba(255,255,255,${Math.max(0, p.opacity - 0.15)})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const step = (now: number) => {
      const dt = Math.min(40, now - last)
      last = now
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        // vertical movement scaled by dt
        p.y += p.vy * (dt / 16)
        // horizontal sway using sine function
        p.x += Math.sin(p.phase + p.y * p.swayFreq) * (p.swayAmp * 0.02) * (dt / 16)
        // advance phase slowly
        p.phase += 0.002 * (dt / 16)

        // recycle when out of view
        if (p.y - p.r > height) {
          p.y = -10 - Math.random() * 40
          p.x = Math.random() * width
          p.r = 1 + Math.random() * 6
          p.vy = 0.3 + Math.random() * 1.6
          p.swayAmp = 8 + Math.random() * 40
          p.swayFreq = 0.002 + Math.random() * 0.006
          p.phase = Math.random() * Math.PI * 2
          p.opacity = 0.6 + Math.random() * 0.4
        }

        // wrap horizontally to avoid sudden pop
        if (p.x < -50) p.x = width + 50
        if (p.x > width + 50) p.x = -50

        drawParticle(p)
      }
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', resize)
    }
  }, [isChristmasMode, isXs])
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
        {/* Canvas-based snow (more performant for many particles) */}
        {isChristmasMode && (
          <canvas
            ref={canvasRef}
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
        <Toolbar
          variant="regular"
          sx={(theme) =>
            isChristmasMode
              ? {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                  borderTopLeftRadius: '0px',
                  borderTopRightRadius: '0px',
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
                  background: 'linear-gradient(135deg, #0b6623 0%, #b30000 100%)',
                  color: '#fff',
                  backdropFilter: 'blur(8px)',
                  maxHeight: 48,
                  border: '1px solid',
                  borderColor: 'rgba(255,255,255,0.12)',
                  boxShadow: `0 6px 18px rgba(179,0,0,0.12), 0 1px 4px rgba(11,102,35,0.08)`,
                }
              : {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                  borderTopLeftRadius: '0px',
                  borderTopRightRadius: '0px',
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
                  bgcolor: theme.palette.primary.dark,
                  backdropFilter: 'blur(24px)',
                  maxHeight: 40,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: `1 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`,
                }
          }
        >
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
              <IconButton size="small" color="inherit" aria-label="festive-left" sx={{ color: '#fff' }}>
                <AutoAwesome />
              </IconButton>
              <Typography variant="h1" sx={{ color: '#fff' }}>
                erFantacalcio {Configurazione.stagione}
              </Typography>
              <IconButton size="small" color="inherit" aria-label="festive-right" sx={{ color: '#fff' }}>
                <CardGiftcard />
              </IconButton>
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
              <AutoAwesome sx={{ fontSize: 20 }} />
              <Typography variant="h1" sx={{ fontSize: '20px', color: '#fff' }}>
                erFantacalcio {Configurazione.stagione}
              </Typography>
              <CardGiftcard sx={{ fontSize: 20 }} />
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
                      sx={{ width: '100%' }}
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
