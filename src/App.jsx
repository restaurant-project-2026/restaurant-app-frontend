import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ManageMenu from './pages/ManageMenu';
import MyReservations from './pages/MyReservations';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/my-reservations" element={<MyReservations />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={['admin', 'staff']}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-menu"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <ManageMenu />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
