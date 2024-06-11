import React, { useEffect, useState } from 'react';
import { api } from "~/utils/api";
import { Alert, Stack } from "@mui/material";
import { type GiornataType } from '~/types/common';
import CardPartite from '../cardPartite/CardPartite';
import CheckIcon from '@mui/icons-material/CheckCircle';
import { type FrameType } from '~/utils/enums';

interface CalendarioProps {
    onActionChange: (action: FrameType, idPartita: number) => void;
    prefixTitle: string;
    tipo: 'risultati' | 'prossima';
}

export default function Calendario({ onActionChange: onActionActive, prefixTitle, tipo }: CalendarioProps) {
    const calendarioList = tipo === 'prossima' 
        ? api.calendario.getProssimeGiornate.useQuery(undefined, { refetchOnWindowFocus: false, refetchOnReconnect: false })
        : api.calendario.getUltimiRisultati.useQuery(undefined, { refetchOnWindowFocus: false, refetchOnReconnect: false });
    const [errorMessage, setErrorMessage] = useState('');
    const [giornata, setGiornata] = useState<GiornataType[]>();

    useEffect(() => {
        if (!calendarioList.isFetching && calendarioList.isSuccess && calendarioList.data) {
            setGiornata(calendarioList.data);
        }
    }, [calendarioList.data, calendarioList.isSuccess, calendarioList.isFetching]);


    useEffect(() => {
        if (calendarioList.isError) {
            setErrorMessage('Si è verificato un errore in fase di caricamento');
        }
    }, [calendarioList.isError]);

    const handleAction = (newFrame: FrameType, idPartita: number) => {
        onActionActive(newFrame, idPartita);
    };

    return (
        <>
            {!calendarioList.isLoading && giornata && (
                <CardPartite onActionChange={handleAction} giornata={giornata} prefixTitle={prefixTitle} maxWidth={600}></CardPartite>
            )}
            {errorMessage && (
                <Stack sx={{ width: '100%' }} spacing={0}>
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">{errorMessage}</Alert>
                </Stack>
            )}
        </>
    );
}