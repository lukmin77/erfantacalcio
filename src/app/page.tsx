"use client";
import React, { useCallback, useEffect, useState } from "react";
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
  IconButton,
  Card,
  CardHeader,
  CardMedia,
  Slide,
  CardActionArea,
} from "@mui/material";
import {
  AccessAlarm,
  Ballot,
  CalendarMonth,
  EmojiEvents,
  Looks3Outlined,
  Looks4Outlined,
  Looks5Outlined,
  LooksOneOutlined,
  LooksTwoOutlined,
  Login,
  PendingActions,
} from "@mui/icons-material";
import { type TorneoType } from "~/types/tornei";
import Classifica from "~/components/home/Classifica";
import Squadre from "~/components/home/Squadre";
import SquadreCarousel from "~/components/home/SquadreCarousel";
import Calendario from "~/components/home/Calendario";
import Modal from "~/components/modal/Modal";
import { type GiornataType } from "~/types/common";
import CardPartite from "~/components/cardPartite/CardPartite";
import { FrameType } from "~/utils/enums";
import Rosa from "~/components/squadra/Rosa";
import StatisticaSquadra from "~/components/squadra/StatisticaSquadra";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();
  const [frame, setFrame] = useState<FrameType>(FrameType.defaultHome);
  const torneiList = api.tornei.list.useQuery(undefined, {
    enabled: frame === FrameType.defaultHome,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const [torneo, setTorneo] = useState<TorneoType>();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("md"));
  const [openModalCalendario, setOpenModalCalendario] = useState(false);
  const [titleModalCalendario, setTitleModalCalendario] = useState("");
  const [girone, setGirone] = useState<number>();
  const [isCalendarioAttuale, setIsCalendarioAttuale] =
    useState<boolean>(false);
  const [isCalendarioRecuperi, setIsCalendarioRecuperi] =
    useState<boolean>(false);
  const [idSquadra, setIdSquadra] = useState<number>();
  const [idGiocatore, setIdGiocatore] = useState<number>();
  const [squadra, setSquadra] = useState<string>();
  const [idPartita, setIdPartita] = useState<number>();

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

  const handleClassifica = useCallback(
    (nomeTorneo: string, fase: string | null) => {
      if (torneiList.data) {
        setTorneo(
          torneiList.data.find(
            (c) => c.nome === nomeTorneo && c.gruppoFase === fase
          )
        );
      }
    },
    [torneiList.data]
  );

  useEffect(() => {
    if (torneiList.data && !torneiList.isFetching && torneiList.isSuccess) {
      handleClassifica("Campionato", null);
    }
  }, [
    torneiList.data,
    torneiList.isSuccess,
    torneiList.isFetching,
    handleClassifica,
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

  const handleChangeFrame = (newFrame: FrameType) => {
    setFrame(newFrame);
  };

  const handleChangeRosa = (
    newFrame: FrameType,
    newIdSquadra?: number,
    newSquadra?: string
  ) => {
    setIdSquadra(newIdSquadra);
    setSquadra(newSquadra);
    handleChangeFrame(newFrame);
  };

  const handleChangeStatistica = (
    newFrame: FrameType,
    newIdSquadra?: number
  ) => {
    setIdSquadra(newIdSquadra);
    handleChangeFrame(newFrame);
  };

  const handleChangeGiocatori = (newFrame: FrameType, idGiocatore?: number) => {
    setIdGiocatore(idGiocatore);
    handleChangeFrame(newFrame);
  };

  const handleChangePartita = (newFrame: FrameType, idPartita: number) => {
    setIdPartita(idPartita);
    setOpenModalCalendario(false);
    handleChangeFrame(newFrame);
  };

  const handleModalClose = () => {
    setOpenModalCalendario(false);
  };

  const handleOpenPDF = () => {
    window.open("/docs/Regolamento_erFantacalcio.pdf", "_blank");
  };

  return (
    <>
      <Grid container spacing={0}>
        {frame === FrameType.defaultHome && isXs && session?.user && (
          <>
            <Grid item xs={6}>
              <Typography variant="h5">
                Bentornato {session.user.presidente}
              </Typography>
            </Grid>
            <Grid item xs={6} display={"flex"} justifyContent={"flex-end"}>
              <Tooltip title="Schiera formazione" placement="top-start">
                <Link href={`/formazione?isXs=${isXs}`}>
                  <Ballot color="primary" />
                </Link>
              </Tooltip>
            </Grid>
          </>
        )}
        {frame === FrameType.defaultHome && isXs && !session?.user && (
          <>
            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
              <>
                <Tooltip title="Log out" placement="top-start">
                  <IconButton onClick={() => void signIn("erFantacalcio")}>
                    <Login color="primary" />
                  </IconButton>
                </Tooltip>
              </>
            </Grid>
          </>
        )}
        {frame === FrameType.defaultHome && !isXs && (
          <Slide direction={"down"} in={frame === FrameType.defaultHome}>
            <Grid item xs={12}>
              <Squadre onActionChange={handleChangeRosa} />
            </Grid>
          </Slide>
        )}
        {frame === FrameType.defaultHome && !torneiList.isLoading && (
          <>
            <Zoom in={frame === FrameType.defaultHome}>
              <Grid
                item
                xs={12}
                sm={6}
                sx={!isXs ? { pl: "2px", pr: "15px", pt: "15px" } : {}}
              >
                <Classifica
                  nomeTorneo={torneo?.nome ?? ""}
                  idTorneo={torneo?.idTorneo}
                  gruppo={torneo?.gruppoFase ?? ""}
                ></Classifica>
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
                    <Button
                      onClick={() => handleClassifica("Campionato", null)}
                      startIcon={<CalendarMonth />}
                      sx={isXs ? { fontSize: "10px" } : {}}
                    >
                      Campionato
                    </Button>
                    <Button
                      onClick={() => handleClassifica("Champions", "A")}
                      startIcon={<EmojiEvents />}
                      sx={isXs ? { fontSize: "10px" } : {}}
                    >
                      {isXs ? "Girone A" : "Champions Girone A"}
                    </Button>
                    <Button
                      onClick={() => handleClassifica("Champions", "B")}
                      startIcon={<EmojiEvents />}
                      sx={isXs ? { fontSize: "10px" } : {}}
                    >
                      {isXs ? "Girone B" : "Champions Girone B"}
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
            </Zoom>
            <Zoom in={frame === FrameType.defaultHome}>
              <Grid
                item
                xs={12}
                sm={6}
                sx={!isXs ? { pr: "2px", pl: "15px", pt: "15px" } : {}}
              >
                <Calendario
                  tipo={"risultati"}
                  prefixTitle="Ultimi risultati:"
                ></Calendario>
                <Calendario
                  tipo={"prossima"}
                  prefixTitle="Prossime partite:"
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
            </Zoom>
          </>
        )}
        {frame === FrameType.defaultHome && isXs && (
          <Zoom in={true}>
            <Grid item xs={12} sm={12}>
              <SquadreCarousel onActionChange={handleChangeRosa} />
            </Grid>
          </Zoom>
        )}
        {(frame === FrameType.defaultHome) &&
          !torneiList.isLoading && (
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
                        onClick={() => window.location.href='/statistiche_giocatori'}
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
                      onClick={() => window.location.href='/albo'}
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
                      onClick={() => window.location.href='/economia'}
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
                    !isXs ? { pr: "0px", pl: "0px", pt: "15px" } : { pl: "5px" }
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
                      onClick={() => window.location.href='/docs/Regolamento_erFantacalcio.pdf'}
                    />
                  </Card>
                </Grid>
              </Zoom>
              <Grid item xs={12} sx={{ height: "80px" }}>
                <></>
              </Grid>
            </>
          )}
        {frame === FrameType.rosa && idSquadra && squadra && (
          <Zoom in={true}>
            <Grid item xs={12} sm={12}>
              <Rosa
                onActionGoToStatistica={handleChangeStatistica}
                onActionChange={handleChangeRosa}
                onActionGoToGiocatore={handleChangeGiocatori}
                idSquadra={idSquadra}
                squadra={squadra}
              />
            </Grid>
          </Zoom>
        )}
        {frame === FrameType.statisticheSquadra && idSquadra && (
          <Zoom in={frame === FrameType.statisticheSquadra}>
            <Grid item xs={12} sm={12}>
              <StatisticaSquadra
                onActionGoToFormazione={handleChangeFrame}
                onActionGoToRosa={handleChangeRosa}
                onActionChangePartita={handleChangePartita}
                idSquadra={idSquadra}
              />
            </Grid>
          </Zoom>
        )}
      </Grid>

      <Modal
        title={titleModalCalendario}
        open={openModalCalendario}
        onClose={handleModalClose}
        width={isXs ? "98%" : "1266px"}
        height={isXs ? "98%" : ""}
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
                  md={4}
                  lg={3}
                  key={`card_partite_${index}_${g.idCalendario}`}
                  sx={{ ml: "0px" }}
                >
                  <CardPartite
                    giornata={[g]}
                    prefixTitle={""}
                    maxWidth={"300px"}
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
