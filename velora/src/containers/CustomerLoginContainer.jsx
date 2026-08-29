import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router-dom';
import CustomerLoginForm from '../components/auth/CustomerLoginForm';
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '../store/selectors/authSelectors';
import { authErrorCleared } from '../store/slices/authSlice';
import { login } from '../store/thunks/authThunks';

const CustomerLoginContainer = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const from = location.state?.from || '/';

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
    dispatch(login({ email, password, expectedRole: 'customer' }));
  };

  if (status === 'restoring') {
    return <p className="px-6 py-24 text-center text-sm text-ink-soft">Checking your account…</p>;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <section className="mx-auto flex max-w-lg justify-center px-6 py-16">
      <div className="w-full">
        <CustomerLoginForm
          email={email}
          password={password}
          error={error}
          busy={status === 'loading'}
          onEmail={handleEmail}
          onPassword={handlePassword}
          onSubmit={handleSubmit}
        />
        <p className="mt-6 text-sm text-ink-soft">
          <Link to="/forgot" className="text-clay">
            Forgot password
          </Link>
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          New here?{' '}
          <Link to="/register" state={{ from }} className="text-clay">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default CustomerLoginContainer;
