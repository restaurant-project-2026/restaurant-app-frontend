import { apiClient } from './client';

export async function getTables() {
  const response = await apiClient.get('/api/Tables');
  return response.data;
}
