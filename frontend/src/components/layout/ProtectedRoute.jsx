import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthStatus, selectIsAuthenticated } from '../../store/selectors/authSelectors';
import Spinner from '../ui/Spinner';

const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectAuthStatus);

  if (status === 'restoring') {
    return (
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <Spinner className="h-4 w-4" />
        Restoring session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
