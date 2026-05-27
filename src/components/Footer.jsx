import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 border-t border-amber-900/30 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg text-amber-100 mb-2">Olympique de Marseille</h3>
            <p className="text-sm leading-relaxed">
              Fine dining in the heart of Tel Aviv. Fresh ingredients, warm atmosphere.
            </p>
          </div>
          <div>
            <h4 className="text-amber-200 font-medium mb-2">Navigation</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-amber-400 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="hover:text-amber-400 transition-colors">
                  Reservation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-200 font-medium mb-2">Hours</h4>
            <p className="text-sm">Tue – Sat: 12:00 – 14:30, 19:00 – 23:00</p>
            <p className="text-sm">Sunday: 12:00 – 15:00</p>
            <p className="text-sm mt-2">14 HaYarkon Street, Tel Aviv</p>
          </div>
        </div>
        <p className="text-center text-xs text-stone-500 mt-8 pt-6 border-t border-stone-800">
          © {new Date().getFullYear()} Olympique de Marseille — Projet final
        </p>
      </div>
    </footer>
  );
}
