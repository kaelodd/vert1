import axios from './axios'



export const getAllSectors = () => {
    return axios.get(`/sectors/`);
}

export const getSectorById = (id) => {
    return axios.get(`/sectors/${id}`);
}

export const getCountrySectors = (countryCode) => {
    return axios.get(`/sectors/countrySectors/${countryCode}`);
}

// get Sector accounts by sectorCode
export const getSectorAccounts = (sectorCode) => {
    return axios.get(`/sectors/accounts/${sectorCode}`);
}

// get Sector assets by sectorCode
export const getSectorAssets = (sectorCode) => {
    return axios.get(`/sectors/assets/${sectorCode}`);
}
