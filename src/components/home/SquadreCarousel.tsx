import React from 'react';
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Box, Card, CardActions, CardMedia, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import Carousel from 'react-material-ui-carousel'
import { Diversity1, Ballot, QueryStats } from '@mui/icons-material';
import { FrameType } from '~/utils/enums';

interface SquadreProps {
    onActionChange: (action: FrameType, idSquadra?: number, squadra?: string) => void;
}

export default function SquadreCarousel({ onActionChange: onActionActive }: SquadreProps) {
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
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2px', flexWrap: 'wrap' }}>
                    <Carousel autoPlay={false} swipe={true}>
                        {squadreList.data?.map((squadra, index) => (
                            <Card key={index} sx={{ minWidth: 120, maxWidth: 345, marginBottom: '2px' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={squadra.foto ?? ''}
                                    alt={squadra.squadra}
                                />
                                <CardActions disableSpacing sx={{ paddingTop: '2px'}}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {squadra.squadra}
                                    </Typography>
                                    {squadra.id === session?.user?.idSquadra && (
                                        <Tooltip title="Formazione">
                                            <IconButton onClick={() => handleAction(FrameType.schieraFormazione)}>
                                                <Ballot color='primary' fontSize='large' />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Rosa">
                                        <IconButton onClick={() => handleAction(FrameType.rosa, squadra.id, squadra.squadra)}>
                                            <Diversity1 color='success' fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Info squadra/partite">
                                        <IconButton onClick={() => handleAction(FrameType.statisticheSquadra, squadra.id, squadra.squadra)}>
                                            <QueryStats color='warning' fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                        ))}
                    </Carousel>
                </Box>
            )}


        </>);
}