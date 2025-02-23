import * as React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

//material-ui
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Tooltip,
} from "@mui/material";
import { RuoloUtente } from "~/utils/enums";
import { Cottage, ExitToApp, WorkHistory } from "@mui/icons-material";
import { adminListItems, guestListItems } from "../navigation/NavItems";
import { Configurazione } from "~/config";
import Link from "next/link";

interface AppAppBarProps {
  isXs: boolean;
}

function AppAppBar({ isXs }: AppAppBarProps) {
  const { data: session } = useSession();

  const handleGoToHome = () => {
    window.location.href = "/";
  };

  //gestione pulsanti menu backoffice
  const [anchorBo, setAnchorBo] = React.useState<null | HTMLElement>(null);
  const openBo = Boolean(anchorBo);
  const handleClickBo = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorBo(event.currentTarget);
  };
  const handleCloseBo = () => {
    setAnchorBo(null);
  };

  //gestione pulsanti menu avatar
  const [anchorAv, setAnchorAv] = React.useState<null | HTMLElement>(null);
  const openAv = Boolean(anchorAv);
  const handleClickAv = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorAv(event.currentTarget);
  };
  const handleCloseAv = () => {
    setAnchorAv(null);
  };

  //gestione drawer menu mobile
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        marginTop: "0px",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
            bgcolor: theme.palette.primary.light,
            backdropFilter: "blur(24px)",
            maxHeight: 40,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: `1 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`,
          })}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              ml: "0px",
              px: 0,
            }}
          >
            <Typography
              variant="h1"
              onClick={handleGoToHome}
              sx={{
                textShadow: "4px 4px 1px rgba(85,33,203, 0.7)",
                mr: "30px",
                cursor: "pointer",
                display: { xs: "none", sm: "block" },
              }}
            >
              erFantacalcio {Configurazione.stagione}
            </Typography>
            <Typography
              variant="h1"
              onClick={handleGoToHome}
              sx={{
                textShadow: "4px 4px 1px rgba(85,33,203, 0.7)",
                mr: "30px",
                fontSize: "18px",
                cursor: "pointer",
                display: { xs: "block", sm: "none" },
              }}
            >
              erFantacalcio {Configurazione.stagione}
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              alignItems: "center",
            }}
          >
            {!session ? (
              <Button
                color="info"
                variant="contained"
                size="small"
                component="a"
                onClick={() => void signIn("erFantacalcio")}
              >
                Sign in
              </Button>
            ) : (
              <>
                {session?.user?.ruolo === RuoloUtente.admin && (
                  <div>
                    <Tooltip title="Home Page">
                      <IconButton
                        color="info"
                        onClick={() => (window.location.href = "/")}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={openBo ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openBo ? "true" : undefined}
                      >
                        <Cottage />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Admin settings">
                      <IconButton
                        color="info"
                        onClick={handleClickBo}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={openBo ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openBo ? "true" : undefined}
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
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{
                        horizontal: "right",
                        vertical: "top",
                      }}
                      anchorOrigin={{
                        horizontal: "right",
                        vertical: "bottom",
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
                      aria-controls={openAv ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openAv ? "true" : undefined}
                    >
                      <Avatar
                        alt={session.user?.squadra}
                        src={session.user?.image?.toString()}
                        sx={{ mr: "5px" }}
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
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    {guestListItems()}

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
          <Box sx={{ display: { sm: "", md: "none" } }}>
            <Tooltip title="Home Page">
              <IconButton
                color="info"
                onClick={() => (window.location.href = "/")}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={openBo ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openBo ? "true" : undefined}
              >
                <Cottage />
              </IconButton>
            </Tooltip>
            <Button
              variant="text"
              color="info"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ minWidth: "20px", p: "0px" }}
            >
              <MenuIcon />
            </Button>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
              <Box
                sx={{
                  minWidth: "60dvw",
                  p: 1,
                  backgroundColor: "info.light",
                  flexGrow: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                    flexGrow: 1,
                  }}
                ></Box>
                {session?.user && (
                  <>
                    <Link href={`/formazione?isXs=${isXs}`}>
                      <ListItemButton>
                        <ListItemText primary="Inserisci formazione" />
                      </ListItemButton>
                    </Link>
                    <ListItemButton href="/foto">
                      <ListItemText primary="Foto profilo" />
                    </ListItemButton>
                    <Divider />
                  </>
                )}
                <>
                  {/* <ListItemButton href="/squadre">
                    <ListItemText primary="Le Squadre" />
                  </ListItemButton> */}
                  <ListItemButton href="/statistiche_giocatori">
                    <ListItemText primary="Statistiche giocatori" />
                  </ListItemButton>
                  <ListItemButton href="/economia">
                    <ListItemText primary="Economia e premi" />
                  </ListItemButton>
                  <ListItemButton href="/albo">
                    <ListItemText primary="Albo d'oro" />
                  </ListItemButton>
                  <ListItemButton
                    href="/docs/Regolamento_erFantacalcio.pdf"
                    target="_blank"
                  >
                    <ListItemText primary="Regolamento ufficiale" />
                  </ListItemButton>
                  <Divider />
                </>
                {session?.user?.ruolo === RuoloUtente.admin && (
                  <>
                    <Typography fontSize="h4">
                      <b>
                        <br></br>Admin Area
                      </b>
                    </Typography>
                    <ListItemButton href="/uploadVoti">
                      <ListItemText primary="Carica voti" />
                    </ListItemButton>
                    <ListItemButton href="/risultati">
                      <ListItemText primary="Risultati" />
                    </ListItemButton>
                    <ListItemButton href="/calendario">
                      <ListItemText primary="Calendario" />
                    </ListItemButton>
                    <ListItemButton href="/presidenti">
                      <ListItemText primary="Presidenti" />
                    </ListItemButton>
                    <ListItemButton href="/giocatori">
                      <ListItemText primary="Giocatori" />
                    </ListItemButton>
                    <ListItemButton href="/voti">
                      <ListItemText primary="Voti" />
                    </ListItemButton>
                    <ListItemButton href="/avvioStagione">
                      <ListItemText primary="Nuova stagione" />
                    </ListItemButton>
                    <Divider />
                  </>
                )}
                {!session ? (
                  <MenuItem>
                    <Button
                      color="success"
                      variant="contained"
                      component="a"
                      onClick={() => void signIn("erFantacalcio")}
                      sx={{ width: "100%" }}
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
                      sx={{ width: "100%" }}
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
  );
}

export default AppAppBar;
