import React from "react";
import { api } from "~/utils/api";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";

export default function Squadre() {
  const squadreList = api.squadre.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <>
      {squadreList.isLoading ? (
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {squadreList.data?.map((squadra, index) => (
            <Card
              key={index}
              sx={{ minWidth: 130, maxWidth: 130, marginBottom: "3px" }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="90"
                  image={squadra.foto ?? ""}
                  alt={squadra.squadra}
                  onClick={() =>
                    (window.location.href = `/squadra?idSquadra=${squadra.id}&squadra=${squadra.squadra}`)
                  }
                />
                <CardContent sx={{ paddingBottom: "2px", paddingLeft: "6px" }}>
                  <Typography variant="h5">
                    {squadra.squadra}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
}
