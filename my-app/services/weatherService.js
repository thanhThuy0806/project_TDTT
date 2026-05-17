import api from "axios";
import { auth } from "@/firebase/firebaseConfig";
import { API_URL } from "@/constants/api";

export const getWeatherData = async (lat, lon) => {
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error("Người dùng chưa đăng nhập, không thể lấy dữ liệu thời tiết.");
  }

  const token = await currentUser.getIdToken()
    
  const res = await api.get(`http://${API_URL}:8000/weather/`, {
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