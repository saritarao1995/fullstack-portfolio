import Spinner from './Spinner';

const VARIANTS = {
  primary:
    'bg-indigo-500 text-white hover:bg-indigo-400 focus:ring-indigo-400/50 disabled:hover:bg-indigo-500',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-400/50',
  ghost:
    'border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white focus:ring-slate-600',
};

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    {...props}
  >
    {loading && <Spinner className="h-4 w-4" />}
    {children}
  </button>
);

export default Button;
