import axios from '../services/axios';

export const updateUser = (user_id, params) => {
    return axios.put(`/${user_id}/update`, params);
};

export const getUsers = (params) => {
    return axios.get(`/users/`, params)
};

export const getUserById = (user_id) => {
    return axios.get(`/users/${user_id}`)
};

export const removeUser = (user_id) => {
    return axios.delete(`/users/remove/${user_id}`);
};

export const assignRole = (params) => {
    return axios.post(`/users/assign-role`, params);
};

export const revokeRole = (params) => {
    return axios.post(`/users/revoke-role`, params);
};

export const getUserRoles = (user_id) => {
    return axios.get(`/users/user-roles/${user_id}`)
}

export const verifyUser = (user_id) => {
    return axios.put(`/users/${user_id}/verify`)
}

export const unverifyUser = (user_id) => {
    return axios.put(`/users/${user_id}/unverify`)
}

export const getPermissions = () => {
    return axios.get(`/users/permissions`)
}