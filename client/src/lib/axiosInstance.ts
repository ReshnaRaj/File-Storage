import { logout, setCredentials } from "@/redux/slice/authSlice";
import { store } from "@/redux/store";
import axios from "axios";
import { string } from "yup";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
export const privateAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
privateAxios.interceptors.request.use(
  (config) => {
    const state = store.getState();

    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
privateAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await publicAxios.post("/auth/refreshToken");
       
        store.dispatch(
          setCredentials({
            user: data.user,
            token: data.accessToken,
          })
        );
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return privateAxios(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
