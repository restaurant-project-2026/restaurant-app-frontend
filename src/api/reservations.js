import { apiClient } from './client';

export async function getReservations() {
  const response = await apiClient.get('/api/Reservations');
  return response.data;
}

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

export async function updateReservation(id, reservation) {
  await apiClient.put('/api/Reservations/' + id, {
    customerId: reservation.customerId,
    tableId: reservation.tableId,
    reservationDate: reservation.reservationDate,
    reservationTime: reservation.reservationTime,
    guestsCount: reservation.guestsCount,
    status: reservation.status,
  });
}

export async function cancelReservation(id) {
  await apiClient.delete('/api/Reservations/' + id);
}
