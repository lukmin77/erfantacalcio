import { Home, KeyboardDoubleArrowLeftOutlined, KeyboardDoubleArrowRightOutlined, Style } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, IconButton, Stack, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { api } from "~/utils/api";
import { FrameType } from '~/utils/enums';
import Image from "next/image";
import { getShortName } from "~/utils/helper";
import Giocatori from "../giocatori/Giocatori";
import { useState } from "react";
import Modal from "../modal/Modal";
import { Configurazione } from "~/config";

interface FormazioniProps {
    onActionChange: (action: FrameType) => void;
    idPartita: number | undefined;
}

interface Tabellino {
    dataOra: Date;
    modulo: string;
    idSquadra: number,
    fattoreCasalingo: number,
    bonusModulo: number,
    bonusSenzaVoto: number,
    fantapunti: number,
    golSegnati: number,
    fantapuntiTotale: number,
    Voti: {
        nomeSquadraSerieA?: string;
        magliaSquadraSerieA?: string;
        nome: string;
        idGiocatore: number;
        ruolo: string;
        riserva: number | null;
        titolare: boolean;
        voto: number;
        gol: number;
        assist: number;
        autogol: number;
        altriBonus: number;
        ammonizione: number;
        espulsione: number;
        votoBonus: number,
        isSostituito: boolean,
        isVotoInfluente: boolean
    }[];
}


function ViewTabellini({ onActionChange: onActionActive, idPartita }: FormazioniProps) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('md'));
    const [idGiocatore, setIdGiocatore] = useState<number>();
    const [openModalCalendario, setOpenModalCalendario] = useState(false);

    const tabelliniList = api.partita.getTabellini.useQuery({ idPartita: idPartita! }, { enabled: !!idPartita, refetchOnWindowFocus: false, refetchOnReconnect: false });

    const calendario = tabelliniList.data?.Calendario;
    const infoPartita = tabelliniList.data?.Calendario.partite[0];
    const tabellinoHome = tabelliniList.data?.TabellinoHome;
    const tabellinoAway = tabelliniList.data?.TabellinoAway;

    const handleAction = (newFrame: FrameType) => {
        onActionActive(newFrame);
    };

    const handleModalClose = () => {
        setOpenModalCalendario(false);
    };

    const renderTabellino = (tabellino?: Tabellino, squadra?: string | null, foto?: string | null, multa?: boolean) => {
        const handleStatGiocatore = (idGiocatore: number) => {
            setIdGiocatore(idGiocatore);
            setOpenModalCalendario(true);
        };

        if (tabellino) {
            return (
                <Card>
                    <CardHeader title={(
                        <Grid container spacing={0}>
                            <Grid item xs={11}>{squadra}</Grid>
                            <Grid item xs={1} display={'flex'} justifyContent={'flex-end'}>
                                <Typography variant={'h4'} sx={{ m: '1px' }}><b>{tabellino.golSegnati}</b></Typography>
                            </Grid>
                        </Grid>
                    )}
                        titleTypographyProps={{ variant: 'h5' }}
                        subheader={`Modulo: ${tabellino.modulo} ${multa ?  `multa di ${Configurazione.importoMulta} €` : ''}`}
                        avatar={<Avatar alt={squadra ?? ''}
                            src={foto ?? ''}
                            sx={{ display: { xs: 'none', sm: 'block' }, mr: '5px' }}>
                        </Avatar>}
                    />
                    <CardContent>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={8}>
                                <Typography variant={'h6'} sx={{ m: '5px' }}><b>Titolari</b></Typography>
                            </Grid>
                            <Grid item sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant={'h6'} sx={{ m: '5px' }}><b>Panchina</b></Typography>
                            </Grid>

                            <Grid item xs={12} sm={7}>
                                <Grid container spacing={0}>
                                    {tabellino.Voti.filter(g => g.titolare).map((g, index) => (
                                        <Grid item xs={12} key={`tit_${index}`}>
                                            <Grid container spacing={0}>
                                                <Grid item sm={1.5} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                                    <Tooltip title={g.nomeSquadraSerieA}>
                                                        <Image src={`/images/maglie/${g.magliaSquadraSerieA ?? 'NoSerieA.gif'}`} width={30} height={26} alt={g.nome} />
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={2} sx={{ display: { xs: 'block', sm: 'none', backgroundColor: getColorByRuolo(g.ruolo) } }}>
                                                    <Tooltip title={g.nomeSquadraSerieA}>
                                                        <Image src={`/images/maglie/${g.magliaSquadraSerieA ?? 'NoSerieA.gif'}`} width={30} height={26} alt={g.nome} />
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={1} sm={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                                    <Typography variant="body2">{g.ruolo}</Typography>
                                                </Grid>
                                                <Grid item sm={4.5} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleStatGiocatore(g.idGiocatore)}>
                                                            {getShortName(g.nome)}
                                                        </Typography>
                                                        {g.isSostituito && <KeyboardDoubleArrowRightOutlined color='error' />}
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={6} sx={{ display: { xs: 'block', sm: 'none' } }}>
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleStatGiocatore(g.idGiocatore)}>
                                                            {getShortName(g.nome, 11)}
                                                        </Typography>
                                                        {g.isSostituito && <KeyboardDoubleArrowRightOutlined color='error' />}
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={2.5} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    {getVotoBonus(g.voto, g.gol, g.assist, g.autogol, g.altriBonus)}
                                                </Grid>
                                                <Grid item xs={1.5} sm={2}>
                                                    {g.ammonizione !== 0 ? <Style color='info' /> : g.espulsione !== 0 ? <Style color='error' /> : ''}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <Typography variant={'h6'}><b>Panchina</b></Typography>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <Grid container spacing={0}>
                                    {tabellino.Voti.filter(g => !g.titolare).map((g, index) => (
                                        <Grid item xs={12} key={`ris_${index}`}>
                                            <Grid container spacing={0}>
                                                <Grid item sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                                    <Tooltip title={g.nomeSquadraSerieA}>
                                                        <Image src={`/images/maglie/${g.magliaSquadraSerieA ?? 'NoSerieA.gif'}`} width={30} height={26} alt={g.nome} />
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={2} sx={{ display: { xs: 'block', sm: 'none', backgroundColor: getColorByRuolo(g.ruolo) } }}>
                                                    <Tooltip title={g.nomeSquadraSerieA}>
                                                        <Image src={`/images/maglie/${g.magliaSquadraSerieA ?? 'NoSerieA.gif'}`} width={30} height={26} alt={g.nome} />
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item sm={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                                    <Typography variant="body2">&nbsp;{g.ruolo}{g.riserva}</Typography>
                                                </Grid>
                                                <Grid item sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleStatGiocatore(g.idGiocatore)}>
                                                            {getShortName(g.nome)}
                                                        </Typography>
                                                        {g.isVotoInfluente && <KeyboardDoubleArrowLeftOutlined color='success' />}
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={6} sx={{ display: { xs: 'block', sm: 'none' } }}>
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleStatGiocatore(g.idGiocatore)}>
                                                            {getShortName(g.nome, 11)}
                                                        </Typography>
                                                        {g.isVotoInfluente && <KeyboardDoubleArrowLeftOutlined color='success' />}
                                                    </Stack>
                                                </Grid>
                                                <Grid item sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                                    {getVotoBonus(g.voto, g.gol, g.assist, g.autogol, g.altriBonus)}
                                                </Grid>
                                                <Grid item xs={2.5} sx={{ display: { xs: 'block', sm: 'none' } }}>
                                                    {getVotoBonus(g.voto, g.gol, g.assist, g.autogol, g.altriBonus)}
                                                </Grid>
                                                <Grid item xs={1.5} sm={1}>
                                                    {g.ammonizione !== 0 ? <Style color='info' /> : g.espulsione !== 0 ? <Style color='error' /> : ''}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={3} display={'flex'}>
                                <Typography variant={'h6'} sx={{ m: '5px' }}>
                                    Fantapunti: <b>{tabellino.fantapuntiTotale}</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant={'h6'} sx={{ m: '5px' }}>
                                    {tabellino.fattoreCasalingo > 0 && (<>Fattore casalingo: <b>+{tabellino.fattoreCasalingo}</b></>)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant={'h6'} sx={{ m: '5px' }}>
                                    {tabellino.bonusSenzaVoto > 0 && (<>Senza voto: <b>+{tabellino.bonusSenzaVoto}</b></>)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant={'h6'} sx={{ m: '5px' }}>
                                    {tabellino.bonusModulo > 0 && (<>Bonus modulo: <b>+{tabellino.bonusModulo}</b></>)}
                                </Typography>
                            </Grid>
                            
                        </Grid>
                    </CardContent>
                </Card>
            )
        }

        function getColorByRuolo(ruolo: string) {
            switch (ruolo) {
                case 'P':
                    return '#eff6ff';
                case 'D':
                    return '#ecfdf5';
                case 'C':
                    return '#fefce8';
                case 'A':
                    return '#fef2f2';
            }
        };

        function getVotoBonus(voto: number, gol: number, assist: number, autogol: number, altriBonus: number) {
            return <Typography variant="body2">
                {voto !== 0 ? voto : ''}
                {gol > 0 ? `+${gol}` : ''}
                {gol < 0 ? `${gol}` : ''}
                {assist > 0 ? `+${assist}` : ''}
                {autogol < 0 ? autogol : ''}
                {altriBonus < 0 ? altriBonus : ''}
            </Typography>;
        }
    };

    return (
        <>
            <Grid container spacing={0}>
                {tabelliniList.isLoading && (
                    <Grid item xs={12}>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress color="warning" />
                        </Box>
                    </Grid>
                )}
                {calendario && (
                    <>
                        <Grid item xs={9}>
                            <Typography variant={'h4'}>{calendario.Title}</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                            <Tooltip title="Home" placement="top-start">
                                <IconButton onClick={() => handleAction(FrameType.defaultHome)}>
                                    <Home color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={6} sx={isXs ? { pr: '1px' } : { pr: '10px' }}>
                            {renderTabellino(tabellinoHome, infoPartita?.squadraHome, infoPartita?.fotoHome, infoPartita?.multaHome)}
                        </Grid>
                        <Grid item xs={6} sx={isXs ? { pl: '1px' } : { pl: '10px' }}>
                            {renderTabellino(tabellinoAway, infoPartita?.squadraAway, infoPartita?.fotoAway, infoPartita?.multaAway)}
                        </Grid>
                    </>
                )}
                <Grid item xs={12} sx={{ height: '100px' }}>
                    <></>
                </Grid>
            </Grid>

            <Modal title={'Statistica giocatore'} open={openModalCalendario} onClose={handleModalClose} width={isXs ? '98%' : '1266px'} height={isXs ? '98%' : ''} >
                <Divider />
                <Box sx={{ mt: 1, gap: '0px', flexWrap: 'wrap' }}>
                    <Giocatori idGiocatore={idGiocatore} onActionChange={() => { if (false) {} }} removeNav={true}></Giocatori>
                </Box>
            </Modal>
        </>
    )
}

export default ViewTabellini;