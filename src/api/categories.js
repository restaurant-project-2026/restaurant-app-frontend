import { apiClient } from './client';

export async function getCategories() {
  const response = await apiClient.get('/api/Categories');
  return response.data;
}

export async function getCategoryById(id) {
  const response = await apiClient.get(`/api/Categories/${id}`);
  return response.data;
}
