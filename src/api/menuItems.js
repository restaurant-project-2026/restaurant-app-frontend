import { apiClient } from './client';

export async function getMenuItems() {
  const response = await apiClient.get('/api/MenuItems');
  return response.data;
}

export async function getMenuItemById(id) {
  const response = await apiClient.get(`/api/MenuItems/${id}`);
  return response.data;
}
