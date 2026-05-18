import axios from "axios";
import { getAuth } from "firebase/auth";

export const API_URL = "192.168.88.221:8000";

const api = axios.create({
  baseURL: `http://${API_URL}`,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const current_user = auth.currentUser;
  const token = await current_user.getIdToken(true)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
