import { apiClient } from './client';

// récupère toutes les catégories du menu depuis l'API (ex: Entrées, Plats, Desserts)
export async function getCategories() {
  const response = await apiClient.get('/api/Categories');
  return response.data;
}
