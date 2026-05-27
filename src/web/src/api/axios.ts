import axios from "axios";

import { API_BASE } from "../config/api";

const axiosRequest = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default axiosRequest;