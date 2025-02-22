"use client";
import {
  AutoGraph,
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
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Tooltip,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import React, { useEffect, useRef, useState } from "react";
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
import Draggable from "react-draggable";
import Image from "next/image";
import Giocatori from "../giocatori/Giocatori";
import Modal from "../modal/Modal";
import dayjs from "dayjs";
import Link from "next/link";

function Formazione() {
  const session = useSession();
  const idSquadra = parseInt(session.data?.user?.id ?? "0");
  const squadra = session.data?.user?.squadra ?? "";
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
  const nodeRef = useRef(null);
  const [rosa, setRosa] = useState<GiocatoreFormazioneType[]>([]);
  const [campo, setCampo] = useState<GiocatoreFormazioneType[]>([]);
  const [panca, setPanca] = useState<GiocatoreFormazioneType[]>([]);
  const [draggedItem, setDraggedItem] =
    useState<GiocatoreFormazioneType | null>(null);
  const [idPartita, setIdPartita] = useState<number>();
  const [modulo, setModulo] = useState<Moduli>(moduloDefault);
  const [openAlert, setOpenAlert] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const [styleCampo, setStyleCampo] = useState({
    borderStyle: "none",
    borderWidth: "0px",
    borderColor: "#E4221F",
    position: "relative",
    width: "95%", //410px
    aspectRatio: "360 / 509",
    //height: '509px',
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover", //100%
    backgroundImage: "url('images/campo.jpg')",
  });
  const [styleRosa, setStyleRosa] = useState({
    borderStyle: "none",
    borderWidth: "0px",
    borderColor: "#E4221F",
  });
  const [stylePanca, setStylePanca] = useState({
    borderStyle: "none",
    borderWidth: "0px",
    borderColor: "#E4221F",
  });

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

  const handleDragStart = async (player: GiocatoreFormazioneType) => {
    if (
      rosa.findIndex((c) => c.idGiocatore === player.idGiocatore) > -1 &&
      checkModulo(player.ruolo)
    ) {
      //va da rosa a campo
      setStyleCampo((prevStyle) => ({
        ...prevStyle,
        borderWidth: "3px",
        borderStyle: "dashed",
      }));
    }
    if (
      rosa.findIndex((c) => c.idGiocatore === player.idGiocatore) > -1 &&
      !checkModulo(player.ruolo)
    ) {
      //va da rosa a panca
      setStylePanca((prevStyle) => ({
        ...prevStyle,
        borderWidth: "3px",
        borderStyle: "dashed",
      }));
    }
    if (campo.findIndex((c) => c.idGiocatore === player.idGiocatore) > -1) {
      //va da campo a rosa
      setStyleRosa((prevStyle) => ({
        ...prevStyle,
        borderWidth: "3px",
        borderStyle: "dashed",
      }));
    }
    if (panca.findIndex((c) => c.idGiocatore === player.idGiocatore) > -1) {
      //va da panca a rosa
      setStyleRosa((prevStyle) => ({
        ...prevStyle,
        borderWidth: "3px",
        borderStyle: "dashed",
      }));
    }

    setDraggedItem(player);
  };

  const handleDrop = async () => {
    resetBorderArea();

    if (draggedItem) {
      draggedItem.riserva = null;
      draggedItem.titolare = false;
      if (
        rosa.findIndex((c) => c.idGiocatore === draggedItem.idGiocatore) > -1 &&
        checkModulo(draggedItem.ruolo)
      ) {
        //va da rosa a campo
        draggedItem.titolare = true;
        await updateLists(draggedItem, campo, setCampo, rosa, setRosa, false);
      }
      if (
        rosa.findIndex((c) => c.idGiocatore === draggedItem.idGiocatore) > -1 &&
        !checkModulo(draggedItem.ruolo)
      ) {
        //va da rosa a panca
        draggedItem.riserva = 100;
        await updateLists(draggedItem, panca, setPanca, rosa, setRosa, true);
      }
      if (
        campo.findIndex((c) => c.idGiocatore === draggedItem.idGiocatore) > -1
      ) {
        //va da campo a rosa
        await updateLists(draggedItem, rosa, setRosa, campo, setCampo, true);
      }
      if (
        panca.findIndex((c) => c.idGiocatore === draggedItem.idGiocatore) > -1
      ) {
        //va da panca a rosa
        await updateLists(
          draggedItem,
          rosa,
          setRosa,
          panca,
          setPanca,
          false,
          true
        );
      }
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

  const renderRosa = (roles: string[], columns: number, title: string) => {
    const filteredRosa = rosa.filter((player) => roles.includes(player.ruolo));

    const handleStatGiocatore = (idGiocatore: number) => {
      setIdGiocatoreStat(idGiocatore);
      // setOpenModalCalendario(true);
    };

    return (
      <Grid
        item
        sm={columns}
        xs={12}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Box>
          <Typography variant="h5">{title}</Typography>
          <List sx={{ bgcolor: "background.paper" }}>
            {filteredRosa.map((player) => (
              <Grid container spacing={0} key={player.idGiocatore}>
                <Grid item xs={11}>
                  <Draggable key={player.idGiocatore} nodeRef={nodeRef}>
                    <div
                      onDragStart={() => handleDragStart(player)}
                      onClick={() => handleClickPlayer(player)}
                      draggable
                      ref={nodeRef}
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
                          secondary={`${player.nomeSquadraSerieA}`}
                        ></ListItemText>
                      </ListItem>
                    </div>
                  </Draggable>
                </Grid>
                <Grid item xs={1} display={"flex"} justifyContent={"flex-end"}>
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
  };

  const renderPanca = (roles: string[], columns: number) => {
    const filteredPanca = panca.filter((player) =>
      roles.includes(player.ruolo)
    );
    return (
      <Grid
        item
        sm={columns}
        xs={12}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Box>
          <List sx={{ bgcolor: "background.paper" }}>
            {filteredPanca.map((player) => (
              <Draggable key={player.idGiocatore} nodeRef={nodeRef}>
                <div
                  onDragStart={() => handleDragStart(player)}
                  onClick={() => handleClickPlayer(player)}
                  draggable
                  ref={nodeRef}
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
              </Draggable>
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
            <Draggable key={player.idGiocatore} nodeRef={nodeRef}>
              <div
                onDragStart={() => handleDragStart(player)}
                onClick={() => handleClickPlayer(player)}
                draggable
                ref={nodeRef}
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
            </Draggable>
          );
        })}
      </>
    );
  };

  const handleSetModulo = (event: SelectChangeEvent) => {
    correctFormazione(event.target.value as Moduli);
    setModulo(event.target.value as Moduli);
  };

  function resetBorderArea() {
    setStyleRosa((prevStyle) => ({ ...prevStyle, borderWidth: "0px" }));
    setStyleCampo((prevStyle) => ({ ...prevStyle, borderWidth: "0px" }));
    setStylePanca((prevStyle) => ({ ...prevStyle, borderWidth: "0px" }));
  }

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
            <Grid item xs={6}>
              <Stack
                direction={"row"}
                justifyContent="flex-start"
                alignItems={"center"}
                sx={{ pb: "5px" }}
              >
                <Typography variant={"h3"}>
                  Formazione {squadra}{" "}
                  {giornate.length === 1 && ` - ${giornate[0]?.Title}`}
                </Typography>
                {giornate.length > 1 && (
                  <Select
                    size="small"
                    variant="outlined"
                    labelId="select-label-giornata"
                    margin="dense"
                    required
                    sx={{ ml: "10px" }}
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
                )}
                <Box component="form" onSubmit={handleSave} noValidate>
                  <Button
                    type="submit"
                    disabled={saving}
                    endIcon={!saving ? <Save /> : <HourglassTop />}
                    variant="contained"
                    color="error"
                    size="medium"
                    sx={{ ml: "5px" }}
                  >
                    {saving ? "Attendere..." : "Salva"}
                  </Button>
                </Box>
              </Stack>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Tooltip title="Home" placement="top-start">
                <Link href={"/"} passHref>
                  <Home color="primary" fontSize="large" />
                </Link>
              </Tooltip>
            </Grid>
            {giornate.length > 1 && (
              <Grid item xs={12} sx={{ justifyContent: 'flex-start'}}>
                <Typography variant={"h5"} color="error">Attenzione!!! partita di campionato e di coppa!!!</Typography>
              </Grid>
            )}
            <Grid item sm={8} xs={12}>
              <>
                <Grid container spacing={0} sx={styleRosa}>
                  {renderRosa(["P"], 3, "Portieri")}
                  {renderRosa(["D"], 3, "Difensori")}
                  {renderRosa(["C"], 3, "Centrocampisti")}
                  {renderRosa(["A"], 3, "Attaccanti")}
                </Grid>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <Typography variant="h5">In panchina</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={0} sx={stylePanca}>
                  {renderPanca(["P", "D"], 4)}
                  {renderPanca(["C"], 4)}
                  {renderPanca(["A"], 4)}
                </Grid>
              </>
            </Grid>
            <Grid
              item
              sm={4}
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Box
                sx={styleCampo}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Grid item xs={12}>
                  <Select
                    size="small"
                    variant="outlined"
                    labelId="select-label-modulo"
                    margin="dense"
                    required
                    sx={{
                      m: "2px",
                      backgroundColor: "#2e865f",
                      color: "white",
                      opacity: 0.8,
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
                </Grid>
                {renderCampo(["P"])}
                {renderCampo(["D"])}
                {renderCampo(["C"])}
                {renderCampo(["A"])}
              </Box>
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
          <Grid
            item
            xs={12}
            display={"flex"}
            justifyContent={"center"}
            sx={{ mt: "30px" }}
          >
            <Typography variant="h3" color="error">
              {message}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Modal
        title={"Statistica giocatore"}
        open={openModalCalendario}
        onClose={handleModalClose}
        width={"1266px"}
      >
        <Divider />
        <Box sx={{ mt: 1, gap: "0px", flexWrap: "wrap" }}>
          {/* <Giocatori
            idGiocatore={idGiocatoreStat}
            onActionChange={() => {
              if (false) {
              }
            }}
            removeNav={true}
          ></Giocatori> */}
        </Box>
      </Modal>
    </>
  );
}

export default Formazione;
