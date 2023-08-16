import axios from './axios'


export const getContracts = () => {
    return axios.get(`/contracts`);
};

export const addContract = (params) => {
    return axios.post(`/contracts/add`, params);
}

export const processContract = (params) => {
    return axios.post(`/contracts`, params);
}

export const getContract = (id) => {
    return axios.get(`/contracts/${id}`);
}
