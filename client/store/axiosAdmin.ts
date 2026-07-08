import axios from "axios";

export const ADMIN_TOKEN_KEY = "cu_admin_token";

const adminAxios = axios.create({
  headers: { "Content-Type": "application/json" },
});

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.startsWith("/admin/login")) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  },
);

export default adminAxios;
