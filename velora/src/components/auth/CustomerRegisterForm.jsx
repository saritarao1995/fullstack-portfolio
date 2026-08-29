import Button from '../ui/Button';

const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 outline-none focus:border-clay';

const CustomerRegisterForm = ({
  name,
  email,
  phone,
  password,
  error,
  busy,
  onName,
  onEmail,
  onPhone,
  onPassword,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="w-full max-w-md space-y-5">
    <p className="text-xs uppercase tracking-[0.22em] text-clay">Customer</p>
    <h1 className="font-display text-4xl">Create an account</h1>
    <p className="text-sm text-ink-soft">
      Saved on the showroom so you can check out, pay, and receive shipping alerts on email, SMS,
      and WhatsApp.
    </p>
    <label className="block text-sm">
      Name
      <input required value={name} onChange={onName} className={FIELD} autoComplete="name" />
    </label>
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
      Phone
      <input
        type="tel"
        required
        value={phone}
        onChange={onPhone}
        className={FIELD}
        autoComplete="tel"
        placeholder="+91 …"
      />
    </label>
    <label className="block text-sm">
      Password
      <input
        type="password"
        required
        minLength={6}
        value={password}
        onChange={onPassword}
        className={FIELD}
        autoComplete="new-password"
      />
    </label>
    {error ? <p className="text-sm text-clay-deep">{error}</p> : null}
    <Button type="submit" disabled={busy} className="w-full">
      {busy ? 'Creating…' : 'Create account'}
    </Button>
  </form>
);

export default CustomerRegisterForm;
