const BASE_URL = "http://localhost:8000";

export const getWeatherData = async (city) => {
  try {
    const response = await fetch(`${BASE_URL}/api/weather?city=${city}`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Lỗi service: ", error);
    throw error;
  }
};
