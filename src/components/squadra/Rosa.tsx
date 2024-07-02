import { Home, Ballot, QueryStats } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { FrameType } from "~/utils/enums";
import { useTheme } from "@mui/material/styles";
import {
  type GiocatoreFormazioneType,
  type GiocatoreType,
} from "~/types/squadre";

interface RosaProps {
  onActionChange: (action: FrameType) => void;
  onActionGoToStatistica: (action: FrameType, idSquadra: number) => void;
  onActionGoToGiocatore: (action: FrameType, idGiocatore: number) => void;
  idSquadra: number;
  squadra: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function Rosa({
  onActionChange: onActionActive,
  onActionGoToStatistica: onActionStatistica,
  onActionGoToGiocatore: onActionGiocatore,
  idSquadra,
  squadra,
}: RosaProps) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("md"));
  const rosaList = api.squadre.getRosa.useQuery(
    { idSquadra: idSquadra, includeVenduti: true },
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
  const { data: session } = useSession();
  const [rosa, setRosa] = useState<GiocatoreFormazioneType[]>([]);
  const [value, setValue] = useState(3);

  useEffect(() => {
    if (rosaList.data) {
      const rosaConRuolo = rosaList.data.map((giocatore: GiocatoreType) => ({
        ...giocatore,
        titolare: false,
        riserva: null,
      }));

      setRosa(rosaConRuolo);
    }
  }, [rosaList.data]);

  const handleAction = (newFrame: FrameType) => {
    onActionActive(newFrame);
  };

  const handleActionStatistica = (newFrame: FrameType, idSquadra: number) => {
    onActionStatistica(newFrame, idSquadra);
  };

  const handleActionGiocatore = (newFrame: FrameType, idGiocatore: number) => {
    onActionGiocatore(newFrame, idGiocatore);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderRosa = (roles: string[], isVenduto: boolean) => {
    const filteredRosa = rosa.filter(
      (player) => roles.includes(player.ruolo) && player.isVenduto === isVenduto
    );
    return (
      <Grid container spacing={0}>
        {filteredRosa.map((giocatore, index) => (
          <Grid
            key={index}
            item
            xs={6}
            sm={1.5}
            sx={{
              display: "flex",
              justifyContent: "center",
              p: "10px",
              mb: "10px",
              flexWrap: "wrap",
            }}
          >
            <Card sx={{ marginBottom: "1px" }}>
              <CardMedia
                component="img"
                sx={{ cursor: "pointer", width: "120px" }}
                image={giocatore.urlCampioncino}
                alt={giocatore.nome}
                onClick={() =>
                  handleActionGiocatore(
                    FrameType.giocatori,
                    giocatore.idGiocatore
                  )
                }
              />
              <CardContent sx={{ paddingBottom: "0px" }}>
                <Typography
                  gutterBottom
                  variant="body2"
                  sx={{
                    fontSize: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  component="div"
                >
                  {giocatore.nome}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body1"
                  sx={{
                    fontSize: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  component="div"
                >
                  {giocatore.ruoloEsteso}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

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
    );
  }

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  return (
    <Grid container spacing={0}>
      {rosaList.isLoading ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <>
          <Grid item xs={6}>
            <Typography variant="h5">Rosa {squadra}</Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            {session?.user && (
              <Tooltip title="Schiera formazione" placement="top-start">
                <IconButton
                  onClick={() => handleAction(FrameType.schieraFormazione)}
                >
                  <Ballot color="primary" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Statistiche">
              <IconButton
                onClick={() =>
                  handleActionStatistica(
                    FrameType.statisticheSquadra,
                    idSquadra
                  )
                }
              >
                <QueryStats color="success" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Home" placement="top-start">
              <IconButton onClick={() => handleAction(FrameType.defaultHome)}>
                <Home color="primary" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="inherit"
                  variant={isXs ? "scrollable" : "fullWidth"}
                  sx={isXs ? { maxWidth: "350px" } : {}}
                  scrollButtons="auto"
                  aria-label="Rosa giocatori"
                >
                  <Tab label={isXs ? "Por" : "Portieri"} {...a11yProps(0)} />
                  <Tab label={isXs ? "Dif" : "Difensori"} {...a11yProps(1)} />
                  <Tab
                    label={isXs ? "Cen" : "Centrocampisti"}
                    {...a11yProps(2)}
                  />
                  <Tab label={isXs ? "Att" : "Attaccanti"} {...a11yProps(3)} />
                  <Tab label={isXs ? "Ex" : "Venduti"} {...a11yProps(4)} />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={value} index={0} dir={theme.direction}>
                  {renderRosa(["P"], false)}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                  {renderRosa(["D"], false)}
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                  {renderRosa(["C"], false)}
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                  {renderRosa(["A"], false)}
                </TabPanel>
                <TabPanel value={value} index={4} dir={theme.direction}>
                  {renderRosa(["P", "D", "C", "A"], true)}
                </TabPanel>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      <Grid item xs={12} sx={{ height: "100px" }}>
        <></>
      </Grid>
    </Grid>
  );
}

export default Rosa;
