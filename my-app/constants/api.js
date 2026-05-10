import axios from "axios";

const api = axios.create({
  baseURL: "http://ip-may:8000",
  timeout: 15000,
});

export default api;
