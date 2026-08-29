import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router-dom';
import CustomerRegisterForm from '../components/auth/CustomerRegisterForm';
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '../store/selectors/authSelectors';
import { authErrorCleared } from '../store/slices/authSlice';
import { register } from '../store/thunks/authThunks';

const CustomerRegisterContainer = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const from = location.state?.from || '/';

  const handleName = (event) => {
    dispatch(authErrorCleared());
    setName(event.target.value);
  };

  const handleEmail = (event) => {
    dispatch(authErrorCleared());
    setEmail(event.target.value);
  };

  const handlePhone = (event) => {
    dispatch(authErrorCleared());
    setPhone(event.target.value);
  };

  const handlePassword = (event) => {
    dispatch(authErrorCleared());
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(register({ name, email, phone, password }));
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
        <CustomerRegisterForm
          name={name}
          email={email}
          phone={phone}
          password={password}
          error={error}
          busy={status === 'loading'}
          onName={handleName}
          onEmail={handleEmail}
          onPhone={handlePhone}
          onPassword={handlePassword}
          onSubmit={handleSubmit}
        />
        <p className="mt-6 text-sm text-ink-soft">
          Already have an account?{' '}
          <Link to="/login" state={{ from }} className="text-clay">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default CustomerRegisterContainer;
