import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

// génère les classes CSS d'un lien de nav selon s'il est actif ou non
const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-amber-700 text-white'
      : 'text-stone-200 hover:bg-amber-800/60 hover:text-white'
  }`;

// Barre de navigation fixée en haut de page avec les liens et les boutons d'action
// sur mobile les liens sont cachés et remplacés par un menu hamburger
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur border-b border-amber-900/40 shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl" aria-hidden>
              🍽️
            </span>
            <span className="font-serif text-xl text-amber-100 group-hover:text-amber-300 transition-colors">
              Olympique de Marseille
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/menu" className={navLinkClass}>
              Menu
            </NavLink>
            <NavLink to="/reservation" className={navLinkClass}>
              Reservation
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </div>

          {/* boutons d'action rapide visibles sur tablette et desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/my-reservations"
              className="inline-flex items-center rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-800/60 transition-colors"
            >
              My Reservations
            </Link>
            <Link
              to="/reservation"
              className="inline-flex items-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition-colors"
            >
              Book a Table
            </Link>
          </div>

          {/* bouton hamburger affiché uniquement sur mobile pour ouvrir/fermer le menu */}
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

        {/* menu déroulant mobile affiché quand open est true */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/menu" className={navLinkClass} onClick={() => setOpen(false)}>
              Menu
            </NavLink>
            <NavLink to="/reservation" className={navLinkClass} onClick={() => setOpen(false)}>
              Reservation
            </NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setOpen(false)}>
              Contact
            </NavLink>
            <NavLink to="/my-reservations" className={navLinkClass} onClick={() => setOpen(false)}>
              My Reservations
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
