'use client'
import React, { useEffect, useState } from 'react';
import { api } from "~/utils/api";
import DataTable, { type Column, type ActionOptions } from "~/components/tables/datatable";
import Modal from "~/components/modal/Modal";
import { z } from "zod";

//import material ui
import EditNoteIcon from '@mui/icons-material/EditNote';
import CheckIcon from '@mui/icons-material/CheckCircle';
import { CircularProgress, Tooltip, Grid, Divider, Typography, Checkbox, FormControlLabel, Alert, Stack, TextField, Button, Box } from "@mui/material";
import { type SquadraType } from '~/types/squadre';

const UtenteSchema = z.object({
    id: z.number(),
    isAdmin: z.boolean(),
    isLockLevel: z.boolean(),
    presidente: z.string().min(4),
    email: z.string().email(),
    squadra: z.string().min(4),
    foto: z.string(),
    importoAnnuale: z.number(),
    importoMulte: z.number(),
    importoMercato: z.number(),
    fantamilioni: z.number(),
});

export default function Presidenti() {
    const [idSquadra, setIdSquadra] = useState<number>();

    const squadreList = api.squadre.list.useQuery();
    const squadra = api.squadre.get.useQuery({ idSquadra: idSquadra! }, { enabled: !!idSquadra });
    const updateSquadra = api.squadre.update.useMutation({
        onSuccess: async () => await squadreList.refetch(),
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageModal, setErrorMessageModal] = useState('');
    const [messageModal, setMessageModal] = useState('');
    const [data, setData] = useState<SquadraType[]>([]);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [utenteInModifica, setUtenteInModifica] = useState<SquadraType>({
        id: 0,
        isAdmin: false,
        isLockLevel: false,
        presidente: '',
        email: '',
        squadra: '',
        importoAnnuale: 0,
        importoMulte: 0,
        importoMercato: 0,
        fantamilioni: 0
    });

    useEffect(() => {
        if (squadreList.data) {
            setData(squadreList.data);
        }
    }, [squadreList.data]);

    useEffect(() => {
        if (!squadra.isFetching && squadra.isSuccess && squadra.data) {
            setUtenteInModifica(squadra.data);
            setErrorMessageModal('');
            setMessageModal('');
            setOpenModalEdit(true);
        }
    }, [squadra.data, squadra.isSuccess, squadra.isFetching]);

    useEffect(() => {
        if (squadra.isError) {
            setErrorMessage('Si è verificato un errore in fase di caricamento della squadra');
        }
    }, [squadra.isError]);

    /* useEffect(() => {
        console.log('isLoading', squadra.isLoading);
    }, [squadra.isLoading]);
    useEffect(() => {
        console.log('isFetching', squadra.isFetching);
    }, [squadra.isFetching]);
    useEffect(() => {
        console.log('isFetched', squadra.isFetched);
    }, [squadra.isFetched]);
    useEffect(() => {
        console.log('isSuccess', squadra.isSuccess);
    }, [squadra.isSuccess]); */

    //#region datatable
    
    const columns: Column[] = [
        { key: "id", type: "number", align: "left", visible: false },
        { key: "presidente", type: "string", align: "left", label: "Presidente", sortable: true },
        { key: "squadra", type: "string", align: "left", label: "Squadra", sortable: true },
        { key: "email", type: "string", align: "left", label: "Mail", sortable: true, hiddenOnlyOnXs: true },
        { key: "isAdmin", type: "bool", align: "center", label: "Admin", sortable: false, hiddenOnlyOnXs: true },
        { key: "", type: "action", align: "center", width: "1%" }
    ];

    const actionEdit = (idUtente: string) => {
        return (
            <div>
                <Tooltip title={"Modifica"} onClick={() => handleEdit(+idUtente)} placement="left">
                    <EditNoteIcon />
                </Tooltip>
            </div>
        )
    };

    const actionOptions: ActionOptions[] = [
        {
            keyFields: ['id'],
            component: actionEdit
        }
    ];
    //#endregion

    //#region edit

    const handleEdit = async (_idUtente: number) => {
        setIdSquadra(_idUtente);
    };

    const handleModalClose = () => {
        setOpenModalEdit(false);
        setIdSquadra(undefined);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessageModal('');
        setMessageModal('');
        const responseVal = UtenteSchema.safeParse(utenteInModifica);
        if (!responseVal.success) {
            setErrorMessage(responseVal.error.issues.map(issue => `campo ${issue.path.toLocaleString()}: ${issue.message}`).join(', '));
        }
        else {
            try {
                await updateSquadra.mutateAsync(utenteInModifica); 
                setMessageModal('Salvataggio completato');
            } catch (error) {
                setErrorMessageModal('Si è verificato un errore nel salvataggio dell\'utente');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.currentTarget
        setUtenteInModifica(prevState => ({ ...prevState, [name]: type === 'number' ? +value : type === 'checkbox' ? checked : value }));
    };

    /* const handleSelectChange = (event: SelectChangeEvent) => {
        console.log(event.target.value);
        const { name, value } = event.target;
        setUtenteInModifica(prevState => ({ ...prevState, [name]: value }));
    }; */

    //#endregion

    return (
        <>
            {squadreList.isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress color="info" />
                </div>
            ) : (
                <DataTable
                    title="Gestione Squadre"
                    pagination={false}
                    data={data}
                    errorMessage={errorMessage}
                    columns={columns}
                    actionOptions={actionOptions}
                />
            )}

            <Modal title="Modifica dati squadra" open={openModalEdit} onClose={handleModalClose} >
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
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                required
                                sx={{ m: 2 }}
                                label='Presidente'
                                name="presidente"
                                value={utenteInModifica.presidente}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                required
                                sx={{ m: 2 }}
                                label='Squadra'
                                name="squadra"
                                value={utenteInModifica.squadra}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                required
                                sx={{ m: 2 }}
                                label='Email'
                                name="email"
                                value={utenteInModifica.email}
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
                                type='number'
                                sx={{ m: 2 }}
                                label='Importo annuale'
                                name="importoAnnuale"
                                value={utenteInModifica?.importoAnnuale}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                required
                                type='number'
                                sx={{ m: 2 }}
                                label='Importo multe'
                                name="importoMulte"
                                value={utenteInModifica?.importoMulte}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                required
                                type='number'
                                sx={{ m: 2 }}
                                label='Importo mercato'
                                name="importoMercato"
                                value={utenteInModifica?.importoMercato}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                size='small'
                                variant='outlined'
                                required
                                type='number'
                                sx={{ m: 2 }}
                                label='Fantamilioni'
                                name="fantamilioni"
                                value={utenteInModifica?.fantamilioni}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel sx={{ ml: 2, mr: 2 }} color='error' control={<Checkbox onChange={handleInputChange} color="success" name='isAdmin' checked={utenteInModifica?.isAdmin} value={utenteInModifica?.isAdmin} />} label={<Typography color='primary'>Amministratore</Typography>} />
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