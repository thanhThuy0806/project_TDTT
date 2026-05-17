import api from "./apiClient";

export const getWeatherData = async (lat, lon) => {
  try {
    const response = await api.get("/weather/", {
      params: { lat, lon },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Lỗi API Thời Tiết:",
      error.response?.status,
      error.response?.data,
    );
    throw error;
  }
};
