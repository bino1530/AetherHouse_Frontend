import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", 
  // "https://bqvjkcqv-3000.asse.devtunnels.ms/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.token = `Bearer ${token}`;
  return config;
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = `Bearer ${token}`;
    config.headers.token = `Bearer ${token}`;         
  }
  return config;
});

export default api;
