import React, { useRef, useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { TextField, Button, Typography, Box, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const libraries = ["places"];

const Home = ({ username: passedUsername }) => {
  const [username, setUsername] = useState(passedUsername || sessionStorage.getItem("username") || "");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!username) {
      console.warn("Nenhum usuário logado. Redirecionando para login.");
      navigate("/login");
      return;
    }

    const fetchLocation = async () => {
      const cachedLocation = sessionStorage.getItem("userLocation");

      if (cachedLocation) {
        const parsed = JSON.parse(cachedLocation);
        setLocation(parsed.address);
        setCoordinates(parsed);
      } else {
        try {
          const response = await fetch(`https://aw1gwngj0h.execute-api.us-east-1.amazonaws.com/dev/update-location?username=${username}`);

          if (response.ok) {
            const data = await response.json();
            const parsedBody = JSON.parse(data.body);

            const { address, latitude, longitude } = parsedBody.location || {};
            if (address && latitude && longitude) {
              const locationData = { address, latitude, longitude };
              setLocation(locationData.address);
              setCoordinates(locationData);
              sessionStorage.setItem("userLocation", JSON.stringify(locationData));

            } else {
              console.warn("Dados de localização ausentes ou incompletos.");
            }
          } else {
            console.error("Erro na resposta da API:", response.statusText);
          }
        } catch (error) {
          console.warn("Erro ao buscar localização do DynamoDB:", error);
        }
      }

      setLoading(false);
    };

    fetchLocation();
  }, [username, navigate]);

  const saveLocation = async (locationData) => {
    try {
      await fetch("https://aw1gwngj0h.execute-api.us-east-1.amazonaws.com/dev/update-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, location: locationData }),
      });
    } catch (error) {
      console.warn("Erro ao salvar localização no servidor:", error);
    }
  };

  const handlePlaceSelect = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
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
    });
  };

  const handleContinue = () => {
    if (coordinates) {
      navigate("/dashboard", { state: coordinates });
    }
  };

  if (loadError) return <Typography>Erro ao carregar Google Maps</Typography>;
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
        {location ? (
          <Typography variant="body1" gutterBottom>
            Localização atual: {location}
          </Typography>
        ) : (
          <TextField
            placeholder="Digite sua localização..."
            inputRef={inputRef}
            fullWidth
            value={location} // Campo controlado
            onChange={(e) => setLocation(e.target.value)} // Permite edição manual
            onFocus={handlePlaceSelect} // Ativa o autocompletar
            sx={{ mt: 2 }}
          />
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