const DataRow = ({ label, value, mono = false }) => (
  <div className="flex flex-col gap-1 border-b border-slate-800/70 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
    <dt className="text-sm text-slate-400">{label}</dt>
    <dd
      className={`break-all text-sm font-medium text-slate-100 sm:text-right ${
        mono ? 'font-mono text-xs sm:text-sm' : ''
      }`}
    >
      {value}
    </dd>
  </div>
);

export default DataRow;
