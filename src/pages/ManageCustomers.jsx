import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, updateCustomer, deleteCustomer } from '../api/customers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ManageCustomers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch {
      setError('Unable to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setEditForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email || '',
      phone: customer.phone || '',
    });
  };

  const handleSave = async (id) => {
    try {
      await updateCustomer(id, editForm);
      setEditingId(null);
      await fetchCustomers();
    } catch {
      setError('Unable to update customer.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id);
      await fetchCustomers();
    } catch {
      setError('Unable to delete customer.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Manage Customers</h1>
        <p className="text-stone-400">View, edit or delete customer records</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 text-amber-700 font-medium hover:text-amber-600"
        >
          ← Back to reservations
        </button>

        {error && <ErrorMessage message={error} />}
        {loading && <LoadingSpinner label="Loading customers..." />}

        {!loading && (
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="px-4 py-3 font-medium">First Name</th>
                  <th className="px-4 py-3 font-medium">Last Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-stone-100">
                    {editingId === c.id ? (
                      <>
                        <td className="px-4 py-2">
                          <input
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                            className="w-full rounded border border-stone-300 px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                            className="w-full rounded border border-stone-300 px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full rounded border border-stone-300 px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full rounded border border-stone-300 px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            onClick={() => handleSave(c.id)}
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
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">{c.firstName}</td>
                        <td className="px-4 py-3">{c.lastName}</td>
                        <td className="px-4 py-3">{c.email || '—'}</td>
                        <td className="px-4 py-3">{c.phone || '—'}</td>
                        <td className="px-4 py-3 flex gap-3">
                          <button
                            onClick={() => handleEdit(c)}
                            className="text-amber-700 hover:text-amber-900 font-medium text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
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
