import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  Paper,
  Tooltip,
  Avatar,
  Grid,
} from "@mui/material";
import { type GiornataType } from "~/types/common";
import { Gavel } from "@mui/icons-material";
import { formatDateFromIso } from "~/utils/dateUtils";

interface GiornataCardProps {
  prefixTitle: string;
  giornata: GiornataType[];
  maxWidth: number | string;
  withAvatar: boolean;
}

export default function CardPartite({
  prefixTitle,
  giornata,
  maxWidth,
  withAvatar,
}: GiornataCardProps) {
  return (
    <>
      {giornata.map((g) => (
        <Paper
          elevation={0}
          key={`card_${g.idCalendario}`}
          sx={{ maxWidth: maxWidth }}
        >
          <Card sx={{ maxWidth: maxWidth }} key={`card_${g.idCalendario}`}>
            <CardHeader
              title={`${prefixTitle} ${g?.Title}`}
              subheader={`${g.SubTitle}: ${formatDateFromIso(
                g.data,
                "dd/MM HH:mm"
              )}`}
              titleTypographyProps={{ variant: "h5" }}
              subheaderTypographyProps={{ variant: "h6" }}
              sx={{ paddingLeft: "5px" }}
            />
            <CardContent
              sx={{ paddingBottom: "3px", paddingTop: "3px", m: "4px" }}
              key={`card_content_${g.idCalendario}`}
            >
              {g.partite.length > 0 ? (
                g.partite.map((partita) => (
                  <a
                    href={
                      g.isGiocata
                        ? `/tabellini?idPartita=${partita.idPartita}&idCalendario=${g.idCalendario}`
                        : `/formazioni?idPartita=${partita.idPartita}&idCalendario=${g.idCalendario}`
                    }
                    key={`grid_${partita.idPartita}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Grid
                      container
                      spacing={0}
                      padding={1}
                      key={`grid_${partita.idPartita}`}
                    >
                      {withAvatar && (
                        <Grid item xs={1} alignSelf={"center"}>
                          <Avatar
                            alt={partita.squadraHome ?? ""}
                            src={partita.fotoHome ?? ""}
                            variant="rounded"
                          ></Avatar>
                        </Grid>
                      )}
                      <Grid item xs={withAvatar ? 4 : 5} alignSelf={"center"}>
                        <Typography variant="h6">
                          {partita.squadraHome}
                          {partita.multaHome ?? (
                            <Tooltip title="Multa">
                              <Gavel color="error" fontSize="small" />
                            </Tooltip>
                          )}
                        </Typography>
                        <Typography variant="h5">
                          {partita.golHome ?? "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} alignSelf={"center"}></Grid>
                      <Grid
                        item
                        xs={withAvatar ? 4 : 5}
                        alignSelf={"center"}
                        textAlign={"right"}
                        paddingRight={2}
                      >
                        <Typography variant="h6">
                          {partita.squadraAway}
                          {partita.multaAway ?? (
                            <Tooltip title="Multa">
                              <Gavel color="error" fontSize="small" />
                            </Tooltip>
                          )}
                        </Typography>
                        <Typography variant="h5">
                          {partita.golAway ?? "-"}
                        </Typography>
                      </Grid>
                      {withAvatar && (
                        <Grid item xs={1} alignSelf={"center"}>
                          <Avatar
                            alt={partita.squadraAway ?? ""}
                            src={partita.fotoAway ?? ""}
                            variant="rounded"
                          ></Avatar>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    </Grid>
                  </a>
                ))
              ) : (
                <Grid container spacing={0} key={`grid_0`}>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      component="div"
                      color="text.secondary"
                      key={`CardPartiteEmpty_${g.idCalendario}`}
                    >
                      Nessuna partita in programma
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Paper>
      ))}
    </>
  );
}
