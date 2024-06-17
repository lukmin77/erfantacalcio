'use client'
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Grid, Button, Card, CardContent, Typography, Box, Divider, Stack, Alert, AlertTitle, CardHeader, CardMedia, Avatar } from "@mui/material";
import LinearProgressBar from "~/components/LinearProgressBar/LinearProgressBar";
import { api } from "~/utils/api";
import { getFileExtension } from "~/utils/stringUtils";
import { getTimestamp } from "~/utils/dateUtils";
import { CloudUpload } from "@mui/icons-material";

export default function FotoProfilo() {
    const { data: session, update } = useSession();
    const updateFotoProfilo = api.profilo.updateFoto.useMutation();
    const uploadFileBlock = api.profilo.uploadFoto.useMutation();
    const uploadFileVercel = api.profilo.uploadFotoVercel.useMutation();
    const deleteFiles = api.profilo.deleteFoto.useMutation();
    const [infofile, setInfofile] = useState('');
    const [file, setFile] = useState<File | undefined>();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [alert, setAlert] = useState<{
        severity: "success" | "error" | "warning";
        message: string;
        title: string;
    } | null>(null);


    const handleSelezioneFile = async () => {
        document.getElementById("upload-input")?.click();
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0]);
        setInfofile('');
        setProgress(0);
        setUploading(false);

        if (event.target.files?.[0]) {
            setInfofile(`Nome file: ${event.target.files?.[0]?.name ?? ''}, dimensioni del file: ${(event.target.files?.[0]?.size ?? 0) / 1000} Kb, tipo: ${event.target.files?.[0]?.type}`);
        }
    };

    const handleUpload = async () => {
        if (validateFile(file)) {
            await deleteFiles.mutateAsync();
            const filename = `foto_${session?.user?.idSquadra}_${getTimestamp()}${getFileExtension(file?.name)}`
            const filesize = file?.size ?? 0;
            setUploading(true);

            const CHUNK_SIZE = 0.65 * 1024 * 1024; // Dimensione del blocco (0.65 MB)
            let offset = 0;

            // Funzione per leggere e caricare un blocco del file
            const readAndUploadBlock = () => {
                if (file) {
                    const blob = file.slice(offset, offset + CHUNK_SIZE);
                    const reader = new FileReader();

                    reader.onload = async () => {
                        if (reader.result && typeof reader.result !== "string") {
                            const blockData = new Uint8Array(reader.result);
                            const blockDataBase64 = Buffer.from(blockData).toString("base64");
                            const contentLength = blockData.length;
                            offset += contentLength;

                            const percentCompleted = Math.floor((offset * 100) / file.size);
                            setProgress(percentCompleted);

                            // Carica il blocco corrente
                            try {
                                await uploadFileBlock.mutateAsync({
                                    fileName: filename,
                                    fileSize: filesize,
                                    blockDataBase64: blockDataBase64
                                });
                            } catch (error) {
                                setAlert({
                                    severity: "error",
                                    message: "Errore caricamento file",
                                    title: "Errore",
                                });
                                return;
                            }

                            // Se ci sono ancora blocchi da leggere, continua con il prossimo
                            if (offset < file.size) {
                                readAndUploadBlock();
                            } else if (offset === file.size) {
                                const filePath = await updateFotoProfilo.mutateAsync({
                                    fileName: filename
                                });
                                //aggiorno la sessione utente con la nuova immagine
                                await update({
                                    ...session,
                                    user: {
                                        ...session?.user,
                                        image: filePath
                                    }
                                });
                                setUploading(false);
                                setAlert({
                                    severity: "success",
                                    message: "File caricato correttamente",
                                    title: "Foto inviata",
                                });
                            }
                        }
                    };

                    reader.readAsArrayBuffer(blob);
                }
            };

            // Avvia il processo di caricamento del file
            readAndUploadBlock();
        }
    };

    const handleUploadVercel = async () => {
        if (validateFile(file)) {
            const filename = `foto_${session?.user?.idSquadra}_${getTimestamp()}${getFileExtension(file?.name)}`
            setUploading(true);

            const MAX_SIZE = 4.5 * 1024 * 1024; // Dimensione del blocco (4.5 MB)
            let offset = 0;

            // Funzione per leggere e caricare un blocco del file
            const readAndUploadBlock = () => {
                if (file) {
                    const blob = file.slice(offset, offset + MAX_SIZE);
                    const reader = new FileReader();

                    reader.onload = async () => {
                        if (reader.result && typeof reader.result !== "string") {
                            const blockData = new Uint8Array(reader.result);
                            const fileData = Buffer.from(blockData).toString("base64");
                            const contentLength = blockData.length;
                            offset += contentLength;

                            const percentCompleted = Math.floor((offset * 100) / file.size);
                            setProgress(percentCompleted);

                            // Carica il blocco corrente
                            try {
                                const serverPathfilename = await uploadFileVercel.mutateAsync({
                                    fileName: filename,
                                    fileData: fileData
                                });

                                const filePath = await updateFotoProfilo.mutateAsync({
                                    fileName: serverPathfilename
                                });
                                //aggiorno la sessione utente con la nuova immagine
                                await update({
                                    ...session,
                                    user: {
                                        ...session?.user,
                                        image: filePath
                                    }
                                });
                                setUploading(false);
                                setAlert({
                                    severity: "success",
                                    message: "File caricato correttamente",
                                    title: "Foto inviata",
                                });
                            } catch (error) {
                                setAlert({
                                    severity: "error",
                                    message: "Errore caricamento file",
                                    title: "Errore",
                                });
                                return;
                            }
                        }
                    };

                    reader.readAsArrayBuffer(blob);
                }
            };

            // Avvia il processo di caricamento del file
            readAndUploadBlock();
        }
    }

    const validateFile = (file: File | undefined) => {
        if (!file) {
            setAlert({ severity: "error", message: "Nessun file selezionato.", title: "Avviso" });
            return;
        }
        if (file.size > 4.5 * 1024 * 1024) { // Converti 5 MB in byte
            setAlert({ severity: "error", message: "La dimensione del file supera i 5 megabyte.", title: "Avviso" });
            return false; // File non valido
        }

        return true;
    };

    return (
        <Grid container justifyContent="center" spacing={0}>
            <Grid item xs={12} md={6}>
                <Card sx={{ maxWidth: 600 }}>
                    <CardHeader title="Modifica foto profilo" titleTypographyProps={{ variant: 'h4' }}
                        subheader={session?.user?.presidente}
                        avatar={
                            <Avatar alt={session?.user?.squadra ?? ''}
                                src={session?.user?.image?.toString() ?? ''}
                                sx={{ mr: '5px' }}>
                            </Avatar>
                        }
                    >
                    </CardHeader>
                    <CardMedia
                        component="img"
                        height="250"
                        sx={{
                            paddingTop: '0%',
                        }}
                        image={session?.user?.image ?? ''}
                        alt={session?.user?.presidente}
                    />
                    <CardContent>
                        <Divider />
                        <Box sx={{ p: 1 }}>
                            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                <Button color="info" variant="contained" component="div" onClick={handleSelezioneFile}>
                                    Seleziona foto
                                </Button>
                                <input
                                    accept="image/png, image/jpeg, image/gif"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    type="file"
                                    id="upload-input"
                                />
                                <Button color="info" variant="contained" onClick={handleUploadVercel} startIcon={<CloudUpload />} disabled={uploading}>
                                    Upload
                                </Button>
                            </Stack>
                        </Box>
                        <Box sx={{ p: 1 }}>
                            <Typography variant="body2" component="div" color="text.secondary">
                                {infofile}
                            </Typography>
                        </Box>
                        <Box sx={{ p: 1 }}>
                            {uploading && (
                                <>
                                    <br />
                                    <LinearProgressBar progress={progress} />
                                </>
                            )}
                            {alert && (
                                <Alert severity={alert.severity} onClose={() => setAlert(null)}>
                                    <AlertTitle>{alert.title}</AlertTitle>
                                    {alert.message}
                                </Alert>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

