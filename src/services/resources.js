import axios from './axios'


export const getCountries = () => {
    return axios.get(`/resources/countries`);
};

export const addSector = (params) => {
    return axios.post(`/resources/add-sector`, params);
}


export const removeSector = (id) => {
    return axios.delete(`/resources/remove-sector/${id}`);
}

export const getSectors = () => {
    return axios.get(`/resources/sectors`);
}

export const getSector = (id) => {
    return axios.get(`/resources/sector/${id}`);
}

export const updateGPSComplianceRange = (params) => {
    return axios.post(`/resources/update-gps-range`, params);
}
