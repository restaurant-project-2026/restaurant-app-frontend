import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// bloque l'accès si l'utilisateur n'est pas connecté ou n'a pas le bon rôle
export default function ProtectedRoute({ children, roles = [] }) {
  const { user, ready } = useAuth();

  if (!ready) {
    return <LoadingSpinner label="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
