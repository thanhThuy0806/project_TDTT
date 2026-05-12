<<<<<<< HEAD
export const API_URL = "http://localhost:5001/api";
=======
import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.100.47:800/api",
  timeout: 15000,
});
>>>>>>> BE_Weather
