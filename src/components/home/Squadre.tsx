import React from "react";
import { api } from "~/utils/api";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from "@mui/material";

export default function Squadre() {
  const squadreList = api.squadre.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      {!squadreList.isLoading
        ? squadreList.data?.map((squadra, index) => (
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
                    (window.location.href = `/squadra/${squadra.id}/${squadra.squadra}`)
                  }
                />
                <CardContent sx={{ paddingBottom: "2px", paddingLeft: "6px" }}>
                  <Typography variant="h5">{squadra.squadra}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        : Array.from({ length: 8 }, (_, index) => (
            <Box key={index} sx={{ minWidth: 130, maxWidth: 130 }}>
              <Skeleton width="100%" height={130} animation="pulse">
                <Typography>.</Typography>
              </Skeleton>
            </Box>
          ))}
    </Box>
  );
}
