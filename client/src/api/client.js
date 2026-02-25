import axios from "axios";

/**
 * Axios instance with shared config:
 * - baseURL: /api (proxied to Express by Vite in dev)
 * - credentials: cookies sent with every request
 * - JSON content-type default
 */
const client = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Unwrap response data and normalise errors in one place
client.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message || "Something went wrong.";
        return Promise.reject(new Error(message));
    }
);

export default client;
