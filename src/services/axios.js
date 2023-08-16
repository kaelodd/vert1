import axios from "axios";
import { accessToken, logout } from "../auth";
import { API_BASE_URL } from "../config";

// Where you would set stuff like your 'Authorization' header, etc ...
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
    (request) => {
        // Edit request config
        return request;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        if (response.status === 403) {
            // Redirect to login page
            logout();
            window.location.href = '/login';
        }
        // Edit response config
        return response ?? null;
    },
    (error) => {
        const status = error?.response?.status || null;
        if (status === 403) {
            logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axios;
