import React, { useEffect, useState } from 'react';
import { api } from "~/utils/api";
import DataTable, { ActionOptions, type Column } from "~/components/tables/datatable";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import { type ClassificaType } from '~/types/classifica';
import { getNomeTorneo } from '~/utils/helper';
import { QueryStats } from '@mui/icons-material';
import { FrameType } from '~/utils/enums';

interface ClassificaProps {
    nomeTorneo: string;
    idTorneo: number | undefined;
    gruppo: string | null;
  }

export default function Classifica({nomeTorneo = '', idTorneo = undefined, gruppo = null}: ClassificaProps) {
    const classificaList = api.classifica.list.useQuery({ idTorneo: idTorneo! }, { enabled: !!idTorneo, refetchOnWindowFocus: false, refetchOnReconnect: false });
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState<ClassificaType[]>([]);
    
    useEffect(() => {
        if (!classificaList.isFetching && classificaList.isSuccess && classificaList.data) {
            setData(classificaList.data);
        }
    }, [classificaList.data, classificaList.isSuccess, classificaList.isFetching]);

    
    useEffect(() => {
        if (classificaList.isError) {
            setErrorMessage('Si è verificato un errore in fase di caricamento');
        }
    }, [classificaList.isError]);
   

    const columns: Column[] = [
        { key: "idSquadra", type: "number", align: "left", visible: false },
        { key: "squadra", type: "string", align: "left", header: "Squadra" },
        { key: "punti", type: "number", align: "right", header: "Punti" },
        { key: "golFatti", type: "number", align: "right", header: "Gol+" },
        { key: "golSubiti", type: "number", align: "right", header: "Gol-" },
        { key: "giocate", type: "number", align: "right", header: "Giocate" },
        { key: "fantapunti", type: "number", align: "right", header: "Fantapunti" },
        { key: "", type: "action", align: "center", width: "1%" }
    ];

    const handleAction = (newFrame: FrameType, idSquadra?: number, squadra?: string) => {
        //onActionActive(newFrame, idSquadra, squadra);
    };

    const actionViewSquadra = (idSquadra: string, squadra: string) => {
        return (
            <div>
                <Tooltip title={"Modifica"} onClick={() => handleAction(FrameType.statisticheSquadra, +idSquadra, squadra)} placement="left">
                    <QueryStats color='warning' />
                </Tooltip>
            </div>
        )
    };

    const actionOptions: ActionOptions[] = [
        {
            keyFields: ['idSquadra', 'squadra'],
            component: actionViewSquadra
        }
    ];

    return (
        <>
            {classificaList.isLoading ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress color="warning" />
                </Box>
            ) : (
                <DataTable
                    title={`Classifica ${getNomeTorneo(nomeTorneo, gruppo)}`}
                    pagination={false}
                    data={data}
                    errorMessage={errorMessage}
                    columns={columns}
                />
            )}

            
        </>);
}