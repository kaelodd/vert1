import axios from './axios'


export const getTermsAndConditions = () => {
    return axios.get(`/termsAndConditions`);
};

export const updateTermsAndConditions = (params) => {
    return axios.put(`/termsAndConditions/${params?.id || ''}`, params);
}

export const createTermsAndConditions = (params) => {
    return axios.post(`/termsAndConditions`, params);
}

export const getTermsAndConditionsByCategory = (id) => {
    return axios.get(`/termsAndConditions/${id}`);
}

export const getTermsAndConditionsById = (id) => {
    return axios.get(`/termsAndConditions/get/${id}`);
}
