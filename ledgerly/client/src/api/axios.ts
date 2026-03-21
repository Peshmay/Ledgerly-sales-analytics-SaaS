import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ledgerly_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
