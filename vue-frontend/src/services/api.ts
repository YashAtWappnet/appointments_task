import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // Example API
  timeout: 10000,
});

export default api;
