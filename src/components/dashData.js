import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale, // Escala categórica para labels
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const formatChartData = (data, label, color) => ({
  labels: data.map((item) => `${item.horas}h`), // Rótulos das horas
  datasets: [
    {
      label: label,
      data: data.map((item) => item.valor), // Valores das variáveis
      borderColor: color,
      backgroundColor: `${color}80`,
      fill: true,
    },
  ],
});

const DashboardData = ({ data }) => {
  if (!data) {
    return <Typography variant="body1">Nenhum dado disponível.</Typography>;
  }

  return (
    <Box sx={{ marginTop: "2rem" }}>
      <Typography variant="h6">Resumo Climático</Typography>

      <Grid container spacing={3} sx={{ marginTop: "1rem" }}>
        {/* Temperatura Máxima */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: 2,
              backgroundColor: "#1e1e1e",
              color: "#e0e0e0",
            }}
          >
            <Typography variant="subtitle1">Temperatura Máxima (°C)</Typography>
            <Line
              data={formatChartData(
                data.tmax2m,
                "Temperatura Máxima",
                "rgba(255,99,132,1)"
              )}
            />
          </Paper>
        </Grid>

        {/* Horas de Sol */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: 2,
              backgroundColor: "#1e1e1e",
              color: "#e0e0e0",
            }}
          >
            <Typography variant="subtitle1">Horas de Sol</Typography>
            <Line
              data={formatChartData(
                data.sunsdsfc,
                "Horas de Sol",
                "rgba(54,162,235,1)"
              )}
            />
          </Paper>
        </Grid>

        {/* Umidade do Solo */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: 2,
              backgroundColor: "#1e1e1e",
              color: "#e0e0e0",
            }}
          >
            <Typography variant="subtitle1">Umidade do Solo (0-10 cm)</Typography>
            <Line
              data={formatChartData(
                data.soill0_10cm,
                "Umidade do Solo",
                "rgba(75,192,192,1)"
              )}
            />
          </Paper>
        </Grid>

        {/* Temperatura Mínima */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: 2,
              backgroundColor: "#1e1e1e",
              color: "#e0e0e0",
            }}
          >
            <Typography variant="subtitle1">Temperatura Mínima (°C)</Typography>
            <Line
              data={formatChartData(
                data.tmin2m,
                "Temperatura Mínima",
                "rgba(153,102,255,1)"
              )}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardData;
