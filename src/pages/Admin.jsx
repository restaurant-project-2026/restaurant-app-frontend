import { useEffect, useState } from 'react';
import { getCustomers } from '../api/customers';
import { getReservations } from '../api/reservations';
import { getTables } from '../api/tables';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// page réservée au chef du restaurant pour voir toutes les réservations
// l'authentification sera ajoutée côté backend par le collègue
export default function Admin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // incrémenter ce compteur depuis le bouton "Try Again" pour relancer le chargement
  const [retryCount, setRetryCount] = useState(0);

  // se déclenche au premier affichage et à chaque clic sur "Try Again" (via retryCount)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // charge les 3 ressources en parallèle pour optimiser le temps d'attente
        const [reservations, customers, tables] = await Promise.all([
          getReservations(),
          getCustomers(),
          getTables(),
        ]);

        // dictionnaire { id → "Prénom Nom" } pour retrouver le client d'une réservation
        const customerById = {};
        customers.forEach((c) => {
          customerById[c.id] = `${c.firstName} ${c.lastName}`;
        });

        // dictionnaire { id → numéro de table } pour retrouver la table d'une réservation
        const tableById = {};
        tables.forEach((t) => {
          tableById[t.id] = t.tableNumber;
        });

        // assemble les données enrichies (nom + numéro de table) pour chaque réservation
        const enriched = reservations.map((r) => ({
          id: r.id,
          client: customerById[r.customerId] || 'Unknown',
          date: r.reservationDate,
          time: r.reservationTime,
          table: tableById[r.tableId] ?? '—',
          guests: r.guestsCount,
          status: r.status,
        }));

        // tri par date décroissante puis par heure décroissante (les plus récentes en premier)
        enriched.sort((a, b) => {
          const dateCompare = b.date.localeCompare(a.date);
          if (dateCompare !== 0) return dateCompare;
          return String(b.time).localeCompare(String(a.time));
        });

        setRows(enriched);
      } catch {
        setError('Unable to load reservations. Please make sure the API server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [retryCount]);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Admin — Reservations</h1>
        <p className="text-stone-400">All restaurant bookings (auth to be added on backend)</p>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && <LoadingSpinner label="Loading reservations..." />}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => setRetryCount((c) => c + 1)}
          />
        )}

        {!loading && !error && (
          <>
            {rows.length === 0 ? (
              <p className="text-center text-stone-500 py-8">No reservations yet.</p>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-stone-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-stone-100 text-stone-700">
                    <tr>
                      <th className="px-4 py-3 font-medium">Client</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Time</th>
                      <th className="px-4 py-3 font-medium">Table</th>
                      <th className="px-4 py-3 font-medium">Guests</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-t border-stone-100">
                        <td className="px-4 py-3">{row.client}</td>
                        <td className="px-4 py-3">{row.date}</td>
                        <td className="px-4 py-3">{row.time}</td>
                        <td className="px-4 py-3">No.{row.table}</td>
                        <td className="px-4 py-3">{row.guests}</td>
                        <td className="px-4 py-3 capitalize">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
