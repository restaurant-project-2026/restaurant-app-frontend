import { apiClient } from './client';

// Récupère toutes les réservations, utilisé par la page Admin et la page "Mes réservations"
export async function getReservations() {
  const response = await apiClient.get('/api/Reservations');
  return response.data;
}

// envoie une nouvelle réservation à l'API avec toutes les informations nécessaires
export async function createReservation(reservation) {
  await apiClient.post('/api/Reservations', {
    customerId: reservation.customerId,
    tableId: reservation.tableId,
    reservationDate: reservation.reservationDate,
    reservationTime: reservation.reservationTime,
    guestsCount: reservation.guestsCount,
    status: reservation.status || 'confirmed',
  });
}
