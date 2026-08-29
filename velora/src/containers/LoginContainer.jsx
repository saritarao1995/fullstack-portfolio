import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import StudioHeroImage from '../components/auth/StudioHeroImage';
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  selectIsStudio,
} from '../store/selectors/authSelectors';
import { login } from '../store/thunks/authThunks';
import { authErrorCleared } from '../store/slices/authSlice';

const LoginContainer = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isStudio = useSelector(selectIsStudio);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmail = (event) => {
    dispatch(authErrorCleared());
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    dispatch(authErrorCleared());
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login({ email, password, expectedRole: 'studio' }));
  };

  if (isStudio) {
    return <Navigate to="/studio/dashboard" replace />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="grid min-h-[calc(100dvh-4.75rem)] lg:h-[calc(100dvh-4.75rem)] lg:grid-cols-2 lg:overflow-hidden">
      <StudioHeroImage />
      <div className="flex items-center px-6 py-10 sm:px-10 lg:px-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
          <p className="text-xs uppercase tracking-[0.22em] text-clay">Studio access</p>
          <h1 className="font-display text-4xl">Sign in as the house.</h1>
          <p className="text-sm text-ink-soft">Staff only. Customers sign in from the header.</p>
          <label className="block text-sm">
            Email
            <input
              type="email"
              value={email}
              onChange={handleEmail}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 outline-none focus:border-clay"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              type="password"
              value={password}
              onChange={handlePassword}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 outline-none focus:border-clay"
            />
          </label>
          {error && <p className="text-sm text-clay-deep">{error}</p>}
          <Button type="submit" disabled={status === 'loading'} className="w-full">
            {status === 'loading' ? 'Checking…' : 'Enter studio'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default LoginContainer;
