import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '../api/customers';
import { cancelReservation, getReservations, updateReservation } from '../api/reservations';
import { getTables } from '../api/tables';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function MyReservations() {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(false);
    setReservations([]);

    try {
      const [customers, allReservations, allTables] = await Promise.all([
        getCustomers(),
        getReservations(),
        getTables(),
      ]);

      const customer = customers.find(
        (c) => c.email && c.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!customer) {
        setError('No account found with this email.');
        setSearched(true);
        return;
      }

      setCustomerId(customer.id);
      setTables(allTables);

      const tableById = {};
      allTables.forEach((t) => { tableById[t.id] = t; });

      const mine = allReservations
        .filter((r) => r.customerId === customer.id)
        .map((r) => ({
          id: r.id,
          customerId: r.customerId,
          tableId: r.tableId,
          date: r.reservationDate,
          time: r.reservationTime,
          table: tableById[r.tableId]?.tableNumber ?? '-',
          guests: r.guestsCount,
          status: r.status,
        }))
        .sort((a, b) => b.date.localeCompare(a.date));

      setReservations(mine);
      setSearched(true);
    } catch {
      setError('Unable to load reservations. Please make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    setCancellingId(id);
    try {
      await cancelReservation(id);
      setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status: 'cancelled' } : r));
    } catch {
      setError('Unable to cancel this reservation.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleEdit = (r) => {
    setEditingId(r.id);
    setEditForm({
      date: r.date,
      time: r.time,
      tableId: r.tableId,
      guests: r.guests,
    });
  };

  const handleSaveEdit = async (r) => {
    try {
      await updateReservation(r.id, {
        customerId: r.customerId,
        tableId: Number(editForm.tableId),
        reservationDate: editForm.date,
        reservationTime: editForm.time,
        guestsCount: Number(editForm.guests),
        status: r.status,
      });
      setEditingId(null);
      await handleSearch({ preventDefault: () => {} });
    } catch {
      setError('Unable to update reservation.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">My Reservations</h1>
        <p className="text-stone-400">View, modify or cancel your bookings</p>
      </section>

      <div className="max-w-xl mx-auto px-4 py-10">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100 mb-8"
        >
          <h2 className="font-serif text-xl text-stone-900 mb-4">Find your reservations</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-600 disabled:opacity-60"
            >
              {loading ? 'Searching...' : 'Find my reservations'}
            </button>
          </div>
        </form>

        {loading && <LoadingSpinner label="Loading your reservations..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && searched && reservations.length === 0 && !error && (
          <p className="text-center text-stone-500 py-4">
            You have no reservations yet.{' '}
            <Link to="/reservation" className="text-amber-700 hover:underline">Book a table</Link>
          </p>
        )}

        {!loading && reservations.length > 0 && (
          <div className="space-y-4">
            {reservations.map((r) => (
              <article key={r.id} className="bg-white rounded-2xl p-5 shadow-md border border-stone-100">
                {editingId === r.id ? (
                  <div className="space-y-3">
                    <h3 className="font-medium text-stone-900">Edit reservation</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Date</label>
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Time</label>
                        <input
                          type="time"
                          value={editForm.time?.slice(0, 5)}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value + ':00' })}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Guests</label>
                        <select
                          value={editForm.guests}
                          onChange={(e) => setEditForm({ ...editForm, guests: e.target.value })}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-sm"
                        >
                          {[1,2,3,4,5,6,7,8].map((n) => (
                            <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Table</label>
                        <select
                          value={editForm.tableId}
                          onChange={(e) => setEditForm({ ...editForm, tableId: e.target.value })}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-sm"
                        >
                          {tables.filter((t) => t.isAvailable || t.id === r.tableId).map((t) => (
                            <option key={t.id} value={t.id}>Table No.{t.tableNumber} ({t.capacity} seats)</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => handleSaveEdit(r)}
                        className="px-4 py-2 rounded-lg bg-amber-700 text-white text-sm font-semibold hover:bg-amber-600"
                      >
                        Save changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-sm hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-stone-900">{r.date} at {r.time}</p>
                        <p className="text-sm text-stone-600 mt-1">
                          Table No.{r.table} — {r.guests} guest{r.guests > 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="text-xs font-medium capitalize bg-amber-50 text-amber-800 px-2 py-1 rounded">
                        {r.status}
                      </span>
                    </div>
                    {r.status !== 'cancelled' && (
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-sm text-amber-700 hover:text-amber-600 font-medium"
                        >
                          Modify reservation
                        </button>
                        <button
                          onClick={() => handleCancel(r.id)}
                          disabled={cancellingId === r.id}
                          className="text-sm text-red-700 hover:text-red-600 disabled:opacity-50"
                        >
                          {cancellingId === r.id ? 'Cancelling...' : 'Cancel reservation'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
