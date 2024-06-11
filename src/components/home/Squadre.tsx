import React from 'react';
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Box, Card, CardActions, CardContent, CardMedia, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { Ballot, QueryStats, Diversity1 } from '@mui/icons-material';
import { FrameType } from '~/utils/enums';

interface SquadreProps {
    onActionChange: (action: FrameType, idSquadra?: number, squadra?: string) => void;
}

export default function Squadre({ onActionChange: onActionActive }: SquadreProps) {
    const squadreList = api.squadre.list.useQuery(undefined, { refetchOnWindowFocus: false, refetchOnReconnect: false });
    const { data: session } = useSession();
    
    const handleAction = (newFrame: FrameType, idSquadra?: number, squadra?: string) => {
        onActionActive(newFrame, idSquadra, squadra);
    };
    
    return (
        <>
            {squadreList.isLoading ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress color="warning" />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        {squadreList.data?.map((squadra, index) => (
                            <Card key={index} sx={{ minWidth: 130, maxWidth: 345, marginBottom: '3px' }}>
                                <CardMedia
                                    component="img"
                                    height="90"
                                    image={squadra.foto ?? ''}
                                    alt={squadra.squadra}
                                />
                                <CardContent sx={{ paddingBottom: '2px' }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {squadra.squadra}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing sx={{ paddingTop: '2px'}}>
                                    {squadra.id === session?.user?.idSquadra && (
                                        <Tooltip title="Schiera formazione">
                                            <IconButton onClick={() => handleAction(FrameType.schieraFormazione)}>
                                                <Ballot color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Rosa">
                                        <IconButton onClick={() => handleAction(FrameType.rosa, squadra.id, squadra.squadra)}>
                                            <Diversity1 color='success' />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Statistiche">
                                        <IconButton onClick={() => handleAction(FrameType.statisticheSquadra, squadra.id, squadra.squadra)}>
                                            <QueryStats color='warning' />
                                        </IconButton>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                        ))}
                </Box>
            )}


        </>);
}