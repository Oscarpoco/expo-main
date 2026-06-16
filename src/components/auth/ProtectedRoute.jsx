import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, userProfile, loading } = useAuth();

  if (loading) return <LoadingSpinner message="Authenticating..." />;

  if (!user) return <Navigate to="/login" replace />;

  if (!userProfile) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Profile Not Found</h2>
          <p>Your account exists but no profile was found. Please sign out and register again.</p>
        </div>
      </div>
    );
  }

  return children;
}
