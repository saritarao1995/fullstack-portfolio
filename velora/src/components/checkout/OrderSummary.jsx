import { formatMoney } from '../../utils/format';

const OrderSummary = ({ items, subtotal, deliveryLabel, deliveryFee, total }) => (
  <aside className="rounded-3xl bg-sand p-8">
    <h2 className="font-display text-2xl">Order</h2>
    <ul className="mt-6 space-y-3 text-sm">
      {items.map((item) => (
        <li key={item.id} className="flex justify-between gap-4">
          <span>
            {item.name} × {item.qty}
          </span>
          <span>{formatMoney(item.price * item.qty)}</span>
        </li>
      ))}
    </ul>
    <dl className="mt-6 space-y-2 border-t border-ink/10 pt-4 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-ink-soft">Pieces</dt>
        <dd>{formatMoney(subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-soft">{deliveryLabel}</dt>
        <dd>{deliveryFee ? formatMoney(deliveryFee) : 'Free'}</dd>
      </div>
    </dl>
    <p className="mt-6 flex justify-between font-display text-2xl">
      <span>Total</span>
      <span>{formatMoney(total)}</span>
    </p>
  </aside>
);

export default OrderSummary;
