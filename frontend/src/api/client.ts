import axios from "axios";

import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./token";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);


// Refresh expired access tokens
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register")
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        const newToken = response.data.accessToken;

        setAccessToken(newToken);

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return apiClient(originalRequest);

      } catch (refreshError) {

        clearAccessToken();

        return Promise.reject(refreshError);

      }
    }


    const message =
      error.response?.data?.message ??
      error.message ??
      "Something went wrong.";

    return Promise.reject(new Error(message));
  }
);


export default apiClient;