const fetchWeatherData = async (address) => {
    const response = await fetch("https://aw1gwngj0h.execute-api.us-east-1.amazonaws.com/dev/weather-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
            
      },
      body: JSON.stringify({ address }),
    });
  
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }
  
    return await response.json();
  };
  
  export default fetchWeatherData;
  