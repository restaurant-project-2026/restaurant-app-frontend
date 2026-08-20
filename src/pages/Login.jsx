import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/users';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(username, password);
      login(data);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/admin');
      }
    } catch {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-12 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Sign In</h1>
        <p className="text-stone-400">Employee or boss access</p>
      </section>
      <div className="max-w-md mx-auto px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-stone-100 text-left"
        >
          {error && (
            <p className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm border border-red-200">
              {error}
            </p>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="ex: admin"
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="mt-6 p-4 bg-stone-50 rounded-lg text-xs text-stone-600 space-y-1">
            <p className="font-medium text-stone-700">Comptes disponibles</p>
            <p>Admin — username: admin / password: password123</p>
            <p>Staff — username: staff1 / password: password123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
