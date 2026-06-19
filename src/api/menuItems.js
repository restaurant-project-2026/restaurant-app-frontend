import { apiClient } from './client';

// récupère tous les plats du menu depuis l'API
export async function getMenuItems() {
  const response = await apiClient.get('/api/MenuItems');
  return response.data;
}
