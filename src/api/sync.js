import axios from "axios";
import conf from "../conf/conf.js";

const baseUrl = `${conf.apiBaseUrl}/api/sync`;

export const addReminder = (text) =>
  axios.post(`${baseUrl}/addreminder`, { text }, { withCredentials: true });

export const deleteReminder = (id) =>
  axios.delete(`${baseUrl}/deletereminder/${id}`, { withCredentials: true });

export const completeReminder = (id) =>
  axios.patch(`${baseUrl}/completereminder/${id}`, {}, { withCredentials: true });


export const getPendingTasks = () =>
  axios.get(`${baseUrl}/pending`, { withCredentials: true });

export const getCompletedTasks = () =>
  axios.get(`${baseUrl}/completed`, { withCredentials: true });