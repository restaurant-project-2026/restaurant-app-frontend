import { apiClient } from './client';

export async function loginUser(username, password) {
  const response = await apiClient.post('/api/Users/login', {
    username: username,
    passwordHash: password,
  });
  return response.data;
}

export async function registerUser(username, password, role) {
  const response = await apiClient.post('/api/Users/register', {
    username: username,
    passwordHash: password,
    role: role,
  });
  return response.data;
}

export async function getUsers() {
  const response = await apiClient.get('/api/Users');
  return response.data;
}

export async function deleteUser(id) {
  await apiClient.delete('/api/Users/' + id);
}
