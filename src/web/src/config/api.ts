const isDev = process.env.NODE_ENV === "development";

export const API_BASE = isDev
    ? "http://localhost:5224/api"
    : ""; // TODO: add prod URL later

export const API_AUTH_REFRESH = isDev
    ? "http://localhost:5224/api/auth/refresh"
    : ""; // TODO: add prod URL later

export const SIGNALR_HUB_URL = isDev
    ? "http://localhost:5224/hubs/habits"
    : ""; // TODO: add prod URL later
