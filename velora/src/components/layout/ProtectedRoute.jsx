import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthStatus, selectIsStudio } from '../../store/selectors/authSelectors';

const ProtectedRoute = () => {
  const location = useLocation();
  const isStudio = useSelector(selectIsStudio);
  const status = useSelector(selectAuthStatus);

  if (status === 'restoring') {
    return <p className="p-10 text-sm text-ink-soft">Opening the studio…</p>;
  }

  if (!isStudio) {
    return <Navigate to="/studio" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
