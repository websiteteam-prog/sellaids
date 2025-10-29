// src/api/axiosInstance.js
import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

let redirectToLogin = null;

export const setLoginRedirect = (fn) => {
  redirectToLogin = fn;
};

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      toast.error("Your session has expired. Please log in again.");
      if (redirectToLogin) redirectToLogin();
      else window.location.href = "/UserAuth/UserLogin";
    }
    return Promise.reject(err);
  }
);

export default api;