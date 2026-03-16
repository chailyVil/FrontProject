import axios from "axios";

// כתובת השרת 
const API = axios.create({
  baseURL: "http://localhost:5170/api",
});

// מוסיף אוטומטית את ה-token לכל בקשה
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;