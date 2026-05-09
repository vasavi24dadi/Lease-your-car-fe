import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL || "/api";

export const getImageUrl = (filename) => {
  if (!filename) return "";
  if (filename.startsWith("http")) return filename;
  const serverRoot = API_URL.replace(/\/api\/?$/, "");
  return `${serverRoot}/uploads/${filename}`;
};

const API = axios.create({
  baseURL: API_URL,
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
    