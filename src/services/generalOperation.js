export const getMaxHourValues = (alertsData) => {
    const processedData = {};
  
    Object.keys(alertsData).forEach((key) => {
      if (Array.isArray(alertsData[key]) && alertsData[key].length > 0) {
        const maxHourEntry = alertsData[key].reduce((prev, current) =>
          prev.horas > current.horas ? prev : current
        );
        processedData[key] = { valor: maxHourEntry.valor, horas: maxHourEntry.horas };
      }
    });
  
    return processedData;
  };
  
export const fetchLambdaData = async (url, latitude, longitude) => {
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
