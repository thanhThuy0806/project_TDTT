import api from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getWeatherData = async (lat, lon) => {
  const token = await AsyncStorage.getItem("token");

  const res = await api.get("/weather", {
    params: {
      lat,
      lon,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
