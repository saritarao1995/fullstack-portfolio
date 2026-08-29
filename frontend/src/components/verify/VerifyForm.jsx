import Spinner from '../ui/Spinner';

const VerifyForm = ({ value, isVerifying, onChange, onSubmit, onReset }) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Enter Certificate ID, e.g. CERT-1001"
      aria-label="Certificate ID"
      autoComplete="off"
      spellCheck="false"
      className="flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 font-mono text-sm text-slate-100 placeholder:font-sans placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
    />

    <div className="flex gap-3">
      <button
        type="submit"
        disabled={isVerifying}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
      >
        {isVerifying && <Spinner className="h-4 w-4" />}
        {isVerifying ? 'Verifying' : 'Verify'}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-600"
      >
        Clear
      </button>
    </div>
  </form>
);

export default VerifyForm;
