const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-clay';

const ImageField = ({ label, hint, value, busy, onFile, onUrl }) => {
  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onFile(file);
  };

  const handleUrl = (event) => onUrl(event.target.value);

  return (
    <div className="space-y-2 sm:col-span-2">
      <p className="text-sm">{label}</p>
      <div className="h-36 w-full overflow-hidden rounded-2xl bg-sand sm:w-64">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-ink px-5 py-2 text-sm text-parchment">
        {busy ? 'Uploading…' : 'Choose from computer'}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={busy} />
      </label>
      {hint ? <p className="text-xs text-ink-soft">{hint}</p> : null}
      <label className="block text-sm">
        Or paste an image link
        <input value={value} onChange={handleUrl} className={FIELD} placeholder="https://…" />
      </label>
    </div>
  );
};

export default ImageField;
