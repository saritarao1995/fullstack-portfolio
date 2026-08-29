import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/thunks/authThunks';
import { selectAuthUser, selectIsAuthenticated } from '../store/selectors/authSelectors';

const AuthStatusContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link to="/admin/profile" className="text-slate-300 hover:text-white">
        {user.name}
      </Link>
      <button
        type="button"
        onClick={() => dispatch(logout())}
        className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
};

export default AuthStatusContainer;
