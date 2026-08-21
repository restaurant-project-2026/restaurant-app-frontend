import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTables, createTable, updateTable, deleteTable } from '../api/tables';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const emptyForm = { tableNumber: '', capacity: '', isAvailable: true };

export default function ManageTables() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTables();
      setTables(data);
    } catch {
      setError('Unable to load tables.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateTable(editingId, {
          tableNumber: Number(form.tableNumber),
          capacity: Number(form.capacity),
          isAvailable: form.isAvailable,
        });
      } else {
        await createTable({
          tableNumber: Number(form.tableNumber),
          capacity: Number(form.capacity),
          isAvailable: form.isAvailable,
        });
      }
      resetForm();
      await fetchTables();
    } catch {
      setError('Unable to save table.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (table) => {
    setEditingId(table.id);
    setForm({
      tableNumber: String(table.tableNumber),
      capacity: String(table.capacity),
      isAvailable: table.isAvailable,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await deleteTable(id);
      if (editingId === id) resetForm();
      await fetchTables();
    } catch {
      setError('Unable to delete this table.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Manage Tables</h1>
        <p className="text-stone-400">Add, edit or remove restaurant tables</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 text-amber-700 font-medium hover:text-amber-600"
        >
          Back to reservations
        </button>

        {error && <ErrorMessage message={error} />}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100 mb-8"
        >
          <h2 className="font-serif text-xl text-stone-900 mb-4">
            {editingId ? 'Edit table' : 'Add a table'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Table Number</label>
              <input
                type="number"
                name="tableNumber"
                value={form.tableNumber}
                onChange={handleChange}
                required
                min="1"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input
                id="isAvailable"
                name="isAvailable"
                type="checkbox"
                checked={form.isAvailable}
                onChange={handleChange}
                className="rounded border-stone-300"
              />
              <label htmlFor="isAvailable" className="text-sm text-stone-700">Available</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-600 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId ? 'Update table' : 'Add table'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>

        {loading && <LoadingSpinner label="Loading tables..." />}

        {!loading && (
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Table No.</th>
                  <th className="px-4 py-3 font-medium">Capacity</th>
                  <th className="px-4 py-3 font-medium">Available</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((t) => (
                  <tr key={t.id} className="border-t border-stone-100">
                    <td className="px-4 py-3">No.{t.tableNumber}</td>
                    <td className="px-4 py-3">{t.capacity} seats</td>
                    <td className="px-4 py-3">{t.isAvailable ? '✅' : '❌'}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => handleEdit(t)}
                        className="text-amber-700 hover:text-amber-900 font-medium text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-xs"
                      >
                        Delete
                      </button>
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
