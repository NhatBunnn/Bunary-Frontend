import axios from "axios";
import { API_URL } from "@config/apiConfig";

const axiosClient = axios.create({
  baseURL: `${API_URL}`,
  timeout: 10000,
});

export default axiosClient;
