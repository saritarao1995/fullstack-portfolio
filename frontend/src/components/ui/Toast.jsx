const VARIANTS = {
  success: 'border-emerald-700/60 bg-emerald-950/80 text-emerald-200',
  error: 'border-rose-800/60 bg-rose-950/80 text-rose-200',
  info: 'border-slate-700 bg-slate-900/90 text-slate-200',
};

const Toast = ({ toast, onDismiss }) => (
  <div
    role="status"
    className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg shadow-black/30 backdrop-blur ${
      VARIANTS[toast.variant] ?? VARIANTS.info
    }`}
  >
    <p className="flex-1">{toast.message}</p>
    <button
      type="button"
      onClick={() => onDismiss(toast.id)}
      aria-label="Dismiss notification"
      className="text-current opacity-60 transition hover:opacity-100"
    >
      ✕
    </button>
  </div>
);

export default Toast;
