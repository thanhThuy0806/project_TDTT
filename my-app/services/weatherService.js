import api from "./apiClient";

export const getWeatherData = async (lat, lon) => {
  const res = await api.get("/weather/", {
    params: { lat, lon },
  });

  return res.data;
};
