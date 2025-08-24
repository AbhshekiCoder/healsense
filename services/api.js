import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Health Records API
export const createHealthRecord = (record) => API.post('/records', record);
export const getUserRecords = (userId) => API.get(`/records/${userId}`);
export const deleteRecord = (id) => API.delete(`/records/${id}`);

// Gemini Report API
export const generateAIReport = (healthData) => 
  API.post('/generate-report', { healthData });

// User API
export const loginUser = (credentials) => API.post('/login', credentials);
export const registerUser = (userData) => API.post('/register', userData);