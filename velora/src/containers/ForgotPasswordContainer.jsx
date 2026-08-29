import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { selectCompany } from '../store/selectors/settingsSelectors';
import { requestPasswordReset } from '../store/thunks/authThunks';

const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 outline-none focus:border-clay';

const ForgotPasswordContainer = () => {
  const dispatch = useDispatch();
  const company = useSelector(selectCompany);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleEmail = (event) => {
    setError('');
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    const result = await dispatch(requestPasswordReset(email));
    setBusy(false);
    if (requestPasswordReset.fulfilled.match(result)) {
      setDone(true);
      return;
    }
    setError(result.payload || 'Could not send the reset email.');
  };

  return (
    <section className="mx-auto flex max-w-lg justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.22em] text-clay">Account</p>
        <h1 className="mt-2 font-display text-4xl">Forgot password</h1>
        {done ? (
          <p className="mt-4 text-sm text-ink-soft">
            If that email is on our books, we sent a reset link. Also check spam. You can still call{' '}
            {company.phone}.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <p className="text-sm text-ink-soft">
              Enter the email on your account. Or call {company.phone} and we will help from the
              showroom.
            </p>
            <label className="block text-sm">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={handleEmail}
                className={FIELD}
                autoComplete="email"
              />
            </label>
            {error ? <p className="text-sm text-clay-deep">{error}</p> : null}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        )}
        <p className="mt-6 text-sm text-ink-soft">
          <Link to="/login" className="text-clay">
            Back to sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPasswordContainer;
