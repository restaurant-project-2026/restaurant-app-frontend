// comptes de démo en dur en attendant la vraie auth backend
// email + mot de passe + rôle (client | employee | boss)
export const DEMO_USERS = [
  {
    email: 'client@test.com',
    password: 'client123',
    role: 'client',
    name: 'Demo Client',
    customerEmail: 'client@test.com',
  },
  {
    email: 'employee@test.com',
    password: 'employee123',
    role: 'employee',
    name: 'Demo Employee',
  },
  {
    email: 'boss@test.com',
    password: 'boss123',
    role: 'boss',
    name: 'Demo Boss',
  },
];

// page par défaut après connexion selon le rôle
export function getDefaultRoute(role) {
  if (role === 'client') return '/my-reservations';
  if (role === 'employee') return '/admin';
  if (role === 'boss') return '/admin';
  return '/';
}
