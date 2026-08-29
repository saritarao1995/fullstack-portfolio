import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDate, formatMoney } from '../../utils/format';

const OrderDetailCard = ({ order, onShip, onDeliverToday }) => {
  const canShip = order.status === 'Paid' || order.status === 'Packed' || order.status === 'New';
  const canDeliverToday = order.status === 'Shipped';
  const deliverLabel =
    order.deliveryMethod === 'pickup' ? 'Ready to collect today' : 'Deliver today';

  return (
    <article className="rounded-3xl bg-white/70 p-8 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">{order.id}</p>
          <h1 className="mt-2 font-display text-4xl">{order.customer}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {order.city} · {order.email} · {formatDate(order.placedAt)}
          </p>
          <p className="mt-3 text-sm">
            {order.deliveryLabel ?? 'Delivery'}
            {order.eta ? ` · ${order.eta}` : ''}
          </p>
          {order.street ? <p className="mt-1 text-sm text-ink-soft">{order.street}</p> : null}
          {order.phone ? <p className="text-sm text-ink-soft">{order.phone}</p> : null}
          {order.paymentId ? (
            <p className="mt-2 text-xs text-ink-soft">Payment {order.paymentId}</p>
          ) : null}
        </div>
        <Badge tone={order.status}>{order.status}</Badge>
      </div>
      <ul className="mt-8 space-y-3 border-t border-ink/8 pt-6 text-sm">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>{formatMoney(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>
      {typeof order.deliveryFee === 'number' ? (
        <p className="mt-4 flex justify-between text-sm text-ink-soft">
          <span>{order.deliveryLabel}</span>
          <span>{order.deliveryFee ? formatMoney(order.deliveryFee) : 'Free'}</span>
        </p>
      ) : null}
      <p className="mt-6 flex justify-between font-display text-2xl">
        <span>Total</span>
        <span>{formatMoney(order.total)}</span>
      </p>
      {order.notices?.length ? (
        <div className="mt-6 rounded-2xl bg-sand p-4 text-sm text-ink-soft">
          <p className="font-medium text-ink">Customer alerts</p>
          {order.notices.slice(-4).map((notice, index) => (
            <p key={`${notice.at}-${index}`} className="mt-2">
              {notice.channel} → {notice.to} ({notice.demo ? 'demo' : notice.provider || 'sent'})
            </p>
          ))}
        </div>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        {canShip ? <Button onClick={onShip}>Mark shipped</Button> : null}
        {canDeliverToday ? <Button onClick={onDeliverToday}>{deliverLabel}</Button> : null}
        <Link to="/studio/orders">
          <Button variant="ghost">Back to orders</Button>
        </Link>
      </div>
    </article>
  );
};

export default OrderDetailCard;
