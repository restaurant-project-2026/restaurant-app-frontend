import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, registerUser, deleteUser } from '../api/users';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ManageEmployees() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('staff');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('Unable to load employees.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await registerUser(newUsername, newPassword, newRole);
      setNewUsername('');
      setNewPassword('');
      setNewRole('staff');
      await fetchUsers();
    } catch {
      setError('Unable to add employee.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch {
      setError('Unable to delete employee.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Manage Employees</h1>
        <p className="text-stone-400">Add or remove staff accounts</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">

        <button
          onClick={() => navigate('/admin')}
          className="mb-6 text-amber-700 font-medium hover:text-amber-600"
        >
          ← Back to reservations
        </button>

        {error && <ErrorMessage message={error} />}

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100 mb-8">
          <h2 className="font-serif text-xl text-stone-900 mb-4">Add a new employee</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={adding}
              className="py-2 px-6 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
            >
              {adding ? 'Adding...' : 'Add Employee'}
            </button>
          </form>
        </div>

        {loading && <LoadingSpinner label="Loading employees..." />}

        {!loading && (
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Created At</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-stone-100">
                    <td className="px-4 py-3">{u.username}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">{u.createdAt?.split('T')[0]}</td>
                    <td className="px-4 py-3">
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs"
                        >
                          Delete
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
