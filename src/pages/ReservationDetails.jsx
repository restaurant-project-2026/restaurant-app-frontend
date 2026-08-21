import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getReservations } from '../api/reservations';
import { getCustomers } from '../api/customers';
import { getTables } from '../api/tables';
import { getOrderItems } from '../api/orderItems';
import { getMenuItems } from '../api/menuItems';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [table, setTable] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reservations, customers, tables, orders, menuItems] = await Promise.all([
        getReservations(),
        getCustomers(),
        getTables(),
        getOrderItems(),
        getMenuItems(),
      ]);

      const res = reservations.find((r) => r.id === Number(id));
      if (!res) {
        setError('Reservation not found.');
        return;
      }

      const cust = customers.find((c) => c.id === res.customerId);
      const tbl = tables.find((t) => t.id === res.tableId);
      const resOrders = orders.filter((o) => o.reservationId === Number(id));

      const menuById = {};
      menuItems.forEach((m) => {
        menuById[m.id] = m;
      });

      const enrichedOrders = resOrders.map((o) => ({
        ...o,
        menuItem: menuById[o.menuItemId] || null,
      }));

      setReservation(res);
      setCustomer(cust);
      setTable(tbl);
      setOrderItems(enrichedOrders);
    } catch {
      setError('Unable to load reservation details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'confirmed') return 'text-green-600 bg-green-50';
    if (status === 'cancelled') return 'text-red-600 bg-red-50';
    if (status === 'completed') return 'text-blue-600 bg-blue-50';
    return 'text-amber-600 bg-amber-50';
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Reservation Details</h1>
        <p className="text-stone-400">Full information for reservation #{id}</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 text-amber-700 font-medium hover:text-amber-600"
        >
          Back to reservations
        </button>

        {loading && <LoadingSpinner label="Loading details..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && reservation && (
          <div className="space-y-6">

            <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-6">
              <h2 className="font-serif text-xl text-stone-900 mb-4">Reservation Info</h2>
              <dl className="space-y-2 text-sm text-stone-700">
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Status</dt>
                  <dd>
                    <span className={'px-2 py-1 rounded text-xs font-medium capitalize ' + getStatusColor(reservation.status)}>
                      {reservation.status}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Date</dt>
                  <dd className="font-medium">{reservation.reservationDate}</dd>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Time</dt>
                  <dd className="font-medium">{reservation.reservationTime}</dd>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Guests</dt>
                  <dd className="font-medium">{reservation.guestsCount}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-stone-500">Table</dt>
                  <dd className="font-medium">No.{table?.tableNumber} ({table?.capacity} seats)</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-6">
              <h2 className="font-serif text-xl text-stone-900 mb-4">Customer Info</h2>
              <dl className="space-y-2 text-sm text-stone-700">
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Name</dt>
                  <dd className="font-medium">{customer?.firstName} {customer?.lastName}</dd>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <dt className="text-stone-500">Email</dt>
                  <dd>{customer?.email || '—'}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-stone-500">Phone</dt>
                  <dd>{customer?.phone || '—'}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-6">
              <h2 className="font-serif text-xl text-stone-900 mb-4">
                Order Items ({orderItems.length})
              </h2>
              {orderItems.length === 0 ? (
                <p className="text-stone-500 text-sm">No items ordered yet.</p>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-stone-100 text-stone-700">
                    <tr>
                      <th className="px-4 py-3 font-medium">Dish</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Quantity</th>
                      <th className="px-4 py-3 font-medium">Note</th>
                      <th className="px-4 py-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((o) => (
                      <tr key={o.id} className="border-t border-stone-100">
                        <td className="px-4 py-3">{o.menuItem?.name || 'Unknown'}</td>
                        <td className="px-4 py-3">{o.menuItem?.price?.toFixed(2)} €</td>
                        <td className="px-4 py-3">{o.quantity}</td>
                        <td className="px-4 py-3">{o.note || '—'}</td>
                        <td className="px-4 py-3 font-medium">
                          {(o.menuItem?.price * o.quantity).toFixed(2)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-50">
                    <tr>
                      <td colSpan="4" className="px-4 py-3 font-medium text-right text-stone-700">Total</td>
                      <td className="px-4 py-3 font-bold text-amber-700">
                        {orderItems.reduce((sum, o) => sum + (o.menuItem?.price * o.quantity || 0), 0).toFixed(2)} €
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
