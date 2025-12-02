import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

const API_BASE = import.meta.env.VITE_API_AUTH_BASE || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  timeout: 15000,
});

/* -----------------------------
   🔵 INTERCEPTOR REQUEST
------------------------------*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("swk_token");

  console.log("%c[API REQUEST]", "color: #1976D2; font-weight: bold");
  console.log("→ URL:", `${config.baseURL}${config.url}`);
  console.log("→ Method:", config.method?.toUpperCase());
  console.log("→ Body:", config.data);
  console.log("→ Headers:", config.headers);
  console.log("→ Token:", token || "No token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* -----------------------------
   🟢 INTERCEPTOR RESPONSE OK
------------------------------*/
api.interceptors.response.use(
  (response: AxiosResponse) => {

    console.log("%c[API RESPONSE OK]", "color: #2E7D32; font-weight: bold");
    console.log("← URL:", response.config.baseURL + response.config.url);
    console.log("← Status:", response.status);
    console.log("← Data:", response.data);

    const nestedStatus: number | undefined =
      (response.data && (response.data.statusCode ?? response.data.status)) as number | undefined;

    if (typeof nestedStatus === "number" && nestedStatus >= 400) {
      console.warn("%c[API NESTED ERROR DETECTED]", "color: #E65100; font-weight: bold");
      console.warn("Nested status:", nestedStatus);
      console.warn("Nested message:", response.data.message);

      return Promise.reject({ response });
    }

    return response;
  },

  /* -----------------------------
     🔴 INTERCEPTOR RESPONSE ERROR
  ------------------------------*/
  (err: AxiosError) => {
    console.error("%c[API RESPONSE ERROR]", "color: #C62828; font-weight: bold");

    const status = err?.response?.status;
    const url = err?.config?.baseURL + (err?.config?.url || "");
    const data = err?.response?.data;

    console.error("← URL:", url);
    console.error("← Status:", status);
    console.error("← Error Data:", data);
    console.error("← Full Error:", err);

    if (status === 401) {
      try {
        localStorage.removeItem("swk_token");
        localStorage.removeItem("swk_user");
      } catch {}

      window.dispatchEvent(new Event("swk_logout"));
    }

    return Promise.reject(err);
  }
);

export default api;
