import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/categories';
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  updateMenuItem,
} from '../api/menuItems';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  isAvailable: true,
};

// page patron : ajouter, modifier ou supprimer des plats
export default function ManageMenu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cats, menuItems] = await Promise.all([getCategories(), getMenuItems()]);
        setCategories(cats);
        setItems(menuItems);
        if (cats.length > 0) {
          setForm((prev) =>
            prev.categoryId ? prev : { ...prev, categoryId: String(cats[0].id) }
          );
        }
      } catch {
        setError('Unable to load menu items. Please make sure the API server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [retryCount]);

  const reloadItems = async () => {
    const [cats, menuItems] = await Promise.all([getCategories(), getMenuItems()]);
    setCategories(cats);
    setItems(menuItems);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      categoryId: categories.length > 0 ? String(categories[0].id) : '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      categoryId: Number(form.categoryId),
      isAvailable: form.isAvailable,
    };

    try {
      if (editingId) {
        await updateMenuItem(editingId, payload);
      } else {
        await createMenuItem(payload);
      }
      resetForm();
      await reloadItems();
    } catch {
      setError('Unable to save this dish.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      categoryId: String(item.categoryId),
      isAvailable: item.isAvailable,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dish?')) return;

    setError(null);
    try {
      await deleteMenuItem(id);
      if (editingId === id) resetForm();
      await reloadItems();
    } catch {
      setError('Unable to delete this dish.');
    }
  };

  const categoryMap = {};
  categories.forEach((c) => {
    categoryMap[c.id] = c.name;
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Manage Menu</h1>
        <p className="text-stone-400">Boss access — add or edit dishes</p>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/admin" className="text-sm font-semibold text-amber-700 hover:text-amber-600">
            ← Back to reservations
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md border border-stone-100 p-6 mb-8 text-left"
        >
          <h2 className="font-serif text-xl text-stone-900 mb-4">
            {editingId ? 'Edit dish' : 'Add a dish'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price (€)</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input
                id="isAvailable"
                name="isAvailable"
                type="checkbox"
                checked={form.isAvailable}
                onChange={handleChange}
                className="rounded border-stone-300 text-amber-700"
              />
              <label htmlFor="isAvailable" className="text-sm text-stone-700">
                Available
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-600 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId ? 'Update dish' : 'Add dish'}
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

        {loading && <LoadingSpinner label="Loading menu..." />}
        {error && <ErrorMessage message={error} onRetry={() => setRetryCount((c) => c + 1)} />}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-stone-100">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Available</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-stone-100">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{categoryMap[item.categoryId] || '—'}</td>
                    <td className="px-4 py-3">{Number(item.price).toFixed(2)} €</td>
                    <td className="px-4 py-3">{item.isAvailable ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 space-x-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="text-amber-700 hover:text-amber-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-700 hover:text-red-600"
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
      </section>
    </div>
  );
}
