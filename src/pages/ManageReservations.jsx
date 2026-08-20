import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservations, updateReservation } from '../api/reservations';
import { getCustomers } from '../api/customers';
import { getTables } from '../api/tables';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ManageReservations() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

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
        customerById[c.id] = c.firstName + ' ' + c.lastName;
      });

      const tableById = {};
      tables.forEach((t) => {
        tableById[t.id] = t.tableNumber;
      });

      const enriched = reservations.map((r) => ({
        id: r.id,
        customerId: r.customerId,
        tableId: r.tableId,
        client: customerById[r.customerId] || 'Unknown',
        date: r.reservationDate,
        time: r.reservationTime,
        table: tableById[r.tableId] ?? '-',
        guests: r.guestsCount,
        status: r.status,
      }));

      enriched.sort((a, b) => b.date.localeCompare(a.date));
      setRows(enriched);
    } catch {
      setError('Unable to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditStatus(row.status);
  };

  const handleSave = async (row) => {
    try {
      await updateReservation(row.id, {
        customerId: row.customerId,
        tableId: row.tableId,
        reservationDate: row.date,
        reservationTime: row.time,
        guestsCount: row.guests,
        status: editStatus,
      });
      setEditingId(null);
      await fetchData();
    } catch {
      setError('Unable to update reservation.');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'confirmed') return 'text-green-600';
    if (status === 'cancelled') return 'text-red-600';
    return 'text-amber-600';
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Manage Reservations</h1>
        <p className="text-stone-400">Update reservation status</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 text-amber-700 font-medium hover:text-amber-600"
        >
          Back to reservations
        </button>

        {error && <ErrorMessage message={error} />}
        {loading && <LoadingSpinner label="Loading reservations..." />}

        {!loading && (
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Table</th>
                  <th className="px-4 py-3 font-medium">Guests</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
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
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="rounded border border-stone-300 px-2 py-1 text-xs"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span className={'capitalize font-medium ' + getStatusColor(row.status)}>
                          {row.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(row)}
                            className="text-green-600 hover:text-green-800 font-medium text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-stone-500 hover:text-stone-700 font-medium text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(row)}
                          className="text-amber-700 hover:text-amber-900 font-medium text-xs"
                        >
                          Edit status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
