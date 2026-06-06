import axios from "axios";

import { API_BASE } from "../config/api";

const axiosRequest = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

export default axiosRequest;