import { formatMoney } from '../../utils/format';

const DeliveryOption = ({ option, selected, onSelect }) => {
  const handleSelect = () => onSelect(option.id);

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={`w-full rounded-3xl border p-5 text-left transition ${
        selected ? 'border-clay bg-white' : 'border-ink/10 bg-white/50 hover:border-ink/25'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-xl">{option.title}</p>
        <p className="text-sm">{option.fee ? formatMoney(option.fee) : 'Free'}</p>
      </div>
      <p className="mt-2 text-sm text-ink-soft">{option.body}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-clay">{option.eta}</p>
    </button>
  );
};

export default DeliveryOption;
