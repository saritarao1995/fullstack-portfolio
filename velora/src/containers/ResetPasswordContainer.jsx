import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import { confirmPasswordReset } from '../store/thunks/authThunks';

const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 outline-none focus:border-clay';

const ResetPasswordContainer = () => {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handlePassword = (event) => {
    setError('');
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setError('That reset link is missing a token.');
      return;
    }
    setBusy(true);
    const result = await dispatch(confirmPasswordReset({ token, password }));
    setBusy(false);
    if (confirmPasswordReset.fulfilled.match(result)) {
      setDone(true);
      return;
    }
    setError(result.payload || 'Could not reset the password.');
  };

  return (
    <section className="mx-auto flex max-w-lg justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.22em] text-clay">Account</p>
        <h1 className="mt-2 font-display text-4xl">New password</h1>
        {done ? (
          <p className="mt-4 text-sm text-ink-soft">
            Password saved.{' '}
            <Link to="/login" className="text-clay">
              Sign in
            </Link>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block text-sm">
              New password
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={handlePassword}
                className={FIELD}
                autoComplete="new-password"
              />
            </label>
            {error ? <p className="text-sm text-clay-deep">{error}</p> : null}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? 'Saving…' : 'Save password'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ResetPasswordContainer;
