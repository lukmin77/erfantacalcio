import React from 'react';
import { api } from "~/utils/api";
import DataTable, { type Column } from "~/components/tables/datatable";
import { Box, CircularProgress } from "@mui/material";


export default function Albo() {
    const alboList = api.albo.list.useQuery(undefined, { refetchOnWindowFocus: false, refetchOnReconnect: false });
    
    const columns: Column[] = [
        { key: "stagione", type: "string", align:'left'},
        { key: "squadra", type: "string", align: 'left', hiddenOnlyOnXs: true },
        { key: "presidente", type: "string", align:'left'},
        { key: "campionato", type: "string", align:'center'},
        { key: "champions", type: "string", align:'center'},
        { key: "secondo", type: "string", align:'center'},
        { key: "terzo", type: "string", align:'center'},
    ];

    return (
        <>
            {alboList.isLoading ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress color="warning" />
                </Box>
            ) : (
                <DataTable
                    title={`Albo d'oro`}
                    pagination={false}
                    rowsXPage={14}
                    data={alboList.data}
                    errorMessage={''}
                    columns={columns}
                />
            )}

            
        </>);
}