import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '../api/customers';
import { cancelReservation, getReservations } from '../api/reservations';
import { getTables } from '../api/tables';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// page client connecté : voir ses réservations et les annuler si besoin
export default function MyReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // charge les réservations du client connecté via son email
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [customers, allReservations, tables] = await Promise.all([
          getCustomers(),
          getReservations(),
          getTables(),
        ]);

        const customer = customers.find(
          (c) =>
            c.email &&
            c.email.toLowerCase() === user.customerEmail?.toLowerCase()
        );

        const tableById = {};
        tables.forEach((t) => {
          tableById[t.id] = t.tableNumber;
        });

        if (!customer) {
          setReservations([]);
          return;
        }

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
      } catch {
        setError('Unable to load your reservations. Please make sure the API server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.customerEmail, retryCount]);

  // annule une réservation puis recharge la liste
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;

    setCancellingId(id);
    setError(null);

    try {
      await cancelReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError('Unable to cancel this reservation.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">My Reservations</h1>
        <p className="text-stone-400">Welcome {user.name}</p>
      </section>

      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-stone-600">Your bookings</p>
          <Link
            to="/reservation"
            className="text-sm font-semibold text-amber-700 hover:text-amber-600"
          >
            Book a table →
          </Link>
        </div>

        {loading && <LoadingSpinner label="Loading your reservations..." />}
        {error && <ErrorMessage message={error} onRetry={() => setRetryCount((c) => c + 1)} />}

        {!loading && !error && reservations.length === 0 && (
          <p className="text-center text-stone-500 py-4">
            You have no reservations yet.{' '}
            <Link to="/reservation" className="text-amber-700 hover:underline">
              Book a table
            </Link>
          </p>
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

                {r.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => handleCancel(r.id)}
                    disabled={cancellingId === r.id}
                    className="mt-4 text-sm text-red-700 hover:text-red-600 disabled:opacity-50"
                  >
                    {cancellingId === r.id ? 'Cancelling...' : 'Cancel reservation'}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
