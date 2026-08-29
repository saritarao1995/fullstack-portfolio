import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { login } from '../store/thunks/authThunks';
import {
  selectAuthError,
  selectIsAuthenticated,
  selectIsAuthLoading,
} from '../store/selectors/authSelectors';

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsAuthLoading);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState('admin@certchain.local');
  const [password, setPassword] = useState('Admin@12345');

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(login({ email, password }));
    },
    [dispatch, email, password],
  );

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || '/admin'} replace />;
  }

  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        title="Institute login"
        description="JWT protects the dashboard APIs. Issuing still requires the authorised wallet — a stolen password cannot write to the chain."
      />

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <Button type="submit" loading={isLoading}>
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
