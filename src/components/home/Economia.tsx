"use client";
import React from "react";
import { api } from "~/utils/api";
import DataTable, { type Column } from "~/components/tables/datatable";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
} from "@mui/material";

export default function Economia() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("md"));
  const economiaList = api.squadre.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const columns: Column[] = [
    {
      key: "foto",
      type: "image",
      align: "left",
      header: " ",
      width: "1%",
      imageProps: {
        imageTooltip: "presidente",
        imageTooltipType: "dynamic",
        imageWidth: 36,
        imageHeight: 36,
      },
    },
    { key: "squadra", type: "string", align: "left", header: "Squadra" },
    { key: "presidente", type: "string", align: "left", header: "Presidente" },
    {
      key: "importoAnnuale",
      type: "currency",
      align: "right",
      header: "Quota",
      currency: " €",
    },
    {
      key: "importoMulte",
      type: "currency",
      align: "right",
      header: "Multe",
      currency: " €",
    },
    {
      key: "importoMercato",
      type: "currency",
      align: "right",
      header: "Mercato",
      currency: " €",
    },
    {
      key: "fantamilioni",
      type: "number",
      align: "right",
      header: "Fantamilioni",
    },
  ];

  const importoAnnuale =
    economiaList?.data?.reduce(
      (acc, item) => acc + (item.importoAnnuale || 0),
      0
    ) ?? 0;
  const importoMulte =
    economiaList?.data?.reduce(
      (acc, item) => acc + (item.importoMulte || 0),
      0
    ) ?? 0;
  const importoMercato =
    economiaList?.data?.reduce(
      (acc, item) => acc + (item.importoMercato || 0),
      0
    ) ?? 0;
  const detrazioneSito = parseFloat(
    process.env.NEXT_PUBLIC_COSTI_DOMINIO ?? "-1"
  );

  return (
    <Zoom in={true}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={6} lg={6} paddingInlineEnd={isXs ? 0 : 1}>
          <Card>
            <CardHeader
              title="Riepilogo"
              titleTypographyProps={{ variant: "h5" }}
            />
            <CardContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Importo annuale iscrizioni: {importoAnnuale} € <br></br>
                Importo multe: {importoMulte} € <br></br>
                Importo mercato di riparazione: {importoMercato} € <br></br>
                Detrazione sito: {detrazioneSito} € <br></br>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={6} paddingInlineStart={isXs ? 0 : 1}>
          <Card>
            <CardHeader
              title="Premi stagionali"
              titleTypographyProps={{ variant: "h5" }}
            />
            <CardContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                1° Classificato:{" "}
                {calcolaPercentuale(
                  importoAnnuale + importoMercato + importoMulte,
                  55
                )}{" "}
                € <br></br>
                2° Classificato:{" "}
                {calcolaPercentuale(
                  importoAnnuale + importoMercato + importoMulte,
                  20
                )}{" "}
                € <br></br>
                3° Classificato:{" "}
                {calcolaPercentuale(
                  importoAnnuale + importoMercato + importoMulte,
                  10
                )}{" "}
                € <br></br>
                Vincitore Champions:{" "}
                {calcolaPercentuale(
                  importoAnnuale + importoMercato + importoMulte,
                  15
                )}{" "}
                € <br></br>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} xl={12} sm={12} lg={12}>
          <DataTable
            title={`Economia squadre`}
            pagination={false}
            data={economiaList.data}
            errorMessage={""}
            columns={columns}
          />
        </Grid>
      </Grid>
    </Zoom>
  );
}

function calcolaPercentuale(somma: number, percentuale: number): number {
  return Math.round((somma * percentuale) / 100);
}
