import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Typography, Stack, TextField, Divider, Button, Alert, CardActions, Checkbox, FormControlLabel, Paper } from '@mui/material';
import { type PartitaAdminType, type GiornataAdminType} from '~/types/risultati';
import { z } from 'zod';
import { convertFromDatetimeMUIToIso } from '~/utils/dateUtils';
import { api } from "~/utils/api";
import CheckIcon from '@mui/icons-material/CheckCircle';

interface GiornataCardProps {
    giornata: GiornataAdminType;
}

const PartitaSchema = z.object({
    idPartita: z.number(),
    escludi: z.boolean(),
    calcoloGolSegnatiHome: z.number().min(0).max(10),
    calcoloGolSegnatiAway: z.number().min(0).max(10),
    fantapuntiHome: z.number().min(0).max(120),
    fantapuntiAway: z.number().min(0).max(120),
    multaHome: z.boolean(),
    multaAway: z.boolean()
});

function CardPartiteAdmin({ giornata }: GiornataCardProps) {
    const [risultati, setRisultati] = useState<PartitaAdminType[]>([]);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const updateRisultati = api.risultati.update.useMutation();

    useEffect(() => {
        if (giornata) {
            setRisultati(giornata.partite);
        }
    }, [giornata]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idPartita: number) => {
        const { name, value, type } = event.currentTarget 

        const updatedResults = risultati.map(partita => {
            // Se l'id della partita corrisponde, aggiorna solo il valore corrispondente
            if (partita.idPartita === idPartita) {
                return {
                    ...partita,
                    [name]: type === 'number' ? +value : type === 'datetime-local' ? convertFromDatetimeMUIToIso(value) : value 
                };
            }
            return partita; // Altrimenti, ritorna la partita immutata
        });

        setRisultati(updatedResults);
        //console.log(updatedResults);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, idPartita: number) => {
        const { name, checked } = e.currentTarget

        const updatedResults = risultati.map(partita => {
            // Se l'id della partita corrisponde, aggiorna solo il valore corrispondente
            if (partita.idPartita === idPartita) {
                return {
                    ...partita, [name] : checked
                };
            }
            return partita; // Altrimenti, ritorna la partita immutata
        });

        setRisultati(updatedResults);
        //console.log(updatedResults);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage('');
        setErrorMessage('');
        let hasError = false;

        const promises = risultati.filter(c => c.escludi === false).map(async partita => {
            const responseVal = PartitaSchema.safeParse(partita);
            if (!responseVal.success) {
                setErrorMessage(responseVal.error.issues.map(issue => `campo ${issue.path.toLocaleString()}: ${issue.message}`).join(', '));
                hasError = true;
            }
            else {
                try {
                    await updateRisultati.mutateAsync({
                        escludi: partita.escludi,
                        idPartita: partita.idPartita,
                        golHome: partita.calcoloGolSegnatiHome,
                        golAway: partita.calcoloGolSegnatiAway,
                        fantapuntiHome: partita.totaleFantapuntiHome,
                        fantapuntiAway: partita.totaleFantapuntiAway,
                        multaHome: partita.multaHome,
                        multaAway: partita.multaAway
                    });
                } catch (error) {
                    setErrorMessage(`Si è verificato un errore nel salvataggio della partita ${partita.squadraHome}-${partita.squadraAway}`);
                    hasError = true;
                }
            }
        });
        await Promise.all(promises);
        if (!hasError)
            setMessage('Salvataggio completato');
    };

    return (
        <Paper elevation={3}>
            <Card sx={{ maxWidth: 600, padding: 0 }}>
                <CardHeader title={giornata?.Title} subheader={giornata?.SubTitle} titleTypographyProps={{ variant: 'h5' }} subheaderTypographyProps={{ variant: 'h6' }} />
                <Divider></Divider>
                <CardContent sx={{ paddingBottom: '3px', paddingTop: '10px' }} key={`calendario_${giornata.idCalendario}`}>
                    {risultati.length > 0 ? (
                        risultati.map(partita => (
                            <span key={`span_${partita.idPartita}`}>
                                <Stack direction="row" spacing={0} justifyContent="space-between" key={`infopartita_${partita.idPartita}`}>
                                    <Typography variant="h5" component="div" color="text.secondary">
                                        {partita.squadraHome} - {partita.squadraAway}
                                    </Typography>
                                    <Typography variant="h5" component="div" color="text.secondary">
                                        {partita.golHome} - {partita.golAway}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={0} key={`multe_${partita.idPartita}`}>
                                    <FormControlLabel control={<Checkbox onChange={(event) => handleCheckboxChange(event, partita.idPartita)} color="success" name='multaHome' checked={partita.multaHome} value={partita.multaHome} />} label='Multa home' />
                                    <FormControlLabel control={<Checkbox onChange={(event) => handleCheckboxChange(event, partita.idPartita)} color="success" name='multaAway' checked={partita.multaAway} value={partita.multaAway} />} label='Multa away' />
                                    <FormControlLabel control={<Checkbox onChange={(event) => handleCheckboxChange(event, partita.idPartita)} color="success" name='escludi' checked={partita.escludi} value={partita.escludi} />} label='Escludi partita' />
                                </Stack>
                                <Stack direction="row" spacing={0} justifyContent="space-between" key={`inputpartita_${partita.idPartita}`}>
                                    <TextField
                                        margin="normal"
                                        size='small'
                                        variant='outlined'
                                        required
                                        type='number'
                                        sx={{ m: 2, width: '100px' }}
                                        label='Home'
                                        name='totaleFantapuntiHome'
                                        value={partita.totaleFantapuntiHome}
                                        onChange={(event) => handleInputChange(event, partita.idPartita)}
                                    />
                                    <TextField
                                        margin="normal"
                                        size='small'
                                        variant='outlined'
                                        required
                                        type='number'
                                        sx={{ m: 2, width: '100px' }}
                                        label='Away'
                                        name='totaleFantapuntiAway'
                                        value={partita.totaleFantapuntiAway}
                                        onChange={(event) => handleInputChange(event, partita.idPartita)}
                                    />
                                    <TextField
                                        margin="normal"
                                        size='small'
                                        variant='outlined'
                                        required
                                        type='number'
                                        sx={{ m: 2, width: '100px' }}
                                        label='Gol home'
                                        name='calcoloGolSegnatiHome'
                                        value={partita.calcoloGolSegnatiHome}
                                        onChange={(event) => handleInputChange(event, partita.idPartita)}
                                    />
                                    <TextField
                                        margin="normal"
                                        size='small'
                                        variant='outlined'
                                        required
                                        type='number'
                                        sx={{ m: 2, width: '100px' }}
                                        label='Gol away'
                                        name='calcoloGolSegnatiAway'
                                        value={partita.calcoloGolSegnatiAway}
                                        onChange={(event) => handleInputChange(event, partita.idPartita)}
                                    />
                                </Stack>
                                <Divider key={`divider_${partita.idPartita}`}></Divider>
                            </span>
                        ))
                    ) : (
                        <Typography variant="body2" component="div" color="text.secondary">
                            Nessuna partita in programma
                        </Typography>
                    )}
                </CardContent >
                <CardActions>
                    <Stack direction="column" component="form" onSubmit={handleSubmit} noValidate spacing={0} justifyContent="space-between" sx={{ width: '100%' }}>
                        <Button
                            type="submit"
                            fullWidth
                            color="info"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Aggiorna dati
                        </Button>
                        {message && (
                            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">{message}</Alert>

                        )}
                        {errorMessage && (
                            <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">{errorMessage}</Alert>
                        )}
                    </Stack>
                </CardActions>
            </Card>
        </Paper>
    );
}

export default CardPartiteAdmin;
