import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { formatDate, formatMoney } from '../../utils/format';

const OrderRow = ({ order, onShip, onDeliverToday }) => {
  const handleShip = () => onShip(order.id);
  const handleDeliver = () => onDeliverToday(order.id);
  const canShip = order.status === 'Paid' || order.status === 'Packed' || order.status === 'New';
  const canDeliverToday = order.status === 'Shipped';
  const deliverLabel =
    order.deliveryMethod === 'pickup' ? 'Collect today' : 'Deliver today';

  return (
    <tr className="border-b border-ink/8 text-sm">
      <td className="px-4 py-4 font-medium">
        <Link to={`/studio/orders/${order.id}`} className="hover:text-clay">
          {order.id}
        </Link>
      </td>
      <td className="px-4 py-4">
        {order.customer}
        <span className="block text-xs text-ink-soft">{order.city}</span>
        <span className="block text-xs text-clay">
          {order.deliveryMethod === 'pickup' ? 'Showroom collect' : 'Home delivery'}
        </span>
      </td>
      <td className="px-4 py-4">{formatDate(order.placedAt)}</td>
      <td className="px-4 py-4">{formatMoney(order.total)}</td>
      <td className="px-4 py-4">
        <Badge tone={order.status}>{order.status}</Badge>
      </td>
      <td className="px-4 py-4 text-right">
        {canShip ? (
          <button type="button" onClick={handleShip} className="text-clay underline">
            Mark shipped
          </button>
        ) : null}
        {canDeliverToday ? (
          <button type="button" onClick={handleDeliver} className="text-clay underline">
            {deliverLabel}
          </button>
        ) : null}
      </td>
    </tr>
  );
};

const OrdersTable = ({ orders, onShip, onDeliverToday }) => (
  <div className="overflow-x-auto rounded-3xl bg-white/70 p-2 shadow-sm">
    <table className="w-full min-w-[640px] text-left">
      <thead className="text-xs uppercase tracking-[0.14em] text-ink-soft">
        <tr>
          <th className="px-4 py-3 font-medium">Order</th>
          <th className="px-4 py-3 font-medium">Client</th>
          <th className="px-4 py-3 font-medium">Date</th>
          <th className="px-4 py-3 font-medium">Total</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium" />
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            onShip={onShip}
            onDeliverToday={onDeliverToday}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default OrdersTable;
