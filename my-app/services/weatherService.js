import api from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getWeatherData = async (lat, lon) => {
  const token = await AsyncStorage.getItem("token");

  // KIỂM TRA XEM TOKEN CÓ TỒN TẠI KHÔNG
  console.log("=== TOKEN GỬI ĐI ===", token);

  const res = await api.get("http://localhost:8000/weather/", {
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
