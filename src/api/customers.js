import { apiClient } from './client';

// récupère la liste complète des clients enregistrés en base de données
export async function getCustomers() {
  const response = await apiClient.get('/api/Customers');
  return response.data;
}

// Envoie les infos d'un nouveau client à l'API pour le créer en base
export async function createCustomer(customer) {
  await apiClient.post('/api/Customers', {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email || null,
    phone: customer.phone || null,
  });
}

// retrouve le client qui vient d'être créé en cherchant par nom/email/téléphone
// nécessaire car l'API ne retourne pas l'ID du nouveau client après le POST
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
  // en cas de doublons on prend le client avec l'ID le plus élevé (le plus récent)
  return matches.reduce((latest, c) => (c.id > latest.id ? c : latest), matches[0]);
}
