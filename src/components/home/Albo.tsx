import React from 'react';
import { api } from "~/utils/api";
import DataTable, { type Column } from "~/components/tables/datatable";
import { Box, CircularProgress } from "@mui/material";


export default function Albo() {
    const alboList = api.albo.list.useQuery(undefined, { refetchOnWindowFocus: false, refetchOnReconnect: false });
    
    const columns: Column[] = [
        { key: "stagione", type: "string", align:'left'},
        { key: "campionato", type: "string", align:'left'},
        { key: "champions", type: "string", align:'left'},
        { key: "secondo", type: "string", align:'left'},
        { key: "terzo", type: "string", align:'left'},
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
                    data={alboList.data}
                    errorMessage={''}
                    columns={columns}
                />
            )}

            
        </>);
}