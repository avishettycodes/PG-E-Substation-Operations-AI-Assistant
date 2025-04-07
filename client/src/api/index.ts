import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4477/api';

// Create API client
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export const sendChatMessage = async (message: string) => {
  try {
    const response = await api.post('/chat/query', { message });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

// Substation API
export const getAssetHealth = async (assetId: string) => {
  const response = await api.get(`/substation/asset/${assetId}/health`);
  return response.data;
};

export const getScheduledMaintenance = async (location: string) => {
  const response = await api.get(`/substation/maintenance/scheduled/${location}`);
  return response.data;
};

export const getMaintenanceHistory = async (assetId: string, limit?: number) => {
  const url = limit
    ? `/substation/asset/${assetId}/maintenance-history?limit=${limit}`
    : `/substation/asset/${assetId}/maintenance-history`;
  const response = await api.get(url);
  return response.data;
};

export const getInspectionReports = async (assetId: string, type?: string) => {
  const url = type
    ? `/substation/asset/${assetId}/inspection-reports?type=${type}`
    : `/substation/asset/${assetId}/inspection-reports`;
  const response = await api.get(url);
  return response.data;
};

export const getRealTimeData = async (substationId: string) => {
  const response = await api.get(`/substation/${substationId}/real-time-data`);
  return response.data;
};

export const getSafetyGuidelines = async (procedure: string) => {
  const response = await api.get(`/substation/safety/${procedure}`);
  return response.data;
};

export const getSparePartsForAsset = async (assetId: string) => {
  const response = await api.get(`/substation/asset/${assetId}/spare-parts`);
  return response.data;
};

export const searchSubstationData = async (keyword: string) => {
  const response = await api.get(`/substation/search?keyword=${keyword}`);
  return response.data;
}; 