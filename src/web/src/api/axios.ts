import axios from "axios";

const axiosRequest = axios.create({
    baseURL: "https://localhost:7224/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default axiosRequest;