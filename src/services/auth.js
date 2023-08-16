import axios from '../services/axios';
import { API_BASE_URL } from '../config/index';

// Map for localStorage keys
const LOCALSTORAGE_KEYS = {
    accessToken: 'auth_access_token',
    refreshToken: 'auth_refresh_token',
    expireTime: 'auth_token_expire_time',
    timestamp: 'auth_token_timestamp',
    reload: 'page_reload',
};

export const STORAGE_KEYS = LOCALSTORAGE_KEYS;

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
    accessToken: localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timestamp: localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
    reload: localStorage.getItem(LOCALSTORAGE_KEYS.reload),
};

export const register = (params) => {
    return axios.post(`/users/register`, params);
}

export const login = (params) => {
    return axios.post(`/users/login`, params);
}

export const logout = () => {
    // Clear all localStorage items
    for (const property in LOCALSTORAGE_KEYS) {
        window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }
    return true;
}

export const forgotPassword = (params) => {
    return axios.post(`/users/forgot-password`, params);
}

export const updatePassword = (params) => {
    return axios.post(`/users/update-password`, params);
}

export const resetPassword = (userId, token, params) => {
    return axios.post(`/users/reset-password/${userId}/${token}`, params);
}

export const getOauthCallBackResponse = ({ oauthCode, oauthClientInfo, oauthSessionState }) => {
    return axios.get(`${API_BASE_URL}/auth/oauth-callback?code=${oauthCode}&client_info${oauthClientInfo}&session_state${oauthSessionState}`);
}