import axios from '../services/axios'

export const getAssets = (params) => {
    return axios.get(`/assets/`, params)
};

export const getDecommissionedAssets = (params) => {
    return axios.get(`/assets/decommissioned`, params)
};

export const getAssetById = (asset_id) => {
    return axios.get(`/assets/${asset_id}`)
};

export const logAssetScan = (params) => {
    return axios.post(`/assets/logAssetScan`, params);
}

export const getAssetScanLogs = (params) => {
    return axios.get(`/assets/getScanLogs`, params);
}

export const getRecentAssetScanLogs = (params) => {
    return axios.post(`/assets/getRecentAssetScanLogs`, params);
}

export const getAssetScanLogsById = (id) => {
    return axios.get(`/assets/getScanLogsById/${id}`);
}

export const logAssetIssue = (params) => {
    return axios.post(`/assets/reportAssetIssue`, params);
}

export const getAssetIssues = (params) => {
    return axios.get(`/assets/getAssetIssues`, params);
}

export const getAssetIssueLog = (params) => {
    return axios.get(`/assets/getAssetIssueLog`, params);
}

export const getRecentAssetIssueLog = (params) => {
    return axios.post(`/assets/getRecentAssetIssueLogs`, params);
}

export const getAssetIssueLogById = (id) => {
    return axios.get(`/assets/getAssetIssueLogById/${id}`);
}

export const uploadCSVAssets = (params) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return axios.post(`/assets/csv-upload`, params, config);
}
export const uploadDecommissionedAssets = (params) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return axios.post(`/assets/csv-decommissioned-upload`, params, config);
}

export const getAssetReport = (params) => {
    return axios.post(`/assets/report`, params);
}