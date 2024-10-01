import React from 'react';
import { Card, CardHeader, CardContent, Typography, Stack, Divider, Paper, Tooltip, IconButton } from '@mui/material';
import { type GiornataType } from '~/types/common';
import { Ballot, Gavel, SportsSoccer } from '@mui/icons-material';
import { FrameType } from '~/utils/enums';
import { formatDateFromIso } from '~/utils/dateUtils';

interface GiornataCardProps {
    onActionChange: (action: FrameType, idPartita: number) => void;
    prefixTitle: string;
    giornata: GiornataType[];
    maxWidth: number | string;
}

export default function CardPartite({ onActionChange: onActionActive, prefixTitle, giornata, maxWidth }: GiornataCardProps) {
    const handleAction = (newFrame: FrameType, idPartita: number) => {
        onActionActive(newFrame, idPartita);
    };

    return (
        <>
            {giornata.map((g) => (
                <Paper elevation={3} key={`card_${g.idCalendario}`} sx={{ maxWidth: maxWidth }}>
                    <Card sx={{ maxWidth: maxWidth }} key={`card_${g.idCalendario}`}>
                        <CardHeader title={`${prefixTitle} ${g?.Title}`} subheader={`${g.SubTitle}: ${formatDateFromIso(g.data, "dd/MM/yyyy HH:mm")}`} titleTypographyProps={{ variant: 'h5' }} subheaderTypographyProps={{ variant: 'h6' }} />
                        <CardContent sx={{ paddingBottom: '3px', paddingTop: '3px', m: '4px' }} key={`card_content_${g.idCalendario}`}>
                            {g.partite.length > 0 ? (
                                g.partite.map(partita => (
                                    <span key={`span_${partita.idPartita}`}>
                                        <Stack direction="row" spacing={0} justifyContent="space-between" key={`infopartita_${partita.idPartita}`}>
                                            <Typography variant="body2" component="div" color="text.secondary" key={`typography_${partita.idPartita}`}>
                                                {partita.squadraHome} {partita.multaHome ? <Tooltip title='Multa'><Gavel color='error' fontSize='small' /></Tooltip> : ''} - {partita.squadraAway} {partita.multaAway ? <Tooltip title='Multa'><Gavel color='error' /></Tooltip> : ''}
                                            </Typography>
                                            <Stack direction="row" spacing={0} justifyContent="flex-end" key={`stack2_${partita.idPartita}`}>
                                                <Typography variant="body2" component="div" color="text.secondary" key={`typography2_${partita.idPartita}`}>
                                                    {partita.golHome} - {partita.golAway}
                                                </Typography>
                                                {g.isGiocata && (
                                                    <Tooltip title="Tabellino voti" placement="top-start">
                                                        <IconButton onClick={() => handleAction(FrameType.tabellinoPartita, partita.idPartita)} sx={{ height: '24px' }}>
                                                            <Ballot color='primary' fontSize='large' />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {!g.isGiocata && (
                                                    <Tooltip title="Visualizza Formazioni" placement="top-start">
                                                        <IconButton onClick={() => handleAction(FrameType.formazioniPartita, partita.idPartita)} sx={{ height: '24px' }}>
                                                            <SportsSoccer color='primary' fontSize='large' />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                        </Stack>
                                        <Divider></Divider>
                                    </span>
                                ))
                            ) : (
                                <Typography variant="body2" component="div" color="text.secondary" key={`CardPartiteEmpty_${g.idCalendario}`}>
                                    Nessuna partita in programma
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Paper>
            ))}
        </>
    );
}

