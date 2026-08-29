const FIELD =
  'w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-clay';

const CustomSettingsRow = ({ item, onKey, onValue, onRemove }) => {
  const handleKey = (event) => onKey(item.id, event.target.value);
  const handleValue = (event) => onValue(item.id, event.target.value);
  const handleRemove = () => onRemove(item.id);

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <input value={item.key} onChange={handleKey} placeholder="Key" className={FIELD} />
      <input value={item.value} onChange={handleValue} placeholder="Value" className={FIELD} />
      <button type="button" onClick={handleRemove} className="text-sm text-clay underline">
        Remove
      </button>
    </div>
  );
};

export default CustomSettingsRow;
