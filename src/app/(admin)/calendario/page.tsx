'use client'
import React, { useEffect, useState } from 'react';
import { api } from "~/utils/api";
import DataTable, { type Column, type ActionOptions } from "~/components/tables/datatable";
import Modal from "~/components/modal/Modal";
import { z } from "zod";
import { type CalendarioType } from '~/types/calendario';
import { convertFromDatetimeMUIToIso, convertFromIsoToDatetimeMUI } from '~/utils/dateUtils';

//import material ui
import EditNoteIcon from '@mui/icons-material/EditNote';
import CheckIcon from '@mui/icons-material/CheckCircle';
import { CircularProgress, Tooltip, Grid, Divider, Alert, Stack, TextField, Button, Box, Select, MenuItem, type SelectChangeEvent, FormControl, InputLabel, FormControlLabel, Checkbox, Typography } from "@mui/material";

const CalendarioSchema = z.object({
    idCalendario: z.number(),
    idTorneo: z.number(),
    giornata: z.number(),
    giornataSerieA: z.number(),
    data: z.string().datetime().optional(),
    dataFine: z.string().datetime().nullable(),
    girone: z.number().optional().nullable()
});

export default function Calendario() {
    const [idCalendario, setIdCalendario] = useState<number>();
    const calendarioList = api.calendario.list.useQuery();
    const oneCalendario = api.calendario.getOne.useQuery({ idCalendario: idCalendario! }, { enabled: !!idCalendario });
    const torneiList = api.tornei.list.useQuery(undefined, { refetchOnWindowFocus: false });
    const updateCalendario = api.calendario.update.useMutation({
        onSuccess: async () => await calendarioList.refetch(),
    }); 

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageModal, setErrorMessageModal] = useState('');
    const [messageModal, setMessageModal] = useState('');
    const [data, setData] = useState<CalendarioType[]>([]);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [calendarioInModifica, setCalendarioInModifica] = useState<CalendarioType>({
        idCalendario: 0,
        idTorneo: 1,
        nome: '',
        gruppoFase: '',
        giornata: 0,
        giornataSerieA: 0,
        isGiocata: false,
        isSovrapposta: false, 
        isRecupero: false,
        data: '',
        dataFine: '',
        girone: 1,
        isSelected: false,
    }); 

    useEffect(() => {
        if (calendarioList.data) {
            setData(calendarioList.data);
        }
    }, [calendarioList.data]);

    
    useEffect(() => {
        if (!oneCalendario.isFetching && oneCalendario.isSuccess && oneCalendario.data) {
            setCalendarioInModifica(oneCalendario.data);
            setErrorMessageModal('');
            setMessageModal('');
            setOpenModalEdit(true);
        }
    }, [oneCalendario.data, oneCalendario.isSuccess, oneCalendario.isFetching]); 

    useEffect(() => {
        if (oneCalendario.isError) {
            setErrorMessage('Si è verificato un errore in fase di caricamento della squadra');
        }
    }, [oneCalendario.isError]);
   

    //#region datatable
    
    const columns: Column[] = [
        { key: "idCalendario", type: "number", align: "left", visible: false },
        { key: "nome", type: "string", align: "left", header: "Torneo", sortable: true },
        { key: "giornataSerieA", type: "number", align: "left", header: "Serie A" },
        { key: "girone", type: "number", align: "left", header: "Girone" },
        { key: "gruppoFase", type: "string", align: "left", header: "Fase/Girone" },
        { key: "data", type: "date", align: "center", header: "Data", hiddenOnlyOnXs: true },
        { key: "dataFine", type: "date", align: "center", header: "Data fine", hiddenOnlyOnXs: true },
        { key: "isRecupero", type: "bool", align: "center", header: "Recupero", hiddenOnlyOnXs: true },
        { key: "", type: "action", align: "center", width: "1%" }
    ];

    const actionEdit = (idCalendario: string) => {
        return (
            <div>
                <Tooltip title={"Modifica"} onClick={() => handleEdit(+idCalendario)} placement="left">
                    <EditNoteIcon />
                </Tooltip>
            </div>
        )
    };

    const actionOptions: ActionOptions[] = [
        {
            keyFields: ['idCalendario'],
            component: actionEdit
        }
    ];
    //#endregion

    //#region edit

    const handleEdit = async (_idCalendario: number) => {
        setIdCalendario(_idCalendario);
    };

    const handleModalClose = () => {
        setOpenModalEdit(false);
        setIdCalendario(undefined);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessageModal('');
        setMessageModal('');
        const responseVal = CalendarioSchema.safeParse(calendarioInModifica);
        if (!responseVal.success) {
            setErrorMessageModal(responseVal.error.issues.map(issue => `campo ${issue.path.toLocaleString()}: ${issue.message}`).join(', '));
        }
        else {
            try {
                await updateCalendario.mutateAsync(calendarioInModifica); 
                setMessageModal('Salvataggio completato');
            } catch (error) {
                setErrorMessageModal('Si è verificato un errore nel salvataggio del calendario');
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.currentTarget
        console.log(event.currentTarget);
        setCalendarioInModifica(prevState => ({ ...prevState, [name]: type === 'number' ? +value : type === 'checkbox' ? checked : type === 'datetime-local' ? convertFromDatetimeMUIToIso(value) : value }));
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setCalendarioInModifica(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
    };

    //#endregion

    return (
        <>
            {calendarioList.isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress color="info" />
                </div>
            ) : (
                <DataTable
                    title="Gestione Calendario"
                    pagination={true}
                    data={data}
                    errorMessage={errorMessage}
                    columns={columns}
                    actionOptions={actionOptions}
                />
            )}

            <Modal title="Modifica dati calendario" open={openModalEdit} onClose={handleModalClose} >
                <Divider />
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            {errorMessageModal && (
                                <Stack sx={{ width: '100%' }} spacing={0}>
                                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">{errorMessageModal}</Alert>
                                </Stack>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <InputLabel id="select-label-torneo">Nome torneo</InputLabel>
                                <Select size='small'
                                    variant='outlined'
                                    labelId="select-label-torneo"
                                    label='Nome torneo'
                                    margin='dense'
                                    required
                                    sx={{ m: 2 }}
                                    name="idTorneo"
                                    onChange={handleSelectChange}
                                    value={torneiList && torneiList.data ? calendarioInModifica.idTorneo.toString() : ''}
                                >
                                    {torneiList?.data?.map(item => (
                                        <MenuItem key={`torneiSlc_${item.idTorneo}`} value={item.idTorneo}>
                                            {item.nome} {item.gruppoFase}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                required
                                type='number'
                                sx={{ m: 2 }}
                                label='Giornata'
                                name="giornata"
                                value={calendarioInModifica.giornata}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                required
                                type='number'
                                sx={{ m: 2 }}
                                label='Giornata serie A'
                                name="giornataSerieA"
                                value={calendarioInModifica.giornataSerieA}
                                autoFocus
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                required
                                type='datetime-local'
                                sx={{ m: 2 }}
                                label='Data'
                                name="data"
                                value={convertFromIsoToDatetimeMUI(calendarioInModifica.data)}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                type='datetime-local'
                                sx={{ m: 2 }}
                                label='Data fine'
                                name="dataFine"
                                value={convertFromIsoToDatetimeMUI(calendarioInModifica.dataFine)}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                type='number'
                                sx={{ m: 2 }}
                                label='Girone'
                                name="girone"
                                value={calendarioInModifica.girone}
                                onChange={handleInputChange} />
                            
                            <FormControlLabel sx={{ ml: 2, mr: 2 }} color='error' control={<Checkbox onChange={handleInputChange} color="success" name='isRecupero' checked={calendarioInModifica.isRecupero} value={calendarioInModifica.isRecupero} />} label={<Typography color='primary'>Da recuperare</Typography>} />
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                type="submit"
                                fullWidth
                                color="info"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Aggiorna dati
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                type="button"
                                onClick={handleModalClose}
                                fullWidth
                                color="warning"
                                variant="outlined"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Annulla
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            {messageModal && (
                                <Stack sx={{ width: '100%' }} spacing={0}>
                                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">{messageModal}</Alert>
                                </Stack>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Modal >
        </>);
}