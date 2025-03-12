"use client";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  Grid,
  Tooltip,
  Zoom,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardHeader,
  CardMedia,
  Slide,
  CardActionArea,
} from "@mui/material";
import {
  AccessAlarm,
  Looks3Outlined,
  Looks4Outlined,
  Looks5Outlined,
  LooksOneOutlined,
  LooksTwoOutlined,
  PendingActions,
} from "@mui/icons-material";
import Classifica from "~/components/home/Classifica";
import Squadre from "~/components/home/Squadre";
import Calendario from "~/components/home/Calendario";
import Modal from "~/components/modal/Modal";
import { type GiornataType } from "~/types/common";
import CardPartite from "~/components/cardPartite/CardPartite";
import { useSession } from "next-auth/react";
import SquadreXs from "~/components/home/SquadreXs";

export default function HomePage() {
  const { data: session } = useSession();
  const torneiList = api.tornei.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("md"));
  const [openModalCalendario, setOpenModalCalendario] = useState(false);
  const [titleModalCalendario, setTitleModalCalendario] = useState("");
  const [girone, setGirone] = useState<number>();
  const [isCalendarioAttuale, setIsCalendarioAttuale] =
    useState<boolean>(false);
  const [isCalendarioRecuperi, setIsCalendarioRecuperi] =
    useState<boolean>(false);

  const calendarioList =
    girone && !isCalendarioAttuale && !isCalendarioRecuperi
      ? api.calendario.listByGirone.useQuery(girone, {
          enabled: true,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        })
      : isCalendarioAttuale
      ? api.calendario.listAttuale.useQuery(undefined, {
          enabled: isCalendarioAttuale,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        })
      : api.calendario.listRecuperi.useQuery(undefined, {
          enabled: isCalendarioRecuperi,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        });
  const [giornata, setGiornata] = useState<GiornataType[]>();

  useEffect(() => {
    if (
      !calendarioList.isFetching &&
      calendarioList.isSuccess &&
      calendarioList.data
    ) {
      setGiornata(calendarioList.data);
    }
  }, [
    calendarioList.data,
    calendarioList.isSuccess,
    calendarioList.isFetching,
  ]);

  const handleCalendario = (
    girone: number | undefined,
    isAttuale: boolean,
    onlyRecuperi: boolean
  ) => {
    setTitleModalCalendario(
      girone
        ? `Calendario girone ${girone}`
        : isAttuale
        ? `Calendario ultime partite`
        : `Calendario partite da recuperare`
    );
    setGirone(girone);
    setIsCalendarioAttuale(isAttuale);
    setIsCalendarioRecuperi(onlyRecuperi);
    setOpenModalCalendario(true);
  };

  const handleModalClose = () => {
    setOpenModalCalendario(false);
  };

  return (
    <>
      <Grid container spacing={0}>
        {isXs && session?.user && (
          <Grid item xs={12}>
            <Typography variant="h5">
              Bentornato {session.user.presidente}
            </Typography>
          </Grid>
        )}
        {!isXs && (
          <Slide direction={"down"} in={true}>
            <Grid item xs={12}>
              <Squadre />
            </Grid>
          </Slide>
        )}
        {!torneiList.isLoading && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              sx={!isXs ? { pr: "2px", pl: "15px", pt: "15px" } : {}}
            >
              <Calendario
                tipo={"risultati"}
                prefixTitle="Risultati:"
              ></Calendario>
              <Calendario
                tipo={"prossima"}
                prefixTitle=""
              ></Calendario>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  "& > *": { m: 1 },
                }}
              >
                <ButtonGroup
                  size="small"
                  color="primary"
                  aria-label="Small button group"
                >
                  <Tooltip title="Calendario partite ultimo periodo">
                    <Button
                      onClick={() => handleCalendario(undefined, true, false)}
                      startIcon={<AccessAlarm />}
                    ></Button>
                  </Tooltip>
                  <Tooltip title="Calendario girone 1">
                    <Button
                      onClick={() => handleCalendario(1, false, false)}
                      startIcon={<LooksOneOutlined />}
                    ></Button>
                  </Tooltip>
                  <Tooltip title="Calendario girone 2">
                    <Button
                      onClick={() => handleCalendario(2, false, false)}
                      startIcon={<LooksTwoOutlined />}
                    >
                      &nbsp;
                    </Button>
                  </Tooltip>
                  <Tooltip title="Calendario girone 3">
                    <Button
                      onClick={() => handleCalendario(3, false, false)}
                      startIcon={<Looks3Outlined />}
                    >
                      &nbsp;
                    </Button>
                  </Tooltip>
                  <Tooltip title="Calendario girone 4">
                    <Button
                      onClick={() => handleCalendario(4, false, false)}
                      startIcon={<Looks4Outlined />}
                    >
                      &nbsp;
                    </Button>
                  </Tooltip>
                  <Tooltip title="Calendario girone 5">
                    <Button
                      onClick={() => handleCalendario(5, false, false)}
                      startIcon={<Looks5Outlined />}
                    >
                      &nbsp;
                    </Button>
                  </Tooltip>
                  <Tooltip title="Partite da recuperare">
                    <Button
                      onClick={() => handleCalendario(undefined, false, true)}
                      startIcon={<PendingActions />}
                    ></Button>
                  </Tooltip>
                </ButtonGroup>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={!isXs ? { pr: "2px", pl: "15px", pt: "15px" } : {}}
            >
              {torneiList.data
                ?.filter((t) => t.hasClassifica)
                .map((torneo) => (
                  <>
                    <Classifica
                      key={torneo?.idTorneo} // Aggiunto key per React
                      nomeTorneo={torneo?.nome ?? ""}
                      idTorneo={torneo?.idTorneo}
                      gruppo={torneo?.gruppoFase ?? ""}
                    />
                    <br></br>
                  </>
                ))}
            </Grid>
            {isXs && session?.user && (
              <Grid item xs={12}>
                <SquadreXs />
              </Grid>
            )}
            {!isXs && (
              <>
                <Zoom in={true}>
                  <Grid
                    item
                    xs={6}
                    sm={3}
                    sx={
                      !isXs
                        ? { pr: "25px", pl: "0px", pt: "15px" }
                        : { pr: "5px" }
                    }
                  >
                    <Card>
                      <CardActionArea>
                        <CardHeader
                          title="Statistiche giocatori"
                          titleTypographyProps={{ variant: "h5" }}
                        />
                        <CardMedia
                          component="img"
                          image={"/images/giocatori.jpg"}
                          width={"201px"}
                          height={"139px"}
                          alt={"Statistiche giocatori"}
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            (window.location.href = "/statistiche_giocatori")
                          }
                        />
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Zoom>
                <Zoom in={true}>
                  <Grid
                    item
                    xs={6}
                    sm={3}
                    sx={
                      !isXs
                        ? { pr: "25px", pl: "0px", pt: "15px" }
                        : { pl: "5px" }
                    }
                  >
                    <Card>
                      <CardHeader
                        title="Albo"
                        titleTypographyProps={{ variant: "h5" }}
                      />
                      <CardMedia
                        component="img"
                        image={"/images/albo.jpg"}
                        width={"201px"}
                        height={"139px"}
                        alt={"Albo"}
                        sx={{ cursor: "pointer" }}
                        onClick={() => (window.location.href = "/albo")}
                      />
                    </Card>
                  </Grid>
                </Zoom>
                <Zoom in={true}>
                  <Grid
                    item
                    xs={6}
                    sm={3}
                    sx={
                      !isXs
                        ? { pr: "25px", pl: "0px", pt: "15px" }
                        : { pr: "5px" }
                    }
                  >
                    <Card>
                      <CardHeader
                        title="Economia e premi"
                        titleTypographyProps={{ variant: "h5" }}
                      />
                      <CardMedia
                        component="img"
                        image={"/images/soldi.png"}
                        width={"201px"}
                        height={"139px"}
                        alt={"Economia e premi"}
                        sx={{ cursor: "pointer" }}
                        onClick={() => (window.location.href = "/economia")}
                      />
                    </Card>
                  </Grid>
                </Zoom>
                <Zoom in={true}>
                  <Grid
                    item
                    xs={6}
                    sm={3}
                    sx={
                      !isXs
                        ? { pr: "0px", pl: "0px", pt: "15px" }
                        : { pl: "5px" }
                    }
                  >
                    <Card>
                      <CardHeader
                        title="Regolamento"
                        titleTypographyProps={{ variant: "h5" }}
                      />
                      <CardMedia
                        component="img"
                        image={"/images/regolamento.jpg"}
                        width={"201px"}
                        height={"139px"}
                        alt={"Regolamento"}
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          (window.location.href =
                            "/docs/Regolamento_erFantacalcio.pdf")
                        }
                      />
                    </Card>
                  </Grid>
                </Zoom>
              </>
            )}
            <Grid item xs={12} sx={{ height: "80px" }}>
              <></>
            </Grid>
          </>
        )}
      </Grid>

      <Modal
        title={titleModalCalendario}
        open={openModalCalendario}
        onClose={handleModalClose}
        width={isXs ? "98%" : "70%"}
        height={isXs ? "98%" : "500px"}
      >
        <Divider />
        <Box sx={{ mt: 1, gap: "0px", flexWrap: "wrap" }}>
          {calendarioList.isLoading ? (
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
            <Grid container spacing={0} sx={{ gap: "0px" }}>
              {giornata?.map((g, index) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={6}
                  lg={4}
                  key={`card_partite_${index}_${g.idCalendario}`}
                  sx={{ ml: "0px" }}
                >
                  <CardPartite
                    giornata={[g]}
                    prefixTitle={""}
                    maxWidth={isXs ? "100%" : "300px"}
                    withAvatar={false}
                  ></CardPartite>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Modal>
    </>
  );
}
