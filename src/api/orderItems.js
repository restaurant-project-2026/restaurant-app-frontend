import { apiClient } from './client';

export async function getOrderItems() {
  const response = await apiClient.get('/api/OrderItems');
  return response.data;
}
