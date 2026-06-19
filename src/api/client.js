import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5044';

// instance axios partagée avec l'URL de l'API et le bon header JSON
// tous les fichiers api/ utilisent ce client pour éviter de répéter la config
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
