import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '../api/customers';
import { getReservations } from '../api/reservations';
import { getTables } from '../api/tables';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// page employé + patron : voir toutes les réservations du restaurant
export default function Admin() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [reservations, customers, tables] = await Promise.all([
          getReservations(),
          getCustomers(),
          getTables(),
        ]);

        const customerById = {};
        customers.forEach((c) => {
          customerById[c.id] = `${c.firstName} ${c.lastName}`;
        });

        const tableById = {};
        tables.forEach((t) => {
          tableById[t.id] = t.tableNumber;
        });

        const enriched = reservations.map((r) => ({
          id: r.id,
          client: customerById[r.customerId] || 'Unknown',
          date: r.reservationDate,
          time: r.reservationTime,
          table: tableById[r.tableId] ?? '—',
          guests: r.guestsCount,
          status: r.status,
        }));

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
        <h1 className="font-serif text-4xl text-white mb-2">Staff — Reservations</h1>
        <p className="text-stone-400">
          All restaurant bookings — {user.role === 'admin' ? 'Boss' : 'Employee'} view
        </p>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {user.role === 'admin' && (
          <div className="mb-6 flex justify-end gap-3"><Link to="/manage-reservations" className="inline-flex items-center rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">Manage reservations</Link><Link to="/manage-customers" className="inline-flex items-center rounded-full bg-stone-500 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-400">Manage customers</Link><Link to="/manage-employees" className="inline-flex items-center rounded-full bg-stone-700 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-600">Manage employees</Link><Link to="/manage-menu" className="inline-flex items-center rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">Manage menu</Link></div>
        )}

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



