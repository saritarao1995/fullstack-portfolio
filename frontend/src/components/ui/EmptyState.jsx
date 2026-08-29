const EmptyState = ({ title, detail, action }) => (
  <div className="rounded-2xl border border-dashed border-slate-800 px-6 py-12 text-center">
    <p className="text-sm font-semibold text-slate-300">{title}</p>
    {detail && <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{detail}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;
