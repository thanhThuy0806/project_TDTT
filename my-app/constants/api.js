import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.76.164:800/",
  timeout: 15000,
});
