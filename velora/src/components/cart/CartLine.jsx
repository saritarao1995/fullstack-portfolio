import { formatMoney } from '../../utils/format';

const CartLine = ({ item, onIncrease, onDecrease, onRemove }) => {
  const handleIncrease = () => onIncrease(item.id);
  const handleDecrease = () => onDecrease(item.id);
  const handleRemove = () => onRemove(item.id);

  return (
    <article className="grid grid-cols-[88px_1fr_auto] items-center gap-4 border-b border-ink/8 py-5">
      <img src={item.image} alt="" className="h-20 w-20 rounded-2xl object-cover" />
      <div>
        <h3 className="font-display text-xl">{item.name}</h3>
        <p className="mt-1 text-sm text-ink-soft">{formatMoney(item.price)}</p>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <button type="button" onClick={handleDecrease} className="h-8 w-8 rounded-full bg-sand">
            −
          </button>
          <span>{item.qty}</span>
          <button type="button" onClick={handleIncrease} className="h-8 w-8 rounded-full bg-sand">
            +
          </button>
          <button type="button" onClick={handleRemove} className="ml-2 text-ink-soft underline">
            Remove
          </button>
        </div>
      </div>
      <p className="text-sm">{formatMoney(item.price * item.qty)}</p>
    </article>
  );
};

export default CartLine;
