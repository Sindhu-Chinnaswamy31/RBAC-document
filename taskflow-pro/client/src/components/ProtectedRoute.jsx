// client/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to='/login' replace />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
};

export default ProtectedRoute;
