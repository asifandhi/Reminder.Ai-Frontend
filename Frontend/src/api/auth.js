import axios from "axios";
import conf from "../conf/conf.js";

const baseUrl = `${conf.apiBaseUrl}/api/user`;

export const registerUser = (data) =>
  axios.post(`${baseUrl}/register`, data, { withCredentials: true });

export const loginUser = (data) =>
  axios.post(`${baseUrl}/login`, data, { withCredentials: true });

export const logoutUser = () =>
  axios.post(`${baseUrl}/logout`, {}, { withCredentials: true });

export const getMe = () => axios.get(`${baseUrl}/me`, { withCredentials: true });

export const refreshToken = (data) =>
  axios.post(`${baseUrl}/refresh-token`, data, { withCredentials: true });

export const changePassword = (data) =>
  axios.post(`${baseUrl}/change-password`, data, { withCredentials: true });
