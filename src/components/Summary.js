import React from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";

const SummaryDisplay = ({ summary, loading }) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "30vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!summary) {
    return (
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{
          textAlign: "center",
          marginTop: "1rem",
        }}
      >
        Nenhum resumo gerado ainda.
      </Typography>
    );
  }

  // Dividindo o conteúdo do resumo em partes
  const sections = summary.split("\n\n"); // Divide as seções por parágrafo duplo
  const header = sections[0]; // A introdução do resumo
  const suggestions = sections.slice(1); // O restante são sugestões ou detalhes

  return (
    <Card
      elevation={6}
      sx={{
        margin: "2rem auto",
        maxWidth: "600px",
        backgroundColor: "#00000",
      }}
    >
      <CardContent>
        {/* Título do Resumo */}
        <Typography variant="h5" color="primary" gutterBottom>
          Resultado da Interpretação
        </Typography>

        {/* Introdução do Resumo */}
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-line",
            textAlign: "justify",
            marginTop: "1rem",
          }}
        >
          {header}
        </Typography>

        {/* Sugestões de Culturas */}
        <Box sx={{ marginTop: "1.5rem" }}>
          <Typography variant="h6" color="secondary" gutterBottom>
            Sugestões de Culturas:
          </Typography>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <Typography variant="body2" sx={{ textAlign: "justify" }}>
                  {suggestion}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryDisplay;
