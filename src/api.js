import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ബാക്കെൻഡ് URL
});

// ഓരോ റിക്വസ്റ്റിലും ടോക്കൺ തനിയെ ചേർക്കാനുള്ള Interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;