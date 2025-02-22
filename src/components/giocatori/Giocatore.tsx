"use client";
import {
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { api } from "~/utils/api";
import DataTable, {
  type Column,
} from "~/components/tables/datatable";
import { PersonSearch } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { LineChart } from "@mui/x-charts/LineChart";
import Image from "next/image";

interface GiocatoreProps {
  idGiocatore: number;
}

function Giocatore({ idGiocatore }: GiocatoreProps) {
  const giocatoreProfilo = api.giocatori.getStatistica.useQuery(
    { idGiocatore: idGiocatore },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  const giocatoreVoti = api.voti.getStatisticaVoti.useQuery(
    { idGiocatore: idGiocatore },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  const giocatoreTrasferimenti = api.trasferimenti.list.useQuery(
    { idGiocatore: idGiocatore },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  const giocatoreStatsStagioni = api.trasferimenti.statsStagioni.useQuery(
    { idGiocatore: idGiocatore },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  

  //#region bar graph
  const valueFormatter = (value: number | null) => `${value}`;

  const chartSetting = {
    yAxis: [
      {
        label: "Statistiche stagioni",
      },
    ],
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(0px, 0)",
      },
    },
  };

  const customizegraphstagioni = {
    height: 280,
    legend: { hidden: false },
    margin: { top: 5 },
  };
  //#endregion

  //#region line graph

  const keyToLabel: Record<string, string> = {
    voto: "Voto",
    gol: "Gol",
    assist: "Assist",
    ammonizione: "Ammonizioni",
    espulsione: "Espulsioni",
  };

  const stackStrategy = {
    stack: "total",
    area: false,
    stackOffset: "none",
  } as const;

  const customizegraphvoti = {
    height: 280,
    legend: { hidden: false },
    margin: { top: 5 },
    stackingOrder: "descending",
  };

  //#endregion

  //#region trasferimenti

  const columnsTransfer: Column[] = [
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
    { key: "stagione", type: "string", align: "left", header: "Stagione" },
    { key: "squadra", type: "string", align: "left", header: "Squadra" },
    {
      key: "dataAcquisto",
      type: "date",
      header: "Data acquisto",
      formatDate: "dd/MM/yyyy",
    },
    {
      key: "dataCessione",
      type: "date",
      header: "Data cessione",
      formatDate: "dd/MM/yyyy",
    },
    { key: "costo", type: "number", header: "Costo" },
  ];

  //#endregion

  return (
    <Grid container spacing={1} paddingTop={2} paddingBottom={2}>
          <Grid item xs={11}>
            <Typography variant="h4">
              {giocatoreProfilo.data && `Statistiche ${giocatoreProfilo.data.nome}`}
            </Typography>
          </Grid>
          <Grid
            item
            xs={1}
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"baseline"}
          >
            <>
              {idGiocatore && (
                <Tooltip title="Ricerca giocatori" placement="top-start">
                  <IconButton onClick={() => window.location.href='/statistiche_giocatori' }>
                    <PersonSearch color="primary" />
                  </IconButton>
                </Tooltip>
              )}
            </>
          </Grid>
          
          {idGiocatore && giocatoreProfilo.data && (
            <>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                <Grid container>
                  <Grid item sm={4}>
                    <Image
                      src={giocatoreProfilo.data.urlCampioncino}
                      width={164}
                      height={242}
                      alt={giocatoreProfilo.data.nome}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <Typography variant="h5">
                      Media: {giocatoreProfilo.data.media}
                      <br></br>
                      Gol: {giocatoreProfilo.data.gol}
                      <br></br>
                      Assist: {giocatoreProfilo.data.assist}
                      <br></br>
                      Ammonizioni: {giocatoreProfilo.data.ammonizioni}
                      <br></br>
                      Espulsioni: {giocatoreProfilo.data.espulsioni}
                      <br></br>
                      Giocate: {giocatoreProfilo.data.giocate}
                    </Typography>
                  </Grid>
                  <Grid item sm={4}>
                    <Typography variant="h5">
                      Ruolo: {giocatoreProfilo.data.ruoloEsteso}
                      <br></br>
                      Costo: {giocatoreProfilo.data.costo}
                      <br></br>
                      Squadra serie A: {giocatoreProfilo.data.squadraSerieA}
                      <br></br>
                      Squadra: {giocatoreProfilo.data.squadra}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: { xs: "block", sm: "none" } }}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="h6">
                      Media: {giocatoreProfilo.data.media}
                      <br></br>
                      Gol: {giocatoreProfilo.data.gol}
                      <br></br>
                      Assist: {giocatoreProfilo.data.assist}
                      <br></br>
                      Ammonizioni: {giocatoreProfilo.data.ammonizioni}
                      <br></br>
                      Espulsioni: {giocatoreProfilo.data.espulsioni}
                      <br></br>
                      Giocate: {giocatoreProfilo.data.giocate}
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="h6">
                      Ruolo: {giocatoreProfilo.data.ruoloEsteso}
                      <br></br>
                      Costo: {giocatoreProfilo.data.costo}
                      <br></br>
                      Squadra serie A: {giocatoreProfilo.data.squadraSerieA}
                      <br></br>
                      Squadra: {giocatoreProfilo.data.squadra}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          {idGiocatore && giocatoreVoti.data && (
            <Zoom in={true}>
              <Grid
                item
                xs={12}
                sm={6}
                display={"flex"}
                justifyContent={"flex-end"}
              >
                <LineChart
                  yAxis={[
                    {
                      min: 0,
                      max: 10,
                      label: "Voti stagionali",
                      colorMap: {
                        type: "piecewise",
                        thresholds: [6, 10],
                        colors: ["red", "green"],
                      },
                    },
                  ]}
                  xAxis={[
                    {
                      dataKey: "giornataSerieA",
                      valueFormatter: (value) => `Giornata ${value}`,
                      min: 1,
                      max: 38,
                    },
                  ]}
                  series={Object.keys(keyToLabel)
                    .filter((c) => c === "voto")
                    .map((key) => ({
                      dataKey: key,
                      label: keyToLabel[key],
                      valueFormatter: (value, item) => {
                        const dataIndex = item.dataIndex;
                        return value === null
                          ? ""
                          : `${value} - Gol: ${
                              giocatoreVoti?.data[dataIndex]?.gol ?? 0
                            } - Assist: ${
                              giocatoreVoti?.data[dataIndex]?.assist ?? 0
                            } ${
                              (giocatoreVoti?.data[dataIndex]?.ammonizione ??
                                0) !== 0
                                ? " - Ammonizione"
                                : ""
                            } ${
                              (giocatoreVoti?.data[dataIndex]?.espulsione ??
                                0) !== 0
                                ? "- Espulsione"
                                : ""
                            }`;
                      },
                      showMark: true,
                      ...stackStrategy,
                    }))}
                  grid={{ vertical: true, horizontal: true }}
                  dataset={giocatoreVoti.data}
                  {...customizegraphvoti}
                />
              </Grid>
            </Zoom>
          )}
          {idGiocatore && giocatoreTrasferimenti.data && (
            <Zoom in={true}>
              <Grid item xs={12} sm={6}>
                <DataTable
                  title={`Trasferimenti giocatore`}
                  pagination={false}
                  rowsXPage={5}
                  messageWhenEmptyList="Nessun giocatore presente"
                  data={giocatoreTrasferimenti.data}
                  columns={columnsTransfer}
                />
              </Grid>
            </Zoom>
          )}
          {idGiocatore && giocatoreStatsStagioni.data && (
            <Zoom in={true}>
              <Grid
                item
                xs={12}
                sm={6}
                display={"flex"}
                justifyContent={"flex-end"}
              >
                <BarChart
                  dataset={giocatoreStatsStagioni.data}
                  xAxis={[{ scaleType: "band", dataKey: "stagione" }]}
                  series={[
                    { dataKey: "media", label: "Media", valueFormatter },
                    { dataKey: "gol", label: "Gol", valueFormatter },
                    { dataKey: "assist", label: "Assist", valueFormatter },
                    { dataKey: "giocate", label: "Giocate", valueFormatter },
                  ]}
                  {...chartSetting}
                  {...customizegraphstagioni}
                />
              </Grid>
            </Zoom>
      )}
      <Grid item xs={12} minHeight={30}></Grid>
    </Grid>
  );
}

export default Giocatore;
