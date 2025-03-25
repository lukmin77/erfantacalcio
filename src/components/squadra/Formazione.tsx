"use client";
import {
  Analytics,
  HourglassTop,
  Looks3Outlined,
  Looks4Outlined,
  Looks5Outlined,
  Looks6Outlined,
  LooksOneOutlined,
  LooksTwoOutlined,
  ResetTv,
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
  Divider,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import React, { useEffect, useRef, useState } from "react";
import { type GiornataType, type Moduli } from "~/types/common";
import {
  convertiStringaInRuolo,
  getShortName,
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
import Modal from "../modal/Modal";
import dayjs from "dayjs";
import Giocatore from "../giocatori/Giocatore";

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
  const [idPartita, setIdPartita] = useState<number>();
  const [modulo, setModulo] = useState<Moduli>(moduloDefault);
  const [openAlert, setOpenAlert] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const styleCampo = {
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
  };
  const styleRosa = {
    borderStyle: "none",
    borderWidth: "0px",
    borderColor: "#E4221F",
  };

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

  const allowedFormations: number[] = [1343, 1352, 1451, 1442, 1433, 1541, 1532];
  
  const handleClickPlayer = async (playerClicked: GiocatoreFormazioneType) => {
    playerClicked.riserva = null;
    playerClicked.titolare = false;
  
    const canAdd = canAddPlayer(playerClicked.ruolo);
  
    if (rosa.some((c) => c.idGiocatore === playerClicked.idGiocatore) && canAdd) {
      // Va da rosa a campo
      playerClicked.titolare = true;
      await updateLists(playerClicked, campo, setCampo, rosa, setRosa, false);
    } else if (rosa.some((c) => c.idGiocatore === playerClicked.idGiocatore)) {
      // Va da rosa a panca
      playerClicked.riserva = 100;
      await updateLists(playerClicked, panca, setPanca, rosa, setRosa, true);
    } else if (campo.some((c) => c.idGiocatore === playerClicked.idGiocatore)) {
      // Va da campo a rosa
      await updateLists(playerClicked, rosa, setRosa, campo, setCampo, true);
    } else if (panca.some((c) => c.idGiocatore === playerClicked.idGiocatore)) {
      // Va da panca a rosa
      await updateLists(playerClicked, rosa, setRosa, panca, setPanca, false, true);
    }
  };
  
  function canAddPlayer(ruoloGiocatore: string): boolean {
    const newState = calcolaCodiceFormazione(ruoloGiocatore);
    const newStateStr = newState.toString().padStart(4, "0");
  
    const isValid = allowedFormations.some((formation) => {
      const formationStr = formation.toString().padStart(4, "0");
  
      for (let i = 0; i < 4; i++) {
        const currentRoleCount = parseInt(newStateStr.charAt(i), 10);
        const maxRoleCount = parseInt(formationStr.charAt(i), 10);
  
        if (currentRoleCount > maxRoleCount) {
          return false;
        }
      }
      return true;
    });
  
    if (isValid) {
      const moduloFormatted = formatModulo(newStateStr);
      console.log("Nuovo stato modulo:", moduloFormatted);
  
      setModulo(moduloFormatted as Moduli);
    }
  
    return isValid;
  }

  function formatModulo(moduloStr: string): string {
    return moduloStr
      .substring(1)
      .split("")
      .map((num) => parseInt(num, 10)) // Rimuove gli 0 iniziali
      .join("-");
  }
  
  
  

  function calcolaCodiceFormazione(ruoloGiocatore?: string): number {
    const ruoli = ["P", "D", "C", "A"];
    const conteggio = ruoli.map((ruolo) => {
      const count = campo.filter((giocatore) => giocatore.ruolo === ruolo).length;
      return count + (ruolo === ruoloGiocatore ? 1 : 0);
    });
  
    return Number(conteggio.join(""));
  }
  

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
    const filteredPanca = panca.filter((player) =>
      roles.includes(player.ruolo)
    );

    const handleStatGiocatore = (idGiocatore: number) => {
      setIdGiocatoreStat(idGiocatore);
      setOpenModalCalendario(true);
    };

    return (
      <Grid item sm={columns} xs={12}>
        <Box>
          <Typography variant="h5">{title}</Typography>
          <List sx={{ bgcolor: "background.paper" }}>
            {filteredRosa.map((player) => (
              <Grid container spacing={0} key={player.idGiocatore}>
                <Grid item xs={10}>
                  <div onClick={() => handleClickPlayer(player)} ref={nodeRef}>
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
                        primary={getShortName(player.nome)}
                        secondary={`${player.nomeSquadraSerieA}`}
                      ></ListItemText>
                    </ListItem>
                  </div>
                </Grid>
                <Grid item xs={2} display={"flex"} justifyContent={"flex-end"}>
                  <Tooltip title={"Statistiche giocatore"}>
                    <IconButton
                      onClick={() => handleStatGiocatore(player.idGiocatore)}
                    >
                      <Analytics color="info" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            ))}
            {filteredPanca.map((player) => (
              <Grid container spacing={0} key={player.idGiocatore}>
                <Grid item xs={10}>
                  <div onClick={() => handleClickPlayer(player)} ref={nodeRef}>
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
                        primary={getShortName(player.nome)}
                        secondary={`${player.nomeSquadraSerieA}`}
                      ></ListItemText>
                    </ListItem>
                  </div>
                </Grid>
                <Grid item xs={2} display={"flex"} justifyContent={"flex-end"}>
                  <Tooltip title={`Riserva ${player.riserva}`}>
                    <IconButton>
                      {filterIcons[(player.riserva ?? 0) - 1]}
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

  const filterIcons = [
    <LooksOneOutlined key={0} color="error" />,
    <LooksTwoOutlined key={1} color="error" />,
    <Looks3Outlined key={2} color="error" />,
    <Looks4Outlined key={3} color="error" />,
    <Looks5Outlined key={4} color="error" />,
    <Looks6Outlined key={5} color="error" />,
  ];

  const renderCampo = (roles: string[]) => {
    const filtered = campo.filter((player) => roles.includes(player.ruolo));
    return (
      <>
        {filtered.map((player, index) => {
          const style = getPlayerStylePosition(player.ruolo, index);
          return (
            <div
              onClick={() => handleClickPlayer(player)}
              ref={nodeRef}
              key={player.idGiocatore}
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
    const moduloCompatibile = findModuloCompatibile(modulo);
    return ModuloPositions[moduloCompatibile][
      convertiStringaInRuolo(ruolo) ?? "P"
    ][index];
  }

  function findModuloCompatibile(modulo: string): Moduli {
    const [D, C, A] = modulo.split("-").map(Number);

    return (
      moduliList.find((m) => {
        const [modD, modC, modA] = m.split("-").map(Number);
        return D! <= modD! && C! <= modC! && A! <= modA!;
      }) ?? "3-4-3"
    );
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
    } else if (!idPartita && idPartita !== 0) {
      setAlertMessage("Nessuna partita in programma, impossibile procedere");
      setAlertSeverity("error");
    } else {
      setSaving(true);
      if (idPartita !== 0) {
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
      } else {
        await Promise.all(
          giornate.map(async (g) => {
            await saveFormazione.mutateAsync({
              idPartita: g.partite
                .filter((c) => c.idHome === idSquadra || c.idAway === idSquadra)
                .map((p) => p.idPartita)[0]!,
              modulo: modulo,
              giocatori: [...campo, ...panca].map((giocatore) => ({
                idGiocatore: giocatore.idGiocatore,
                titolare: giocatore.titolare,
                riserva: giocatore.riserva,
              })),
            });
          })
        );
        setSaving(false);
      }
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
              <Typography variant={"h3"}>
                Formazione {squadra}{" "}
                {giornate.length === 1 && ` - ${giornate[0]?.Title}`}
              </Typography>
            </Grid>
            <Grid item xs={6} justifyItems={"end"}>
              <Stack
                direction={"row"}
                justifyContent="flex-end"
                alignItems={"center"}
                sx={{ pb: "5px" }}
              >
                {giornate.length > 1 && (
                  <Select
                    size="small"
                    variant="outlined"
                    labelId="select-label-giornata"
                    margin="dense"
                    required
                    sx={{ ml: "10px" }}
                    name="giornata"
                    onChange={(e) =>
                      e.target.value !== 0
                        ? setIdTorneo(e.target.value as number)
                        : setIdPartita(0)
                    }
                    defaultValue={giornate[0]?.idTorneo}
                  >
                    <MenuItem value={0} key={`giornata_0`}>
                      Salva entrambe le formazioni
                    </MenuItem>
                    {giornate.map((g, index) => (
                      <MenuItem
                        value={g.idTorneo}
                        key={`giornata_${g.idTorneo}`}
                        selected={index === 0}
                      >{`${g.Title}`}</MenuItem>
                    ))}
                  </Select>
                )}
                <Button
                  type="button"
                  endIcon={<ResetTv />}
                  variant="contained"
                  onClick={() => {
                    setModulo(moduloDefault);
                    setCampo([]);
                    setPanca([]);
                    setRosa(
                      sortPlayersByRoleDescThenCostoDesc(
                        rosa.concat(campo, panca)
                      )
                    );
                  }}
                  color="info"
                  size="medium"
                  sx={{ ml: "5px" }}
                >
                  Reset
                </Button>
                <Box component="form" onSubmit={handleSave} noValidate>
                  <Button
                    type="submit"
                    disabled={saving}
                    endIcon={!saving ? <Save /> : <HourglassTop />}
                    variant="contained"
                    color="success"
                    size="medium"
                    sx={{ ml: "5px" }}
                  >
                    {saving ? "Attendere..." : "Salva"}
                  </Button>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} minHeight={5}></Grid>
            <Grid item sm={4}>
              <>
                <Grid container spacing={0} sx={styleRosa} padding={1}>
                  {renderRosa(["P"], 6, "Portieri")}
                  {renderRosa(["D"], 6, "Difensori")}
                </Grid>
              </>
            </Grid>
            <Grid
              item
              sm={4}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Box sx={styleCampo}>
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
            <Grid item sm={4}>
              <>
                <Grid container spacing={0} sx={styleRosa} padding={1}>
                  {renderRosa(["C"], 6, "Centrocampisti")}
                  {renderRosa(["A"], 6, "Attaccanti")}
                </Grid>
              </>
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
          {idGiocatoreStat !== undefined && (
            <Giocatore idGiocatore={idGiocatoreStat} />
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Formazione;
