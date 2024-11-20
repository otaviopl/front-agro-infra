import React, { useRef, useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const libraries = ["places"];

const Home = () => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
      autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
    }
  }, [isLoaded]);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry && place.geometry.location) {
      setLocation(place.formatted_address || "Local desconhecido");
      setCoordinates({
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      });
    }
  };

  const saveLocationToDatabase = async (username, location) => {
    try {
      setLoading(true);
      const response = await fetch(process.env.REACT_APP_LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, location }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar a localização.");
      }

      const data = await response.json();
      console.log("Localização salva:", data);
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Erro:", error);
      setLoading(false);
      alert("Erro ao salvar localização. Tente novamente.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (coordinates.latitude && coordinates.longitude) {
      const username = "usuario-teste"; // Substitua com o nome do usuário autenticado
      const locationData = `${location} (${coordinates.latitude}, ${coordinates.longitude})`;

      const result = await saveLocationToDatabase(username, locationData);

      if (result) {
        navigate("/dashboard", { state: coordinates });
      }
    } else {
      alert("Por favor, selecione um local válido.");
    }
  };

  if (loadError) return <div>Erro ao carregar o Google Maps.</div>;
  if (!isLoaded) return <div>Carregando Google Maps...</div>;

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: "5rem" }}>
      <Typography variant="h4" gutterBottom>
        Sistema Climático
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ marginTop: "2rem" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Digite sua localização..."
            inputRef={inputRef}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: "1.5rem" }}
          type="submit"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Continuar"}
        </Button>
      </form>
    </Container>
  );
};

export default Home;
