import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Button,
  Grid,
} from "@mui/material";

const fetchLambdaData = async (url, latitude, longitude) => {
  const payload = {
    body: JSON.stringify({ latitude, longitude }),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erro ao conectar à API: ${response.statusText}`);
  }

  const responseData = await response.json();
  const parsedBody = JSON.parse(responseData.body);
  return parsedBody;
};

const Dashboard = () => {
  const location = useLocation();
  const { latitude, longitude } = location.state || {};
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [extraData, setExtraData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLambdaData(
          "https://aw1gwngj0h.execute-api.us-east-1.amazonaws.com/dev/weather-info",
          latitude,
          longitude
        );
        console.log(data)
        setWeatherData(data);
      } catch (err) {
        console.error("Erro ao buscar dados climáticos:", err);
        setError("Erro ao buscar dados climáticos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) fetchData();
    else {
      setError("Localização não fornecida.");
      setLoading(false);
    }
  }, [latitude, longitude]);

  const handleExtraDataFetch = async (baseUrl, params = {}) => {
    try {
      // Construir a URL com parâmetros de consulta
      const url = new URL(baseUrl);
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
  
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
      }
  
      const data = await response.json();
      setExtraData(data);
    } catch (err) {
      console.error("Erro ao buscar dados extras:", err);
      setError("Erro ao buscar dados extras.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#121212",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#121212",
          color: "#e0e0e0",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        padding: "2rem",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            backgroundColor: "#1e1e1e",
            color: "#e0e0e0",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h4" gutterBottom color="primary">
            Dashboard Climático
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Latitude: {latitude}, Longitude: {longitude}
          </Typography>
          {weatherData ? (
            <Box sx={{ marginTop: "2rem" }}>
              <Typography variant="h6">Dados Climáticos:</Typography>
              <Typography>Local: {weatherData.location}</Typography>
              <Typography>Temperatura: {weatherData.temperature}°C</Typography>
              <Typography>Umidade: {weatherData.humidity}%</Typography>
              <Typography>Clima: {weatherData.weather}</Typography>
            </Box>
          ) : (
            <Typography sx={{ marginTop: "1rem" }}>
              Nenhum dado disponível.
            </Typography>
          )}

          {/* Botões para ativar outras Lambdas */}
          <Box sx={{ marginTop: "2rem" }}>
            <Typography variant="h6" gutterBottom>
              Ações adicionais
            </Typography>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() =>
                  handleExtraDataFetch(
                    "https://aw1gwngj0h.execute-api.us-east-1.amazonaws.com/dev/alerts-info",
                    {
                      latitude,
                      longitude,
                      date: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
                    }
                  )
                }
              >
                Buscar histórico com base na Localização
              </Button>
            </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() =>
                    handleExtraDataFetch(
                      "https://aw1gwngj0h.execute-api.us-east-1.amazonaws.com/dev/forecast-info"
                    )
                  }
                >
                  Buscar previsão do tempo
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Dados extras */}
          {extraData && (
            <Box sx={{ marginTop: "2rem" }}>
              <Typography variant="h6">Dados Extras:</Typography>
              <Typography>{JSON.stringify(extraData)}</Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;