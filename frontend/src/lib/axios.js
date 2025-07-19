import axios from 'axios';

export const axiosInstance = axios.create({
  //change during deployment time//
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
  withCredentials: true,
});