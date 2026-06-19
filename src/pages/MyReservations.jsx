import { useState } from 'react';
import { getCustomers } from '../api/customers';
import { getReservations } from '../api/reservations';
import { getTables } from '../api/tables';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// page client : permet de retrouver ses réservations en saisissant son email
// la vérification du mot de passe sera ajoutée côté backend
export default function MyReservations() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // cherche le client par email puis filtre et affiche uniquement ses réservations
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReservations([]);
    setSearched(false);

    try {
      // le mot de passe sera vérifié par le backend, pour l'instant on l'ignore
      const [customers, allReservations, tables] = await Promise.all([
        getCustomers(),
        getReservations(),
        getTables(),
      ]);

      // recherche le client dont l'email correspond (insensible à la casse)
      const customer = customers.find(
        (c) => c.email && c.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!customer) {
        setError('No account found with this email.');
        setSearched(true);
        return;
      }

      // dictionnaire { id → numéro de table } pour afficher le numéro dans les cartes
      const tableById = {};
      tables.forEach((t) => {
        tableById[t.id] = t.tableNumber;
      });

      // filtre les réservations de ce client et les trie du plus récent au plus ancien
      const mine = allReservations
        .filter((r) => r.customerId === customer.id)
        .map((r) => ({
          id: r.id,
          date: r.reservationDate,
          time: r.reservationTime,
          table: tableById[r.tableId] ?? '—',
          guests: r.guestsCount,
          status: r.status,
        }))
        .sort((a, b) => {
          const dateCompare = b.date.localeCompare(a.date);
          if (dateCompare !== 0) return dateCompare;
          return String(b.time).localeCompare(String(a.time));
        });

      setReservations(mine);
      setSearched(true);
    } catch {
      setError('Unable to load your reservations. Please make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">My Reservations</h1>
        <p className="text-stone-400">View your past and upcoming bookings</p>
      </section>

      <div className="max-w-xl mx-auto px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-stone-100 text-left mb-8"
        >
          <h2 className="font-serif text-xl text-stone-900 mb-4">Sign in</h2>
          <p className="text-sm text-stone-500 mb-4">
            Password authentication will be added on the backend.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Loading...' : 'View my reservations'}
            </button>
          </div>
        </form>

        {loading && <LoadingSpinner label="Loading your reservations..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && searched && reservations.length === 0 && !error && (
          <p className="text-center text-stone-500 py-4">You have no reservations yet.</p>
        )}

        {!loading && reservations.length > 0 && (
          <div className="space-y-4">
            {reservations.map((r) => (
              <article
                key={r.id}
                className="bg-white rounded-2xl p-5 shadow-md border border-stone-100"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-medium text-stone-900">
                      {r.date} at {r.time}
                    </p>
                    <p className="text-sm text-stone-600 mt-1">
                      Table No.{r.table} — {r.guests} guest{r.guests > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-xs font-medium capitalize bg-amber-50 text-amber-800 px-2 py-1 rounded">
                    {r.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
