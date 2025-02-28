import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Box, Typography, useTheme } from "@mui/material";
import { type ClassificaType } from "~/types/classifica";
import { getNomeTorneo } from "~/utils/helper";
import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";

interface ClassificaProps {
  nomeTorneo: string;
  idTorneo: number | undefined;
  gruppo: string | null;
}

export default function Classifica({
  nomeTorneo = "",
  idTorneo = undefined,
  gruppo = null,
}: ClassificaProps) {
  const theme = useTheme();
  const classificaList = api.classifica.list.useQuery(
    { idTorneo: idTorneo! },
    {
      enabled: !!idTorneo,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  const [rows, setRows] = useState<ClassificaType[]>([]);

  useEffect(() => {
    if (
      !classificaList.isFetching &&
      classificaList.isSuccess &&
      classificaList.data
    ) {
      setRows(classificaList.data);
    }
  }, [
    classificaList.data,
    classificaList.isSuccess,
    classificaList.isFetching,
  ]);

  const columns: GridColDef[] = [
    { field: "id", hideable: true },
    {
      field: "squadra",
      type: "string",
      align: "left",
      renderHeader: () => <strong>Squadra</strong>,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "punti",
      type: "number",
      align: "right",
      renderHeader: () => <strong>Punti</strong>,
      flex: 1,
      width: 80
    },
    {
      field: "golFatti",
      type: "number",
      align: "right",
      renderHeader: () => <strong>Gol+</strong>,
      flex: 1,
      width: 80
    },
    {
      field: "golSubiti",
      type: "number",
      align: "right",
      renderHeader: () => <strong>Gol-</strong>,
      flex: 1,
      width: 80
    },
    {
      field: "giocate",
      type: "number",
      align: "right",
      renderHeader: () => <strong>Giocate</strong>,
      flex: 1,
      width: 80
    },
    {
      field: "fantapunti",
      type: "number",
      align: "right",
      renderHeader: () => <strong>Fantapunti</strong>,
      width: 80
    },
  ];

  return (
    <>
      <Typography variant="h4">
        Classifica {getNomeTorneo(nomeTorneo, gruppo)}
      </Typography>
      <Box sx={{ padding: "0", backgroundColor: "#fff" }}>
        <DataGrid
          columnHeaderHeight={45}
          rowHeight={40}
          loading={classificaList.isLoading}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              }
            },
            pagination: undefined,
            filter: undefined,
            density: "compact",
          }}
          checkboxSelection={false}
          disableColumnFilter={true}
          disableColumnMenu={true}
          disableColumnSelector={true}
          disableColumnSorting={true}
          disableColumnResize={true}
          hideFooter={true}
          hideFooterPagination={true}
          hideFooterSelectedRowCount={true}
          columns={columns}
          rows={rows}
          disableRowSelectionOnClick={true}
          autosizeOptions={autosizeOptions}
          sx={{
            backgroundColor: "#fff",
            "& .MuiDataGrid-columnHeader": {
              color: theme.palette.primary.light,
              backgroundColor: theme.palette.secondary.light,
            },
          }}
        />
      </Box>
    </>
  );
}

const autosizeOptions = {
  includeHeaders: true,
  includeOutliers: true,
  expand: true,
};
