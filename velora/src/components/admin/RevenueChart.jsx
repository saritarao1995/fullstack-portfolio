const POINTS = '0,88 40,72 80,76 120,48 160,52 200,28 240,36 280,18 320,24';

const RevenueChart = () => (
  <article className="rounded-3xl bg-white/70 p-6 shadow-sm">
    <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Revenue · last 8 orders</p>
    <p className="mt-2 font-display text-2xl">Quiet growth, no spikes.</p>
    <svg viewBox="0 0 320 100" className="mt-6 h-28 w-full" aria-hidden>
      <polyline
        fill="none"
        stroke="#b45a2a"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={POINTS}
      />
    </svg>
  </article>
);

export default RevenueChart;
