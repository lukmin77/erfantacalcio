"use client";
import {
  Box,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Tooltip,
  Typography,
  Zoom,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useTheme } from "@mui/material/styles";
import { type iGiocatoreStats } from "~/types/giocatori";
import AutocompleteTextbox, {
  type iElements,
} from "~/components/autocomplete/AutocompleteGiocatore";
import DataTable, {
  type ActionOptions,
  type Column,
  type Rows,
} from "~/components/tables/datatable";
import { type Ruoli } from "~/types/common";
import { getRuoloEsteso } from "~/utils/helper";
import { BarChartOutlined } from "@mui/icons-material";
import Modal from "../modal/Modal";
import Giocatore from "./Giocatore";

function Giocatori() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedGiocatoreId, setSelectedGiocatoreId] = useState<number>();
  const [openModalCalendario, setOpenModalCalendario] = useState(false);
  const giocatoriList = api.giocatori.listAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const [ruolo, setRuolo] = useState<Ruoli>("C");
  const giocatoriStats = api.giocatori.listStatistiche.useQuery(
    { ruolo: ruolo },
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
  const [giocatori, setGiocatori] = useState<iElements[]>([]);

  useEffect(() => {
    if (giocatoriList.data) {
      setGiocatori(giocatoriList.data);
    }
  }, [giocatoriList.data]);

  const handleGiocatoreSelected = async (idGiocatore: number | undefined) => {
    setSelectedGiocatoreId(idGiocatore);
    setOpenModalCalendario(true);
  };

  const handleModalClose = () => {
    setOpenModalCalendario(false);
  };

  // const handleStatGiocatore = (idGiocatore: number) => {
  //   setIdGiocatore(idGiocatore);
  //   setOpenModalCalendario(true);
  // };

  const columns: Column[] = [
    {
      key: "idgiocatore",
      width: "5%",
      type: "number",
      align: "left",
      visible: false,
    },
    {
      key: "maglia",
      type: "image",
      align: "left",
      header: " ",
      width: "5%",
      imageProps: {
        imageTooltip: "squadraSerieA",
        imageTooltipType: "dynamic",
        imageWidth: 26,
        imageHeight: 22,
      },
    },
    {
      key: "nome",
      type: "string",
      align: "left",
      header: "Nome",
      sortable: true,
    },
    {
      key: "squadra",
      type: "string",
      align: "left",
      header: "Squadra",
      sortable: true,
    },
    { key: "media", type: "number", header: "Media", sortable: true },
    {
      key: "golfatti",
      type: "number",
      header: "Gol",
      visible: ruolo === "P" ? false : true,
      sortable: true,
    },
    {
      key: "golsubiti",
      type: "number",
      header: "Gol",
      visible: ruolo === "P" ? true : false,
      sortable: true,
    },
    { key: "assist", type: "number", header: "Assist", sortable: true },
    { key: "giocate", type: "number", header: "Giocate", sortable: true },
    {
      key: "",
      width: "5%",
      type: "action",
      align: "right",
      header: "Statistica",
    },
  ];

  const actionView = (idGiocatore: string) => {
    return (
      <div>
        <Tooltip
          title={"Vedi statistica"}
          onClick={() => handleGiocatoreSelected(parseInt(idGiocatore))}
          placement="left"
        >
          <BarChartOutlined color="success" />
        </Tooltip>
      </div>
    );
  };

  const actionOptions: ActionOptions[] = [
    {
      keyFields: ["idgiocatore"],
      component: actionView,
    },
  ];

  const mapStatsToRows = (
    stats: iGiocatoreStats[] | undefined
  ): Rows[] | undefined => {
    if (!stats) {
      return undefined;
    }

    return stats.map((stat) => ({
      media: stat.media,
      mediabonus: stat.mediabonus,
      golfatti: stat.golfatti,
      golsubiti: stat.golsubiti,
      assist: stat.assist,
      ammonizioni: stat.ammonizioni,
      espulsioni: stat.espulsioni,
      giocate: stat.giocate,
      ruolo: stat.ruolo,
      nome: stat.nome,
      nomefantagazzetta: stat.nomefantagazzetta,
      idgiocatore: stat.idgiocatore,
      maglia: `/images/maglie/${stat.maglia}`,
      squadraSerieA: stat.squadraSerieA,
      squadra: stat.squadra,
      idSquadra: stat.idSquadra,
    }));
  };

  return (
    <>
      <Grid container spacing={1} paddingTop={2} paddingBottom={2}>
        {giocatoriList.isLoading || giocatoriStats.isLoading ? (
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
            <Grid item xs={12}>
              <Typography variant="h4">Statistiche Giocatori</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    color="info"
                    onChange={() => setRuolo("P")}
                    checked={ruolo === "P"}
                  />
                }
                label={isXs ? "P" : getRuoloEsteso("P", true)}
              />
              <FormControlLabel
                control={
                  <Switch
                    color="warning"
                    onChange={() => setRuolo("D")}
                    checked={ruolo === "D"}
                  />
                }
                label={isXs ? "D" : getRuoloEsteso("D", true)}
              />
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    onChange={() => setRuolo("C")}
                    checked={ruolo === "C"}
                  />
                }
                label={isXs ? "C" : getRuoloEsteso("C", true)}
              />
              <FormControlLabel
                control={
                  <Switch
                    color="error"
                    onChange={() => setRuolo("A")}
                    checked={ruolo === "A"}
                  />
                }
                label={isXs ? "A" : getRuoloEsteso("A", true)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AutocompleteTextbox
                onItemSelected={handleGiocatoreSelected}
                items={giocatori ?? []}
              />
            </Grid>
            <Zoom in={true}>
              <Grid item xs={12}>
                <DataTable
                  title={`Top ${getRuoloEsteso(ruolo, true)}`}
                  pagination={false}
                  messageWhenEmptyList="Nessun giocatore presente"
                  data={mapStatsToRows(giocatoriStats.data)}
                  columns={columns}
                  actionOptions={actionOptions}
                  rowsXPage={15}
                />
                <br></br>
                <br></br>
                <br></br>
              </Grid>
            </Zoom>
          </>
        )}
        <Grid item xs={12} minHeight={30}></Grid>
      </Grid>

      <Modal
        title={"Statistica giocatore"}
        open={openModalCalendario}
        onClose={handleModalClose}
        width={isXs ? "98%" : "1266px"}
        height={isXs ? "98%" : ""}
      >
        <Divider />
        <Box sx={{ mt: 1, gap: "0px", flexWrap: "wrap" }}>
          <Giocatore idGiocatore={selectedGiocatoreId!} />
        </Box>
      </Modal>
    </>
  );
}

export default Giocatori;
