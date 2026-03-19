import axios from "axios";

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

// מטפל בשגיאת 401 — טוקן פג תוקף
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");  // ✅ מוחק את הטוקן
      window.location.href = "/login";   // ✅ מנתב ללוגין
    }
    // 2. חילוץ הודעת השגיאה מהשרת או הודעה כללית 
    const message = error.response?.data?.message || "התרחשה שגיאה בתקשורת עם השרת";

    // 3. כאן אפשר להפעיל ספריית התראות (כמו react-toastify)
    // alert(message); // זמני, עד שתחליט על ספריית עיצוב [cite: 25]
    return Promise.reject(error);
  }
);

export default API;