import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const adminApi = (token) =>
  axios.create({
    baseURL: `${backendUrl}/api/admin`,
    headers: { Authorization: `Bearer ${token}` },
  });
