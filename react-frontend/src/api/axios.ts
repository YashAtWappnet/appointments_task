import axios, { AxiosError } from "axios";

// Base URL for your backend API
const API_BASE_URL = "http://localhost:3000"; // Change this as per your backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to attach tokens to requests (if authentication is needed)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Assuming you store JWT in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const handleApiError = (error: unknown): never => {
  const errorMessage =
    (error as AxiosError<{ message: string }>)?.response?.data?.message ||
    "Something went wrong!";
  throw new Error(errorMessage);
};

export default api;
