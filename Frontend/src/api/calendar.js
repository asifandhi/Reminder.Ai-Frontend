import axios from "axios";
import conf from "../conf/conf";

const baseUrl = `${conf.apiBaseUrl}/api/calendar`;



export const connectGoogle = () => {
  window.location.href = `${baseUrl}/auth`;
};