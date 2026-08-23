import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
