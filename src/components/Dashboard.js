import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
const fetchWeatherData = async (latitude, longitude) => {
  const payload = {
    body: JSON.stringify({ latitude, longitude }), // Conteúdo aninhado em "body" como string
  };

  const response = await fetch(
    "https://aw1gwngj0h.execute-api.us-east-1.amazonaws.com/dev/weather-info",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Serializa o payload completo
    }
  );

  if (!response.ok) {
    throw new Error(`Erro ao conectar à API: ${response.statusText}`);
  }

  const responseData = await response.json();

  // Parse do corpo, que é uma string JSON
  const parsedBody = JSON.parse(responseData.body);
  return parsedBody;
};

const Dashboard = () => {
  const location = useLocation();
  const { latitude, longitude } = location.state || {};
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeatherData(latitude, longitude);
        setWeatherData(data); // Armazena os dados recebidos
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ marginTop: "2rem", textAlign: "center" }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Climático
      </Typography>
      <Typography variant="subtitle1">
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
        <Typography sx={{ marginTop: "1rem" }}>Nenhum dado disponível.</Typography>
      )}
    </Container>
  );
  
};

export default Dashboard;
