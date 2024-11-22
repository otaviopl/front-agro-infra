import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchLambdaData, getMaxHourValues } from "../services/generalOperation"
import DashboardData from "./dashData";
import SummaryDisplay from "./Summary";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Button,
  Grid,
} from "@mui/material";


const Dashboard = () => {
  const location = useLocation();
  const { latitude, longitude } = location.state || {};

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extraData, setExtraData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [plantioButtonText, setPlantioButtonText] = useState(
    "Buscar dados de plantio e colheita"
  );
  const [plantioData, setPlantioData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLambdaData(
          "https://yvv8xenqud.execute-api.us-east-1.amazonaws.com/dev/weather-info",
          latitude,
          longitude
        );
        setWeatherData(data);
      } catch (err) {
        console.error("Erro ao buscar dados climáticos:", err);
        setError("Erro ao buscar dados climáticos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchData();
    } else {
      setError("Localização não fornecida.");
      setLoading(false);
    }
  }, [latitude, longitude]);

  const handleExtraDataFetch = async (baseUrl, params = {}) => {
    try {
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
        throw new Error(`Erro ao buscar dados extras: ${response.statusText}`);
      }

      const data = await response.json();
      setExtraData(data);
    } catch (err) {
      console.error("Erro ao buscar dados extras:", err);
      setError("Erro ao buscar dados extras.");
    }
  };
const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
const handlePlantioFetch = async () => {
  try {
    if (plantioButtonText === "Buscar dados de plantio e colheita") {
      const response = await fetch(
        "https://yvv8xenqud.execute-api.us-east-1.amazonaws.com/dev/cultures",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao buscar dados de plantio e colheita: ${response.statusText}`
        );
      }

      const data = await response.json();
      setPlantioData(data);
      setPlantioButtonText("Gerar Resumo");
    } else if (plantioButtonText === "Gerar Resumo") {
      if (!plantioData) {
        setError("Dados de plantio indisponíveis para gerar resumo.");
        return;
      }

      setIsGeneratingSummary(true);

      const simplifiedAlerts = getMaxHourValues(extraData);
      const combinedData = {
        body: JSON.stringify({
          ...JSON.parse(plantioData.body),
          cultures: JSON.parse(plantioData.body).cultures,
          alerts: simplifiedAlerts,
        }),
      };

      const interpretResponse = await fetch(
        "https://yvv8xenqud.execute-api.us-east-1.amazonaws.com/dev/interpret",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(combinedData),
        }
      );

      if (!interpretResponse.ok) {
        throw new Error(
          `Erro ao gerar resumo: ${interpretResponse.statusText}`
        );
      }

      const summary = await interpretResponse.json();
      const parsedSummary = JSON.parse(summary.body);
      try{
        setSummaryData(parsedSummary.interpretation);
        console.log(parsedSummary)
        setIsGeneratingSummary(false);
      }catch{
        console.log('error api openAi')
      }

      }
  } catch (err) {
    console.error(err.message);
    setError(err.message);
    setIsGeneratingSummary(false);
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
  console.log(summaryData)

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
                      "https://yvv8xenqud.execute-api.us-east-1.amazonaws.com/dev/alerts-info",
                      {
                        latitude,
                        longitude,
                        date: new Date(
                          new Date().setDate(new Date().getDate() - 1)
                        )
                          .toISOString()
                          .split("T")[0],
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
                  onClick={handlePlantioFetch}
                >
                  {plantioButtonText}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {extraData && <DashboardData data={extraData} />}
          <SummaryDisplay
            summary={summaryData}
            loading={isGeneratingSummary}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;