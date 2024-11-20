import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", // Habilita o modo escuro global
    primary: {
      main: "#90caf9", // Azul para elementos principais
    },
    background: {
      default: "#121212", // Fundo preto
      paper: "#1e1e1e", // Papel cinza escuro
    },
    text: {
      primary: "#ffffff", // Texto branco
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
});

export default theme;
