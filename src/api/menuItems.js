import { apiClient } from './client';

// récupère tous les plats du menu depuis l'API
export async function getMenuItems() {
  const response = await apiClient.get('/api/MenuItems');
  return response.data;
}

// ajoute un nouveau plat (réservé au patron)
export async function createMenuItem(item) {
  await apiClient.post('/api/MenuItems', {
    name: item.name,
    description: item.description || null,
    price: item.price,
    categoryId: item.categoryId,
    isAvailable: item.isAvailable ?? true,
  });
}

// modifie un plat existant
export async function updateMenuItem(id, item) {
  await apiClient.put(`/api/MenuItems/${id}`, {
    id,
    name: item.name,
    description: item.description || null,
    price: item.price,
    categoryId: item.categoryId,
    isAvailable: item.isAvailable,
  });
}

// supprime un plat du menu
export async function deleteMenuItem(id) {
  await apiClient.delete(`/api/MenuItems/${id}`);
}
