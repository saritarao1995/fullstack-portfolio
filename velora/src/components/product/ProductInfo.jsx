import { formatMoney } from '../../utils/format';
import Button from '../ui/Button';

const ProductInfo = ({ product, qty, onIncrease, onDecrease, onAdd }) => (
  <div>
    <p className="text-xs uppercase tracking-[0.2em] text-clay">{product.category}</p>
    <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">{product.name}</h1>
    <p className="mt-4 text-2xl">{formatMoney(product.price)}</p>
    <p className="mt-5 text-ink-soft">{product.story}</p>
    <ul className="mt-6 space-y-2 text-sm text-ink-soft">
      {product.specs.map((spec) => (
        <li key={spec}>— {spec}</li>
      ))}
    </ul>
    <p className="mt-5 rounded-2xl bg-sand px-4 py-3 text-sm text-ink-soft">
      Order online after you sign in: white-glove home delivery, or collect from the Kota showroom.
    </p>
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3 rounded-full bg-sand px-3 py-2">
        <button type="button" onClick={onDecrease} className="h-8 w-8 rounded-full bg-white">
          −
        </button>
        <span className="w-6 text-center text-sm">{qty}</span>
        <button type="button" onClick={onIncrease} className="h-8 w-8 rounded-full bg-white">
          +
        </button>
      </div>
      <Button onClick={onAdd}>Add {qty > 1 ? `${qty} to bag` : 'to bag'}</Button>
    </div>
  </div>
);

export default ProductInfo;
