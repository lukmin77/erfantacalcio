import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AddAPhoto, Calculate, CalendarMonth, FiberNew, Group, ManageAccounts, ThumbsUpDown, UploadFile } from '@mui/icons-material';

const listItem = (
    key: string,
    link: string,
    title: string,
    icon: React.JSX.Element
) => {
    return (
        <ListItemButton key={key} href={link} sx={{ p: 1 }}>
            <ListItemIcon sx={{mr:2}}>{icon}</ListItemIcon>
            <ListItemText secondary={title} />
        </ListItemButton>
    );

};


export function adminListItems() {

    return [
        listItem('admin_upload', "/uploadVoti", "Carica voti", <UploadFile color='primary' />),
        listItem('admin_risultati', "/risultati", "Risultati", <Calculate color='primary' />),
        listItem('admin_calendario', "/calendario", "Calendario", <CalendarMonth color='primary' />),
        listItem('admin_presidenti', "/presidenti", "Squadre", <Group color='primary' />),
        listItem('admin_giocatori', "/giocatori", "Giocatori", <ManageAccounts color='primary' />),
        listItem('admin_voti', "/voti", "Voti", <ThumbsUpDown color='primary' />),
        listItem('admin_nuova_stagione', "/avvioStagione", "Nuova stagione", <FiberNew color='primary' />)
    ]
}

export function guestListItems() {
    return[
        listItem('guest_profilo', "/foto", "Foto profilo", <AddAPhoto color='primary' />),
        /* listItem('guest_changepwd', "/profilo", "Cambio password", <Pin color='primary' />) */
    ];
}
