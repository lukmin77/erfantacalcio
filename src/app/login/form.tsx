"use client";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { type ChangeEvent, useState } from "react";
import { z } from "zod";

//import material ui
import { Button, TextField, Box, Typography } from '@mui/material';

const LoginFormSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6)
});

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validationResult = LoginFormSchema.safeParse(formValues);
      if (!validationResult.success) {
        //const validationErrors = validationResult.error.issues.map(issue => issue.message);
        //const errorMessage = Object.values(validationErrors).join(", ");
        //setError(errorMessage);
        throw new Error("Compilare i campi");
      }
      else {
        setLoading(true);
        setFormValues({ username: "", password: "" });

        const res = await signIn("erFantacalcio", {
          redirect: false,
          username: formValues.username,
          password: formValues.password,
          callbackUrl,
        });

        setLoading(false);
        if (!res?.error) {
          router.push(callbackUrl);
        } else {
          setError("invalid username or password");
        }
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : 'Unknown Error');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  
  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
      {error && (
        <Typography color="error.main" variant="h4">{error}</Typography>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        onChange={handleChange}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        fullWidth
        color="info"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? "loading..." : "Sign in"}
      </Button>
    </Box>
  );
};
