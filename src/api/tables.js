import { apiClient } from './client';

export async function getTables() {
  const response = await apiClient.get('/api/Tables');
  return response.data;
}

export async function createTable(table) {
  await apiClient.post('/api/Tables', {
    tableNumber: table.tableNumber,
    capacity: table.capacity,
    isAvailable: table.isAvailable ?? true,
  });
}

export async function updateTable(id, table) {
  await apiClient.put('/api/Tables/' + id, {
    tableNumber: table.tableNumber,
    capacity: table.capacity,
    isAvailable: table.isAvailable,
  });
}

export async function deleteTable(id) {
  await apiClient.delete('/api/Tables/' + id);
}
