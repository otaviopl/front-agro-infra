import React, { useRef, useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const libraries = ["places"]; // Mantido fora para evitar recriação

const Home = ({ username: passedUsername }) => {
  const [username, setUsername] = useState(
    passedUsername || sessionStorage.getItem("username") || ""
  );
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Controle do modo de edição

  const inputRef = useRef(null); // Referência para o campo de entrada
  const autocompleteRef = useRef(null); // Referência para o Autocomplete
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (!username) {
        console.warn("Nenhum usuário logado. Redirecionando para login.");
        navigate("/login");
        return;
      }

      const cachedLocation = sessionStorage.getItem("userLocation");
      if (cachedLocation) {
        const parsed = JSON.parse(cachedLocation);
        setLocation(parsed.address);
        setCoordinates(parsed);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://yvv8xenqud.execute-api.us-east-1.amazonaws.com/dev/update-location?username=${username}`
        );

        if (response.ok) {
          const data = await response.json();
          const parsedBody = JSON.parse(data.body);

          const { address, latitude, longitude } = parsedBody.location || {};
          if (address && latitude && longitude) {
            const locationData = { address, latitude, longitude };
            setLocation(locationData.address);
            setCoordinates(locationData);
            sessionStorage.setItem(
              "userLocation",
              JSON.stringify(locationData)
            );
          } else {
            console.warn("Dados de localização ausentes ou incompletos.");
          }
        } else {
          console.error("Erro na resposta da API:", response.statusText);
        }
      } catch (error) {
        console.warn("Erro ao buscar localização do servidor:", error);
      }
      setLoading(false);
    };

    fetchUserLocation();
  }, [username, navigate]);

  // Inicializa ou redefine o Autocomplete
  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current
      );

      autocompleteRef.current.addListener("place_changed", handlePlaceSelect);

      return () => {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      };
    }
  }, [isLoaded, isEditing]); // Adicionado `isEditing` para reconfigurar no modo de edição

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry?.location) {
      const locationData = {
        address: place.formatted_address || "Local desconhecido",
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };
      setLocation(locationData.address);
      setCoordinates(locationData);
      sessionStorage.setItem("userLocation", JSON.stringify(locationData));
      saveLocation(locationData);
    }
  };

  const saveLocation = async (locationData) => {
    try {
      await fetch(
        "https://yvv8xenqud.execute-api.us-east-1.amazonaws.com/dev/update-location",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, location: locationData }),
        }
      );
    } catch (error) {
      console.warn("Erro ao salvar localização no servidor:", error);
    }
  };

  const handleContinue = () => {
    if (coordinates) {
      navigate("/dashboard", { state: coordinates });
    }
  };

  const handleEditLocation = () => {
    setIsEditing(true); // Ativa o modo de edição
  };

  const handleSaveNewLocation = () => {
    setIsEditing(false); // Sai do modo de edição
  };

  if (loadError) return <Typography>Erro ao carregar o Google Maps</Typography>;
  if (!isLoaded || loading) return <CircularProgress />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {username ? `Bem-vindo, ${username}!` : "Sistema Climático"}
        </Typography>

        {isEditing ? (
          <TextField
            placeholder="Digite sua nova localização..."
            inputRef={inputRef} // Campo conectado ao Autocomplete
            fullWidth
            defaultValue={location} // Exibe a localização atual como padrão
            sx={{ mt: 2 }}
          />
        ) : (
          <Typography variant="body1" gutterBottom>
            Localização atual: {location}
          </Typography>
        )}

        {isEditing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveNewLocation}
            sx={{ mt: 3 }}
          >
            Salvar Nova Localização
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleEditLocation}
            sx={{ mt: 3 }}
          >
            Alterar Localização
          </Button>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleContinue}
          disabled={!coordinates}
          sx={{ mt: 3 }}
        >
          Continuar
        </Button>
      </Paper>
    </Box>
  );
};

export default Home;