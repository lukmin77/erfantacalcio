import { LoginForm } from "./form";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Suspense } from 'react'

export default function LoginPage() {

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'info.dark' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5" color="primary">
                    Sign in
                </Typography>
            </Box>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </Container>
    );
}
