import Button from '../ui/Button';

const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 outline-none focus:border-clay';

const CustomerLoginForm = ({
  email,
  password,
  error,
  busy,
  onEmail,
  onPassword,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="w-full max-w-md space-y-5">
    <p className="text-xs uppercase tracking-[0.22em] text-clay">Customer</p>
    <h1 className="font-display text-4xl">Sign in to buy</h1>
    <p className="text-sm text-ink-soft">
      The collection is open to browse. Sign in to place an order and pay.
    </p>
    <label className="block text-sm">
      Email
      <input
        type="email"
        required
        value={email}
        onChange={onEmail}
        className={FIELD}
        autoComplete="email"
      />
    </label>
    <label className="block text-sm">
      Password
      <input
        type="password"
        required
        value={password}
        onChange={onPassword}
        className={FIELD}
        autoComplete="current-password"
      />
    </label>
    {error ? <p className="text-sm text-clay-deep">{error}</p> : null}
    <Button type="submit" disabled={busy} className="w-full">
      {busy ? 'Checking…' : 'Sign in'}
    </Button>
  </form>
);

export default CustomerLoginForm;
