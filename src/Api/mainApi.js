import useUserStore from "../stores/userStore";
import axios from "axios";

export const mainApi = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

mainApi.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// register
export const apiRegister = async (body) => {
  return await mainApi.post("/auth/register", body);
};

// login
export const apiLogin = async (body) => {
  return await mainApi.post("/auth/login", body);
};
