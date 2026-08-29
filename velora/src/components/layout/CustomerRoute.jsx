import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthStatus, selectIsAuthenticated } from '../../store/selectors/authSelectors';

const CustomerRoute = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectAuthStatus);

  if (status === 'restoring') {
    return <p className="px-6 py-24 text-center text-sm text-ink-soft">Checking your account…</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default CustomerRoute;
