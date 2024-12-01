import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";

const Login = ({ setUsername }) => {
  const [username, setLocalUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://yvv8xenqud.execute-api.us-east-1.amazonaws.com/dev/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: JSON.stringify({ username, email, password }),
          }),
        }
      );

      const rawData = await response.json();
      const data = JSON.parse(rawData.body);

      if (rawData.statusCode === 200 && data.token) {
        localStorage.setItem("authToken", data.token);
        sessionStorage.setItem("username", username);
        setUsername(username);
        navigate("/");
      } else {
        throw new Error(data.message || "Erro ao realizar login");
      }
    } catch (err) {
      setError(err.message || "Algo deu errado, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #141e30, #243b55)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 400,
          width: "90%",
          padding: 4,
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#00e676",
            marginBottom: 3,
          }}
        >
          Login
        </Typography>
        {error && (
          <Alert
            severity="error"
            sx={{
              marginBottom: 2,
              background: "rgba(255, 0, 0, 0.2)",
              color: "#ff6f61",
            }}
          >
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleLogin} sx={{ marginTop: 2 }}>
          <TextField
            label="Usuário"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setLocalUsername(e.target.value)}
            required
            InputProps={{
              style: { color: "#ffffff" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#00e676",
                },
                "&:hover fieldset": {
                  borderColor: "#00c853",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00e676",
                },
              },
            }}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              style: { color: "#ffffff" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#00e676",
                },
                "&:hover fieldset": {
                  borderColor: "#00c853",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00e676",
                },
              },
            }}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              style: { color: "#ffffff" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#00e676",
                },
                "&:hover fieldset": {
                  borderColor: "#00c853",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00e676",
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              mt: 3,
              backgroundColor: "#00e676",
              color: "#121212",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#00c853",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Entrar"
            )}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              mt: 2,
              borderColor: "#00e676",
              color: "#00e676",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#00c853",
                color: "#121212",
              },
            }}
            onClick={() => navigate("/register")}
          >
            Registrar-se
          </Button>
        </Box>
      </Paper>
    </Box>
  );
  
};

export default Login;
