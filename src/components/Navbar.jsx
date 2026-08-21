import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  'px-3 py-2 rounded-md text-sm font-medium transition-colors ' + (
    isActive
      ? 'bg-amber-700 text-white'
      : 'text-stone-200 hover:bg-amber-800/60 hover:text-white'
  );

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur border-b border-amber-900/40 shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl" aria-hidden>🍽️</span>
            <span className="font-serif text-xl text-amber-100 group-hover:text-amber-300 transition-colors">
              Le Jardin Gourmand
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/menu" className={navLinkClass}>Menu</NavLink>
            <NavLink to="/reservation" className={navLinkClass}>Reservation</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            <NavLink to="/my-reservations" className={navLinkClass}>My Reservations</NavLink>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-800/60 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/reservation"
                  className="inline-flex items-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition-colors"
                >
                  Book a Table
                </Link>
              </>
            )}

            {user && (user.role === 'admin' || user.role === 'staff') && (
              <Link
                to="/admin"
                className="inline-flex items-center rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-800/60 transition-colors"
              >
                Dashboard
              </Link>
            )}

            {user && user.role === 'admin' && (
              <>
                <Link
                  to="/manage-menu"
                  className="inline-flex items-center rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-800/60 transition-colors"
                >
                  Menu
                </Link>
                <Link
                  to="/manage-employees"
                  className="inline-flex items-center rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-800/60 transition-colors"
                >
                  Employees
                </Link>
              </>
            )}

            {user && user.role === 'staff' && (
              <Link
                to="/manage-customers"
                className="inline-flex items-center rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-800/60 transition-colors"
              >
                Customers
              </Link>
            )}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center rounded-full border border-stone-500 px-4 py-2 text-sm font-semibold text-stone-200 hover:bg-stone-800/60 transition-colors"
              >
                Logout ({user.username})
              </button>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-stone-200"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/menu" className={navLinkClass} onClick={() => setOpen(false)}>Menu</NavLink>
            <NavLink to="/reservation" className={navLinkClass} onClick={() => setOpen(false)}>Reservation</NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setOpen(false)}>Contact</NavLink>
            <NavLink to="/my-reservations" className={navLinkClass} onClick={() => setOpen(false)}>My Reservations</NavLink>

            {!user && (
              <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>Sign In</NavLink>
            )}

            {user && (user.role === 'admin' || user.role === 'staff') && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
            )}

            {user && user.role === 'admin' && (
              <>
                <NavLink to="/manage-menu" className={navLinkClass} onClick={() => setOpen(false)}>Manage Menu</NavLink>
                <NavLink to="/manage-employees" className={navLinkClass} onClick={() => setOpen(false)}>Manage Employees</NavLink>
              </>
            )}

            {user && user.role === 'staff' && (
              <NavLink to="/manage-customers" className={navLinkClass} onClick={() => setOpen(false)}>Manage Customers</NavLink>
            )}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-left text-stone-200 hover:bg-amber-800/60"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
