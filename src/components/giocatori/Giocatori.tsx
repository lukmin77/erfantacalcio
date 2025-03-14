/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import {
  Box,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useTheme } from "@mui/material/styles";
import AutocompleteTextbox, {
  type iElements,
} from "~/components/autocomplete/AutocompleteGiocatore";
import Image from "next/image";
import { type Ruoli } from "~/types/common";
import { getRuoloEsteso } from "~/utils/helper";
import { BarChartOutlined } from "@mui/icons-material";
import Modal from "../modal/Modal";
import Giocatore from "./Giocatore";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";
import { autosizeOptions } from "~/utils/datatable";

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

  const columns: GridColDef[] = [
    { field: "id", hideable: true },
    {
      field: "maglia",
      type: "string",
      align: "left",
      renderCell: (params) => (
        <Image
          src={params.row?.maglia as string}
          width={30}
          height={26}
          alt={params.row?.squadraSerieA as string}
          title={params.row?.squadraSerieA as string}
        />
      ),
      renderHeader: () => "",
      width: 30,
    },
    {
      field: "nome",
      type: "string",
      align: "left",
      renderHeader: () => <strong>Nome</strong>,
      width: 200,
    },
    {
      field: "squadra",
      type: "string",
      align: "left",
      renderHeader: () => <strong>Squadra</strong>,
      width: 200,
    },
    {
      field: "media",
      type: "number",
      align: "right",
      renderHeader: () => <strong>Media</strong>,
    },
    {
      field: "golfatti",
      type: "number",
      align: "right",
      renderHeader: () => <strong>Gol+</strong>,
      renderCell: (params) => (
        <Typography color="success">
          {params.row?.ruolo !== "P" ? params.row?.golfatti : ""}
        </Typography>
      ),
    },
    {
      field: "golsubiti",
      type: "number",
      align: "right",
      renderHeader: () => <strong>Gol-</strong>,
      renderCell: (params) => (
        <Typography color="success">
          {params.row?.ruolo === "P" ? params.row?.golsubiti : ""}
        </Typography>
      ),
    },
    {
      field: "assist",
      type: "number",
      align: "right",
      renderHeader: () => <strong>Assist</strong>,
    },
    {
      field: "giocate",
      type: "number",
      align: "right",
      renderHeader: () => <strong>Giocate</strong>,
    },
    {
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          key={params.id}
          icon={<BarChartOutlined color="success" />}
          label="Vedi giocatore"
          onClick={() => handleGiocatoreSelected(params.id as number)}
        />,
      ],
      flex: 1,
    },
  ];

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
                    color="warning"
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
                    color="warning"
                    onChange={() => setRuolo("C")}
                    checked={ruolo === "C"}
                  />
                }
                label={isXs ? "C" : getRuoloEsteso("C", true)}
              />
              <FormControlLabel
                control={
                  <Switch
                    color="warning"
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
            <Grid item xs={12} sx={{ minHeight: 500 }}>
              <Typography variant="h5">
                Top {getRuoloEsteso(ruolo, true)}
              </Typography>
              <Box sx={{ width: "100%" }}>
                <DataGrid
                  getRowId={(row) => row.idgiocatore}
                  columnHeaderHeight={45}
                  rowHeight={40}
                  loading={giocatoriStats.isLoading}
                  initialState={{
                    columns: {
                      columnVisibilityModel: {
                        id: false,
                      },
                    },
                    pagination: {
                      paginationModel: {
                        pageSize: 15,
                      },
                    },
                    filter: undefined,
                    density: "compact",
                  }}
                  checkboxSelection={false}
                  disableColumnFilter={true}
                  disableColumnMenu={true}
                  disableColumnSelector={true}
                  disableColumnSorting={false}
                  disableColumnResize={true}
                  hideFooter={false}
                  hideFooterPagination={false}
                  pageSizeOptions={[5, 10, 20]}
                  paginationMode="client"
                  pagination={true}
                  hideFooterSelectedRowCount={true}
                  columns={columns}
                  autosizeOptions={autosizeOptions}
                  rows={giocatoriStats.data}
                  disableRowSelectionOnClick={true}
                  sx={{
                    backgroundColor: "#fff",
                    "& .MuiDataGrid-columnHeader": {
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.secondary.light,
                    },
                  }}
                />
              </Box>
            </Grid>
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
          {selectedGiocatoreId !== undefined && (
            <Giocatore idGiocatore={selectedGiocatoreId} />
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Giocatori;
