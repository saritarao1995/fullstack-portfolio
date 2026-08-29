const VARIANTS = {
  success: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
  neutral: 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
  info: 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/30',
};

const Badge = ({ children, variant = 'neutral' }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${VARIANTS[variant]}`}
  >
    {children}
  </span>
);

export default Badge;
