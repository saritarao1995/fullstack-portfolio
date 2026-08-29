const TONES = {
  New: 'bg-clay/10 text-clay-deep',
  Packed: 'bg-sand text-ink-soft',
  Shipped: 'bg-moss/15 text-moss',
  'Out for delivery': 'bg-clay/15 text-clay-deep',
  Delivered: 'bg-ink/8 text-ink-soft',
  Paid: 'bg-moss/15 text-moss',
  'Awaiting payment': 'bg-clay/15 text-clay-deep',
};

const Badge = ({ children, tone = 'New' }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ${TONES[tone] ?? TONES.New}`}
  >
    {children}
  </span>
);

export default Badge;
