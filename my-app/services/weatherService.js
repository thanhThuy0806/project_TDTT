import api from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getWeatherData = async (lat, lon) => {
  const token = await AsyncStorage.getItem("token");

  if (!token || token === "null") {
    console.error("Lỗi: Không tìm thấy Token trong AsyncStorage!");
    return null;
  }

  console.log("=== TOKEN GỬI ĐI ===", token);

  try {
    const res = await api.get("http://10.0.76.164:8000/weather/", {
      params: { lat, lon },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi API:", error.response?.status);
    throw error;
  }
};
