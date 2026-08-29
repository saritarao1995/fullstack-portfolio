import { formatMoney } from '../../utils/format';

const StatCard = ({ label, value }) => (
  <article className="rounded-3xl bg-white/70 p-6 shadow-sm">
    <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">{label}</p>
    <p className="mt-3 font-display text-3xl">{value}</p>
  </article>
);

export const formatStatValue = (key, stats) => {
  if (key === 'revenue' || key === 'aov') return formatMoney(stats[key]);
  return String(stats[key]);
};

export default StatCard;
