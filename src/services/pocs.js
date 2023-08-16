import axios from './axios'


export const getAllPocs = () => {
    return axios.get(`/pocs`);
};

// Get user pocs
export const getUserPocs = (id) => {
    return axios.get(`/pocs/userPocs/${id}`);
}

// Get poc by id
export const getPocById = (id) => {
    return axios.get(`/pocs/${id}`);
}