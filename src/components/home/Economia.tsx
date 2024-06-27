import React from 'react';
import { api } from "~/utils/api";
import DataTable, { type Column } from "~/components/tables/datatable";
import { Box, CircularProgress } from "@mui/material";


export default function Economia() {
    const economiaList = api.squadre.list.useQuery(undefined, { refetchOnWindowFocus: false, refetchOnReconnect: false });

    const columns: Column[] = [
        {
            key: "foto", type: "image", align: 'left', header: ' ', width: '1%', imageProps:
                { imageTooltip: 'presidente', imageTooltipType: 'dynamic', imageWidth: 36, imageHeight: 36 }
        },
        { key: "squadra", type: "string", align: 'left', hiddenOnlyOnXs: true, header: 'Squadra' },
        { key: "presidente", type: "string", align: 'left', header: 'Presidente' },
        { key: "importoAnnuale", type: "currency", align: 'right', header: 'Quota', currency: ' €' },
        { key: "importoMulte", type: "currency", align: 'right', header: 'Multe', currency: ' €' },
        { key: "importoMercato", type: "currency", align: 'right', header: 'Mercato', currency: ' €' },
        { key: "fantamilioni", type: "number", align: 'right', header: 'Fantamilioni' },
    ];

    return (
        <>
            {economiaList.isLoading ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress color="warning" />
                </Box>
            ) : (
                <DataTable
                    title={`Economia squadre`}
                    pagination={false}
                    data={economiaList.data}
                    errorMessage={''}
                    columns={columns}
                />
            )}


        </>);
}