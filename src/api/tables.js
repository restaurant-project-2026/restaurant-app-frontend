import { apiClient } from './client';

// récupère toutes les tables du restaurant depuis l'API
export async function getTables() {
  const response = await apiClient.get('/api/Tables');
  return response.data;
}
