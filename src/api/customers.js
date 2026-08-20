import { apiClient } from './client';

export async function getCustomers() {
  const response = await apiClient.get('/api/Customers');
  return response.data;
}

export async function createCustomer(customer) {
  await apiClient.post('/api/Customers', {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email || null,
    phone: customer.phone || null,
  });
}

export async function updateCustomer(id, customer) {
  await apiClient.put('/api/Customers/' + id, {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email || null,
    phone: customer.phone || null,
  });
}

export async function deleteCustomer(id) {
  await apiClient.delete('/api/Customers/' + id);
}

export async function findCustomerAfterCreate({ firstName, lastName, email, phone }) {
  const customers = await getCustomers();
  const matches = customers.filter(
    (c) =>
      c.firstName === firstName &&
      c.lastName === lastName &&
      (email ? c.email === email : true) &&
      (phone ? c.phone === phone : true)
  );
  if (matches.length === 0) return null;
  return matches.reduce((latest, c) => (c.id > latest.id ? c : latest), matches[0]);
}
