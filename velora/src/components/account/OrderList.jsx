import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { formatDate, formatMoney } from '../../utils/format';

const OrderList = ({ orders }) => (
  <div className="mt-8 space-y-4">
    {orders.map((order) => (
      <Link
        key={order.id}
        to={`/order/${order.id}`}
        className="block rounded-3xl bg-white/70 p-5 shadow-sm hover:bg-white"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-medium">{order.id}</p>
            <p className="mt-1 text-sm text-ink-soft">
              {formatDate(order.placedAt)} · {order.deliveryLabel}
            </p>
          </div>
          <div className="text-right">
            <p>{formatMoney(order.total)}</p>
            <div className="mt-2">
              <Badge tone={order.status}>{order.status}</Badge>
            </div>
          </div>
        </div>
      </Link>
    ))}
  </div>
);

export default OrderList;
