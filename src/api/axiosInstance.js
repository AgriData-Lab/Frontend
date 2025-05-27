import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // 필요하다면 withCredentials: true 등 추가
});

export default axiosInstance;