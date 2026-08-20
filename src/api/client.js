import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5044';
console.log('API_URL utilisee:', API_URL);
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
