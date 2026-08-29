const StatTile = ({ label, value, hint }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
  </div>
);

export default StatTile;
