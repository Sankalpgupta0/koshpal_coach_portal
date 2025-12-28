import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || user.role !== 'COACH') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
