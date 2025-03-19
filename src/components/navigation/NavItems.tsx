import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  AddAPhoto,
  Badge,
  Ballot,
  Calculate,
  CalendarMonth,
  Euro,
  FiberNew,
  Grading,
  Group,
  HistoryEdu,
  ManageAccounts,
  ThumbsUpDown,
  UploadFile,
} from "@mui/icons-material";

const listItem = (
  key: string,
  link: string,
  title: string,
  icon: React.JSX.Element
) => {
  return (
    <ListItemButton key={key} href={link} sx={{ p: 1 }}>
      <ListItemIcon sx={{ mr: 2 }}>{icon}</ListItemIcon>
      <ListItemText secondary={title} />
    </ListItemButton>
  );
};

export function adminListItems() {
  return [
    listItem(
      "admin_upload",
      "/uploadVoti",
      "Carica voti",
      <UploadFile color="primary" />
    ),
    listItem(
      "admin_risultati",
      "/risultati",
      "Risultati",
      <Calculate color="primary" />
    ),
    listItem(
      "admin_calendario",
      "/calendario",
      "Calendario",
      <CalendarMonth color="primary" />
    ),
    listItem(
      "admin_presidenti",
      "/presidenti",
      "Squadre",
      <Group color="primary" />
    ),
    listItem(
      "admin_giocatori",
      "/giocatori",
      "Giocatori",
      <ManageAccounts color="primary" />
    ),
    listItem("admin_voti", "/voti", "Voti", <ThumbsUpDown color="primary" />),
    listItem(
      "admin_nuova_stagione",
      "/avvioStagione",
      "Nuova stagione",
      <FiberNew color="primary" />
    ),
  ];
}

export function guestListItems(isXs: boolean, isAuthenticated: boolean) {
  return [
    ...(isAuthenticated
      ? [
          listItem(
            "guest_profilo",
            `/formazione?isXs=${isXs}`,
            "Inserisci formazione",
            <Ballot color="primary" />
          ),
          listItem(
            "guest_profilo",
            "/foto",
            "Foto profilo",
            <AddAPhoto color="primary" />
          ),
        ]
      : []),
    listItem(
      "guest_profilo",
      "/statistiche_giocatori",
      "Statistiche giocatori",
      <Badge color="primary" />
    ),
    listItem(
      "guest_profilo",
      "/economia",
      "Economia e premi",
      <Euro color="primary" />
    ),
    listItem(
      "guest_profilo",
      "/albo",
      "Albo d'oro",
      <HistoryEdu color="primary" />
    ),
    listItem(
      "guest_profilo",
      "/docs/Regolamento_erFantacalcio.pdf",
      "Regolamento ufficiale",
      <Grading color="primary" />
    ),
  ];
}
