import { Box, CircularProgress, FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography, Zoom, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useTheme } from '@mui/material/styles';
import { type iGiocatoreStats } from "~/types/giocatori";
import AutocompleteTextbox, { type iElements } from "~/components/autocomplete/AutocompleteGiocatore";
import DataTable, { type ActionOptions, type Column, type Rows } from "~/components/tables/datatable";
import { type Ruoli } from "~/types/common";
import { getRuoloEsteso } from "~/utils/helper";
import { BarChartOutlined, Home, PersonSearch } from "@mui/icons-material";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { LineChart } from '@mui/x-charts/LineChart';
import Image from "next/image";
import { FrameType } from "~/utils/enums";

interface GiocatoriProps {
    onActionChange: (action: FrameType, idGiocatore?: number) => void;
    idGiocatore?: number;
    removeNav?: boolean
}

function Giocatori({ onActionChange: onActionActive, idGiocatore, removeNav }: GiocatoriProps) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedGiocatoreId, setSelectedGiocatoreId] = useState<number>();
    const giocatoriList = api.giocatori.listAll.useQuery(undefined, { enabled: !selectedGiocatoreId, refetchOnWindowFocus: false, refetchOnReconnect: false });
    const [ruolo, setRuolo] = useState<Ruoli>('C');
    const giocatoriStats = api.giocatori.listStatistiche.useQuery({ ruolo: ruolo }, { refetchOnWindowFocus: false, refetchOnReconnect: false });
    const giocatoreProfilo = api.giocatori.getStatistica.useQuery({ idGiocatore: selectedGiocatoreId! }, { enabled: !!selectedGiocatoreId, refetchOnWindowFocus: false, refetchOnReconnect: false });
    const giocatoreVoti = api.voti.getStatisticaVoti.useQuery({ idGiocatore: selectedGiocatoreId! }, { enabled: !!selectedGiocatoreId, refetchOnWindowFocus: false, refetchOnReconnect: false });
    const giocatoreTrasferimenti = api.trasferimenti.list.useQuery({ idGiocatore: selectedGiocatoreId! }, { enabled: !!selectedGiocatoreId, refetchOnWindowFocus: false, refetchOnReconnect: false });
    const giocatoreStatsStagioni = api.trasferimenti.statsStagioni.useQuery({ idGiocatore: selectedGiocatoreId! }, { enabled: !!selectedGiocatoreId, refetchOnWindowFocus: false, refetchOnReconnect: false });
    const [giocatori, setGiocatori] = useState<iElements[]>([]);

    const handleAction = (newFrame: FrameType, idGiocatore?: number) => {
        onActionActive(newFrame, idGiocatore);
    };

    useEffect(() => {
        if (giocatoriList.data) {
            setGiocatori(giocatoriList.data);
            setSelectedGiocatoreId(idGiocatore);
        }
    }, [giocatoriList.data, idGiocatore]);

    const handleGiocatoreSelected = async (idGiocatore: number | undefined) => {
        setSelectedGiocatoreId(idGiocatore);
    };

    const columns: Column[] = [
        { key: "idgiocatore", width: '5%', type: "number", align: "left", visible: false },
        {
            key: "maglia", type: "image", align: "left", header: ' ', width: '5%', imageProps:
                { imageTooltip: 'squadraSerieA', imageTooltipType: 'dynamic', imageWidth: 26, imageHeight: 22 }
        },
        { key: "nome", type: "string", align: "left", header: "Nome", sortable: true },
        { key: "squadra", type: "string", align: "left", header: "Squadra", sortable: true },
        { key: "media", type: "number", header: "Media", sortable: true },
        { key: "golfatti", type: "number", header: "Gol", visible: ruolo === 'P' ? false : true, sortable: true },
        { key: "golsubiti", type: "number", header: "Gol", visible: ruolo === 'P' ? true : false, sortable: true },
        { key: "assist", type: "number", header: "Assist", sortable: true },
        { key: "giocate", type: "number", header: "Giocate", sortable: true, hiddenOnlyOnXs: true },
        { key: "", width: '5%', type: "action", align: "right", header: "Statistica" }
    ];

    const actionView = (idGiocatore: string) => {
        return (
            <div>
                <Tooltip title={"Vedi statistica"} onClick={() => setSelectedGiocatoreId(parseInt(idGiocatore))} placement="left">
                    <BarChartOutlined color="success" />
                </Tooltip>
            </div>
        )
    };

    const actionOptions: ActionOptions[] = [
        {
            keyFields: ['idgiocatore'],
            component: actionView
        }
    ];

    const mapStatsToRows = (stats: iGiocatoreStats[] | undefined): Rows[] | undefined => {
        if (!stats) {
            return undefined;
        }

        return stats.map(stat => ({
            media: stat.media,
            mediabonus: stat.mediabonus,
            golfatti: stat.golfatti,
            golsubiti: stat.golsubiti,
            assist: stat.assist,
            ammonizioni: stat.ammonizioni,
            espulsioni: stat.espulsioni,
            giocate: stat.giocate,
            ruolo: stat.ruolo,
            nome: stat.nome,
            nomefantagazzetta: stat.nomefantagazzetta,
            idgiocatore: stat.idgiocatore,
            maglia: `/images/maglie/${stat.maglia}`,
            squadraSerieA: stat.squadraSerieA,
            squadra: stat.squadra,
            idSquadra: stat.idSquadra,
        }));
    };

    //#region bar graph 
    const valueFormatter = (value: number | null) => `${value}`;

    const chartSetting = {
        yAxis: [
            {
                label: 'Statistiche stagioni',
            },
        ],
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(0px, 0)',
            },
        },
    };

    const customizegraphstagioni = {
        height: 280,
        legend: { hidden: false },
        margin: { top: 5 },

    };
    //#endregion

    //#region line graph 

    const keyToLabel: Record<string, string> = {
        voto: 'Voto',
        gol: 'Gol',
        assist: 'Assist',
        ammonizione: 'Ammonizioni',
        espulsione: 'Espulsioni',
    };

    const stackStrategy = {
        stack: 'total',
        area: false,
        stackOffset: 'none',
    } as const;

    const customizegraphvoti = {
        height: 280,
        legend: { hidden: false },
        margin: { top: 5 },
        stackingOrder: 'descending',
    };

    //#endregion

    //#region trasferimenti

    const columnsTransfer: Column[] = [
        {
            key: "maglia", type: "image", align: "left", header: ' ', width: '5%', imageProps:
                { imageTooltip: 'squadraSerieA', imageTooltipType: 'dynamic', imageWidth: 26, imageHeight: 22 }
        },
        { key: "stagione", type: "string", align: "left", header: "Stagione" },
        { key: "squadra", type: "string", align: "left", header: "Squadra" },
        { key: "dataAcquisto", type: "date", header: "Data acquisto", formatDate: 'dd/MM/yyyy' },
        { key: "dataCessione", type: "date", header: "Data cessione", formatDate: 'dd/MM/yyyy', hiddenOnlyOnXs: true },
        { key: "costo", type: "number", header: "Costo" },
    ];

    //#endregion

    return (
        <Grid container spacing={1} paddingTop={2} paddingBottom={2}>
            {(giocatoriList.isLoading || giocatoriStats.isLoading) ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress color="warning" />
                </Box>
            ) : (
                <>
                    <Grid item xs={11}>
                        <Typography variant="h4">{giocatoreProfilo.data ? `Statistiche ${giocatoreProfilo.data.nome}` : 'Statistiche Giocatori'}</Typography>
                    </Grid>
                    <Grid item xs={1} display={'flex'} justifyContent={'flex-end'} alignItems={'baseline'}>
                        {(removeNav === undefined || removeNav === false) &&
                            (
                                <>
                                    {selectedGiocatoreId && (
                                        <Tooltip title="Ricerca giocatori" placement="top-start">
                                            <IconButton onClick={() => setSelectedGiocatoreId(undefined)}>
                                                <PersonSearch color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Home" placement="top-start">
                                        <IconButton onClick={() => handleAction(FrameType.defaultHome)}>
                                            <Home color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                    </Grid>
                    {!selectedGiocatoreId && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel control={<Switch color="info" onChange={() => setRuolo('P')} checked={ruolo === 'P'} />} label={isXs ? 'P' : getRuoloEsteso('P', true)} />
                                <FormControlLabel control={<Switch color="warning" onChange={() => setRuolo('D')} checked={ruolo === 'D'} />} label={isXs ? 'D' : getRuoloEsteso('D', true)} />
                                <FormControlLabel control={<Switch color="success" onChange={() => setRuolo('C')} checked={ruolo === 'C'} />} label={isXs ? 'C' : getRuoloEsteso('C', true)} />
                                <FormControlLabel control={<Switch color="error" onChange={() => setRuolo('A')} checked={ruolo === 'A'} />} label={isXs ? 'A' : getRuoloEsteso('A', true)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <AutocompleteTextbox onItemSelected={handleGiocatoreSelected} items={giocatori ?? []} />
                            </Grid>
                            <Zoom in={true}>
                                <Grid item xs={12}>
                                    <DataTable
                                        title={`Top ${getRuoloEsteso(ruolo, true)}`}
                                        pagination={false}
                                        messageWhenEmptyList="Nessun giocatore presente"
                                        data={mapStatsToRows(giocatoriStats.data)}
                                        columns={columns}
                                        actionOptions={actionOptions}
                                        rowsXPage={15}
                                    />
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                </Grid>
                            </Zoom>
                        </>
                    )}
                    {selectedGiocatoreId && giocatoreProfilo.data && (
                        <>
                            <Grid item xs={12} sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Grid container>
                                    <Grid item sm={4}>
                                        <Image src={giocatoreProfilo.data.urlCampioncino} width={164} height={242} alt={giocatoreProfilo.data.nome} />
                                    </Grid>
                                    <Grid item sm={4}>
                                        <Typography variant="h5">
                                            Media: {giocatoreProfilo.data.media}
                                            <br></br>
                                            Gol: {giocatoreProfilo.data.gol}
                                            <br></br>
                                            Assist: {giocatoreProfilo.data.assist}
                                            <br></br>
                                            Ammonizioni: {giocatoreProfilo.data.ammonizioni}
                                            <br></br>
                                            Espulsioni: {giocatoreProfilo.data.espulsioni}
                                            <br></br>
                                            Giocate: {giocatoreProfilo.data.giocate}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={4}>
                                        <Typography variant="h5">
                                            Ruolo: {giocatoreProfilo.data.ruoloEsteso}
                                            <br></br>
                                            Costo: {giocatoreProfilo.data.costo}
                                            <br></br>
                                            Squadra serie A: {giocatoreProfilo.data.squadraSerieA}
                                            <br></br>
                                            Squadra: {giocatoreProfilo.data.squadra}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="h6">
                                            Media: {giocatoreProfilo.data.media}
                                            <br></br>
                                            Gol: {giocatoreProfilo.data.gol}
                                            <br></br>
                                            Assist: {giocatoreProfilo.data.assist}
                                            <br></br>
                                            Ammonizioni: {giocatoreProfilo.data.ammonizioni}
                                            <br></br>
                                            Espulsioni: {giocatoreProfilo.data.espulsioni}
                                            <br></br>
                                            Giocate: {giocatoreProfilo.data.giocate}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="h6">
                                            Ruolo: {giocatoreProfilo.data.ruoloEsteso}
                                            <br></br>
                                            Costo: {giocatoreProfilo.data.costo}
                                            <br></br>
                                            Squadra serie A: {giocatoreProfilo.data.squadraSerieA}
                                            <br></br>
                                            Squadra: {giocatoreProfilo.data.squadra}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    )}
                    {selectedGiocatoreId && giocatoreVoti.data && (
                        <Zoom in={true}>
                            <Grid item xs={12} sm={6} display={'flex'} justifyContent={'flex-end'}>
                                <LineChart
                                    yAxis={[
                                        {
                                            min: 0,
                                            max: 10,
                                            label: 'Voti stagionali',
                                            colorMap: {
                                                type: 'piecewise',
                                                thresholds: [6, 10],
                                                colors: ['red', 'green']
                                            }
                                        }
                                    ]}
                                    xAxis={[
                                        {
                                            dataKey: 'giornataSerieA',
                                            valueFormatter: (value) => `Giornata ${value}`,
                                            min: 1,
                                            max: 38
                                        },
                                    ]}
                                    series={Object.keys(keyToLabel).filter(c => c === 'voto').map((key) => ({
                                        dataKey: key,
                                        label: keyToLabel[key],
                                        valueFormatter: (value, item) => {
                                            const dataIndex = item.dataIndex;
                                            return value === null ? '' : `${value} - Gol: ${giocatoreVoti?.data[dataIndex]?.gol ?? 0} - Assist: ${giocatoreVoti?.data[dataIndex]?.assist ?? 0} ${(giocatoreVoti?.data[dataIndex]?.ammonizione ?? 0) !== 0 ? ' - Ammonizione' : ''} ${(giocatoreVoti?.data[dataIndex]?.espulsione ?? 0) !== 0 ? '- Espulsione' : ''}`;
                                        },
                                        showMark: true,
                                        ...stackStrategy,
                                    }))}
                                    grid={{ vertical: true, horizontal: true }}
                                    dataset={giocatoreVoti.data}
                                    {...customizegraphvoti}
                                />
                            </Grid>
                        </Zoom>
                    )}
                    {selectedGiocatoreId && giocatoreTrasferimenti.data && (
                        <Zoom in={true}>
                            <Grid item xs={12} sm={6}>
                                <DataTable
                                    title={`Trasferimenti giocatore`}
                                    pagination={false}
                                    rowsXPage={5}
                                    messageWhenEmptyList="Nessun giocatore presente"
                                    data={giocatoreTrasferimenti.data}
                                    columns={columnsTransfer}
                                />
                            </Grid>
                        </Zoom>
                    )}
                    {selectedGiocatoreId && giocatoreStatsStagioni.data && (
                        <Zoom in={true}>
                            <Grid item xs={12} sm={6} display={'flex'} justifyContent={'flex-end'}>
                                <BarChart
                                    dataset={giocatoreStatsStagioni.data}
                                    xAxis={[{ scaleType: 'band', dataKey: 'stagione' }]}
                                    series={[
                                        { dataKey: 'media', label: 'Media', valueFormatter },
                                        { dataKey: 'gol', label: 'Gol', valueFormatter },
                                        { dataKey: 'assist', label: 'Assist', valueFormatter },
                                        { dataKey: 'giocate', label: 'Giocate', valueFormatter },
                                    ]}
                                    {...chartSetting}
                                    {...customizegraphstagioni}
                                />
                            </Grid>
                        </Zoom>
                    )}
                </>
            )}
        </Grid>
    )


}

export default Giocatori;