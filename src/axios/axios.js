import axios from "axios";

const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;
