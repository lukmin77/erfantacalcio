"use client";
import {
  AutoGraph,
  ExpandMore,
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Filter6,
  Home,
  HourglassTop,
  Save,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import React, { useEffect, useState } from "react";
import { type GiornataType, type Moduli } from "~/types/common";
import {
  convertiStringaInRuolo,
  moduliList,
  moduloDefault,
  ModuloPositions,
  ruoliList,
} from "~/utils/helper";
import {
  type GiocatoreFormazioneType,
  type GiocatoreType,
} from "~/types/squadre";
import Image from "next/image";
import Giocatori from "../giocatori/Giocatori";
import Modal from "../modal/Modal";
import dayjs from "dayjs";
import Link from "next/link";

function FormazioneXs() {
  const session = useSession();
  const idSquadra = parseInt(session.data?.user?.id ?? "0");
  //const squadra = session.data?.user?.squadra ?? '';
  const [idGiocatoreStat, setIdGiocatoreStat] = useState<number>();
  const [openModalCalendario, setOpenModalCalendario] = useState(false);

  const calendarioProssima = api.formazione.getGiornateDaGiocare.useQuery(
    undefined,
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
  const saveFormazione = api.formazione.create.useMutation({
    onSuccess: async () => {
      setAlertMessage("Salvataggio completato");
      setAlertSeverity("success");
    },
  });
  const [enableRosa, setEnableRosa] = useState(false);
  const [message, setMessage] = useState("");
  const [giornate, setGiornate] = useState<GiornataType[]>([]);
  const [idTorneo, setIdTorneo] = useState<number>();
  const formazioneList = api.formazione.get.useQuery(
    { idTorneo: idTorneo! },
    {
      enabled: !!idTorneo,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  const rosaList = api.squadre.getRosa.useQuery(
    { idSquadra: idSquadra, includeVenduti: false },
    {
      enabled: enableRosa,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  const [rosa, setRosa] = useState<GiocatoreFormazioneType[]>([]);
  const [campo, setCampo] = useState<GiocatoreFormazioneType[]>([]);
  const [panca, setPanca] = useState<GiocatoreFormazioneType[]>([]);
  const [idPartita, setIdPartita] = useState<number>();
  const [modulo, setModulo] = useState<Moduli>(moduloDefault);
  const [openAlert, setOpenAlert] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    if (calendarioProssima.data) {
      if (
        calendarioProssima.data.length > 0 &&
        checkDataFormazione(calendarioProssima.data[0]?.data)
      ) {
        setEnableRosa(true);
        setIdTorneo(calendarioProssima.data[0]?.idTorneo);
      } else setMessage("Formazione non rilasciabile");
      setGiornate(calendarioProssima.data);
    }
  }, [calendarioProssima.data]);

  useEffect(() => {
    if (rosaList.data) {
      const rosaConRuolo = rosaList.data.map((giocatore: GiocatoreType) => ({
        ...giocatore,
        titolare: false,
        riserva: null,
      }));

      setRosa(rosaConRuolo);
    }
  }, [rosaList.data, idTorneo]);

  useEffect(() => {
    if (formazioneList.data) {
      setIdPartita(formazioneList.data.idPartita);
      setModulo(formazioneList.data.modulo as Moduli);
      setCampo(formazioneList.data.giocatori.filter((c) => c.titolare));
      setRosa(
        sortPlayersByRoleDescThenCostoDesc(
          formazioneList.data.giocatori.filter(
            (c) => !c.titolare && c.riserva === null
          )
        )
      );
      setPanca(
        sortPlayersByRoleDescThenRiserva(
          formazioneList.data.giocatori.filter((c) => !c.titolare && c.riserva)
        )
      );
    }
  }, [
    formazioneList.isFetching,
    formazioneList.isSuccess,
    formazioneList.data,
  ]);

  const handleClickPlayer = async (playerClicked: GiocatoreFormazioneType) => {
    playerClicked.riserva = null;
    playerClicked.titolare = false;
    if (
      rosa.findIndex((c) => c.idGiocatore === playerClicked.idGiocatore) > -1 &&
      checkModulo(playerClicked.ruolo)
    ) {
      //va da rosa a campo
      playerClicked.titolare = true;
      await updateLists(playerClicked, campo, setCampo, rosa, setRosa, false);
    }
    if (
      rosa.findIndex((c) => c.idGiocatore === playerClicked.idGiocatore) > -1 &&
      !checkModulo(playerClicked.ruolo)
    ) {
      //va da rosa a panca
      playerClicked.riserva = 100;
      await updateLists(playerClicked, panca, setPanca, rosa, setRosa, true);
    }
    if (
      campo.findIndex((c) => c.idGiocatore === playerClicked.idGiocatore) > -1
    ) {
      //va da campo a rosa
      await updateLists(playerClicked, rosa, setRosa, campo, setCampo, true);
    }
    if (
      panca.findIndex((c) => c.idGiocatore === playerClicked.idGiocatore) > -1
    ) {
      //va da panca a rosa
      await updateLists(
        playerClicked,
        rosa,
        setRosa,
        panca,
        setPanca,
        false,
        true
      );
    }
  };

  const sortPlayersByRoleDescThenCostoDesc = (
    players: GiocatoreFormazioneType[]
  ) => {
    return players.sort((a, b) => {
      if (b.ruolo !== a.ruolo) {
        return b.ruolo.localeCompare(a.ruolo);
      } else if (b.costo !== a.costo) {
        return b.costo - a.costo;
      } else {
        return a.nome.localeCompare(b.nome);
      }
    });
  };

  const sortPlayersByRoleDescThenRiserva = (
    players: GiocatoreFormazioneType[]
  ) => {
    const playersSorted: GiocatoreFormazioneType[] = [];
    const ruoliUnici = [...new Set(players.map((player) => player.ruolo))];

    ruoliUnici.forEach((ruolo) => {
      const playersForRuolo = players.filter(
        (player) => player.ruolo === ruolo
      );
      const playersSortedForRuolo = playersForRuolo.sort((a, b) => {
        if (a.riserva === null && b.riserva === null) {
          return 0;
        } else if (a.riserva === null) {
          return -1;
        } else if (b.riserva === null) {
          return 1;
        }
        return a.riserva - b.riserva;
      });

      playersSortedForRuolo.forEach((player, index) => {
        if (player.riserva !== null) {
          player.riserva = index + 1;
        }
        playersSorted.push(player);
      });
    });

    return playersSorted;
  };

  const updateLists = async (
    playerSelected: GiocatoreFormazioneType,
    targetArray: GiocatoreFormazioneType[],
    setTargetArray: (value: GiocatoreFormazioneType[]) => void,
    sourceArray: GiocatoreFormazioneType[],
    setSourceArray: (value: GiocatoreFormazioneType[]) => void,
    orderTargetList = true,
    orderSourceList = false
  ) => {
    if (
      playerSelected &&
      !targetArray.find((c) => c.idGiocatore === playerSelected.idGiocatore)
    ) {
      const updatedSourceArray = sourceArray.filter(
        (player) => player.idGiocatore !== playerSelected.idGiocatore
      );
      setSourceArray(updatedSourceArray);
      const updatedTargetArray = [...targetArray, playerSelected];
      orderSourceList
        ? sortPlayersByRoleDescThenRiserva(updatedSourceArray)
        : setSourceArray(updatedSourceArray);
      orderTargetList
        ? setTargetArray(sortPlayersByRoleDescThenRiserva(updatedTargetArray))
        : setTargetArray(updatedTargetArray);
    }
  };

  const renderRosa = (roles: string[], title: string) => {
    const filteredRosa = rosa.filter((player) => roles.includes(player.ruolo));
    if (filteredRosa.length > 0) {
      const handleStatGiocatore = (idGiocatore: number) => {
        setIdGiocatoreStat(idGiocatore);
        setOpenModalCalendario(true);
      };

      return (
        <Grid item xs={12}>
          <Box>
            <Typography variant="h5">{title}</Typography>
            <List sx={{ bgcolor: "background.paper" }}>
              {filteredRosa.map((player) => (
                <Grid container spacing={0} key={player.idGiocatore}>
                  <Grid item xs={9}>
                    <div onClick={() => handleClickPlayer(player)}>
                      <ListItem
                        sx={{
                          cursor: "pointer",
                          zIndex: 2,
                          paddingTop: "0px",
                          paddingBottom: "0px",
                          paddingLeft: "0px",
                        }}
                      >
                        <Image
                          src={player.urlCampioncinoSmall}
                          width={42}
                          height={42}
                          alt={player.nome}
                        />
                        <ListItemText
                          primary={player.nome}
                          secondary={`${
                            player.ruoloEsteso
                          } (${player.nomeSquadraSerieA
                            ?.toUpperCase()
                            .substring(0, 3)})`}
                        ></ListItemText>
                      </ListItem>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    display={"flex"}
                    justifyContent={"flex-end"}
                  >
                    <Tooltip title={"Statistiche giocatore"}>
                      <IconButton
                        onClick={() => handleStatGiocatore(player.idGiocatore)}
                      >
                        <AutoGraph color="success" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              ))}
            </List>
          </Box>
        </Grid>
      );
    } else {
      return <></>;
    }
  };

  const renderPanca = (roles: string[]) => {
    const filteredPanca = panca.filter((player) =>
      roles.includes(player.ruolo)
    );
    return (
      <Grid item xs={12}>
        <Box>
          <List sx={{ bgcolor: "background.paper" }}>
            {filteredPanca.map((player) => (
              <div
                key={player.idGiocatore}
                onClick={() => handleClickPlayer(player)}
              >
                <ListItem
                  sx={{
                    cursor: "pointer",
                    zIndex: 2,
                    paddingTop: "0px",
                    paddingBottom: "0px",
                  }}
                >
                  <Image
                    src={player.urlCampioncinoSmall}
                    width={42}
                    height={42}
                    alt={player.nome}
                  />
                  <ListItemText
                    primary={player.nome}
                    secondary={`${
                      player.ruoloEsteso
                    } (${player.nomeSquadraSerieA
                      ?.toUpperCase()
                      .substring(0, 3)})`}
                  ></ListItemText>
                  {player.riserva === 1 ? (
                    <Filter1 color="success"></Filter1>
                  ) : player.riserva === 2 ? (
                    <Filter2 color="warning"></Filter2>
                  ) : player.riserva === 3 ? (
                    <Filter3 color="error"></Filter3>
                  ) : player.riserva === 4 ? (
                    <Filter4 color="secondary"></Filter4>
                  ) : player.riserva === 5 ? (
                    <Filter5 color="info"></Filter5>
                  ) : player.riserva === 6 ? (
                    <Filter6 color="primary"></Filter6>
                  ) : (
                    <></>
                  )}
                </ListItem>
              </div>
            ))}
          </List>
        </Box>
      </Grid>
    );
  };

  const renderCampo = (roles: string[]) => {
    const filtered = campo.filter((player) => roles.includes(player.ruolo));
    return (
      <>
        {filtered.map((player, index) => {
          const style = getPlayerStylePosition(player.ruolo, index);
          return (
            <div
              key={player.idGiocatore}
              onClick={() => handleClickPlayer(player)}
              style={{
                cursor: "pointer",
                zIndex: 2,
                minWidth: "120px",
                position: "absolute",
                ...style,
              }}
            >
              <Stack
                direction={"column"}
                justifyContent="space-between"
                alignItems="center"
              >
                <Image
                  src={player.urlCampioncinoSmall}
                  key={player.idGiocatore}
                  width={48}
                  height={48}
                  alt={player.nome}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    backgroundColor: "#2e865f",
                    opacity: 0.8,
                    padding: "2px",
                  }}
                >
                  {player.nome}
                </Typography>
              </Stack>
            </div>
          );
        })}
      </>
    );
  };

  const handleSetModulo = (event: SelectChangeEvent) => {
    correctFormazione(event.target.value as Moduli);
    setModulo(event.target.value as Moduli);
  };

  function getPlayerStylePosition(ruolo: string, index: number) {
    return ModuloPositions[modulo][convertiStringaInRuolo(ruolo) ?? "P"][index];
  }

  function checkModulo(ruolo: string) {
    const moduloSplitted = modulo.split("-");
    const maxRuolo =
      ruolo === "P"
        ? 1
        : ruolo === "D"
        ? parseInt(moduloSplitted[0] ?? "3")
        : ruolo === "C"
        ? parseInt(moduloSplitted[1] ?? "4")
        : parseInt(moduloSplitted[2] ?? "3");
    return campo.filter((c) => c.ruolo === ruolo).length < maxRuolo;
  }

  function correctFormazione(modulo: Moduli) {
    const moduloSplitted = modulo.split("-");
    moduloSplitted.map((c, index) => {
      const numRuolo = parseInt(c ?? "0");
      const giocatori = campo
        .filter((g) => g.ruolo === ruoliList[index + 1])
        .slice(numRuolo);
      giocatori.forEach((playerToRemove) => {
        rosa.push(playerToRemove);
        const playerIndex = campo.findIndex(
          (g) => g.idGiocatore === playerToRemove.idGiocatore
        );
        if (playerIndex !== -1) {
          campo.splice(playerIndex, 1);
        }
      });
    });
  }

  function checkDataFormazione(dataIso: string | undefined) {
    return dayjs(dataIso).toDate() >= dayjs(new Date()).toDate();
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rosa.length > 0 || campo.length !== 11) {
      setAlertMessage("Completa la formazione");
      setAlertSeverity("error");
    } else if (!idPartita) {
      setAlertMessage("Nessuna partita in programma, impossibile procedere");
      setAlertSeverity("error");
    } else {
      setSaving(true);
      await saveFormazione.mutateAsync({
        idPartita: idPartita,
        modulo: modulo,
        giocatori: [...campo, ...panca].map((giocatore) => ({
          idGiocatore: giocatore.idGiocatore,
          titolare: giocatore.titolare,
          riserva: giocatore.riserva,
        })),
      });
      setSaving(false);
    }
    setOpenAlert(true);
  };

  const handleModalClose = () => {
    setOpenModalCalendario(false);
  };

  return (
    <>
      <Grid container spacing={0}>
        {((rosaList.isLoading && enableRosa) ||
          calendarioProssima.isLoading) && (
          <Grid item xs={12}>
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
          </Grid>
        )}
        {enableRosa ? (
          <>
            <Grid item xs={12}>
              <Stack direction={"row"}>
                {giornate.length > 1 ? (
                  <Select
                    size="small"
                    variant="outlined"
                    labelId="select-label-giornata"
                    margin="dense"
                    required
                    sx={{
                      m: "2px",
                      backgroundColor: "#2e865f",
                      color: "white",
                      opacity: 0.8,
                      fontSize: "11px",
                    }}
                    name="giornata"
                    onChange={(e) => setIdTorneo(e.target.value as number)}
                    defaultValue={giornate[0]?.idTorneo}
                  >
                    {giornate.map((g, index) => (
                      <MenuItem
                        value={g.idTorneo}
                        key={`giornata_${g.idTorneo}`}
                        selected={index === 0}
                      >{`${g.Title}`}</MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Typography
                    variant={"body2"}
                    sx={{ lineHeight: 2.66, marginRight: "3px" }}
                  >
                    <b>{giornate[0]?.Title}</b>
                  </Typography>
                )}
                <Select
                  size="small"
                  variant="outlined"
                  labelId="select-label-modulo"
                  margin="dense"
                  required
                  sx={{
                    m: "4px",
                    backgroundColor: "#2e865f",
                    color: "white",
                    opacity: 0.8,
                    fontSize: "11px",
                  }}
                  name="modulo"
                  onChange={handleSetModulo}
                  value={modulo}
                >
                  {moduliList.map((moduloOption) => (
                    <MenuItem
                      value={moduloOption}
                      key={`modulo_${moduloOption}`}
                    >{`Modulo ${moduloOption}`}</MenuItem>
                  ))}
                </Select>
                <Box component="form" onSubmit={handleSave} noValidate>
                  <Button
                    type="submit"
                    disabled={saving}
                    endIcon={!saving ? <Save /> : <HourglassTop />}
                    variant="contained"
                    color="error"
                    size="medium"
                    sx={{ m:"4px", ml: "5px", fontSize: "11px", opacity: 0.8 }}
                  >
                    {saving ? "Attendere..." : "Salva"}
                  </Button>
                </Box>
                <Link href={"/"} passHref>
                  <Home color="primary" fontSize="large" />
                </Link>
              </Stack>
            </Grid>
            {giornate.length > 1 && (
              <Grid item xs={12} sx={{ justifyContent: 'flex-start'}}>
                <Typography variant={"h5"} color="error">Attenzione!!! partita di campionato e di coppa!!!</Typography>
              </Grid>
            )}
            <Grid item sm={8} xs={12}>
              <>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h5">Rosa ({rosa.length})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={0}>
                      {renderRosa(["P", "D"], "Portieri/Difensori")}
                      {renderRosa(["C"], "Centrocampisti")}
                      {renderRosa(["A"], "Attaccanti")}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h5">
                      In panchina ({panca.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={0}>
                      {renderPanca(["P", "D", "C", "A"])}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h5">
                    In campo ({campo.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      borderStyle: "none",
                      borderWidth: "0px",
                      position: "relative",
                      width: "100%", //410px
                      aspectRatio: "360 / 509",
                      //height: '490px',
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover", //100%
                      backgroundImage: "url('images/campo.jpg')",
                    }}
                  >
                    {renderCampo(["P"])}
                    {renderCampo(["D"])}
                    {renderCampo(["C"])}
                    {renderCampo(["A"])}
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{ height: "60%" }}
                open={openAlert}
                autoHideDuration={3000}
                onClose={() => setOpenAlert(false)}
              >
                <Alert
                  onClose={() => setOpenAlert(false)}
                  severity={alertSeverity}
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  {alertMessage}
                </Alert>
              </Snackbar>
            </Grid>
          </>
        ) : (
          <Typography variant="h3" color="error">
            {message}
          </Typography>
        )}
      </Grid>

      <Modal
        title={"Statistica giocatore"}
        open={openModalCalendario}
        onClose={handleModalClose}
        width={"98%"}
        height={"98%"}
      >
        <Divider />
        <Box sx={{ mt: 1, gap: "0px", flexWrap: "wrap" }}>
          <Giocatori
            idGiocatore={idGiocatoreStat}
            onActionChange={() => {
              if (false) {
              }
            }}
            removeNav={true}
          ></Giocatori>
        </Box>
      </Modal>
    </>
  );
}

export default FormazioneXs;
