import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrdersTable from '../components/admin/OrdersTable';
import { selectOrders } from '../store/selectors/orderSelectors';
import { markOrderDeliverToday, markOrderShipped } from '../store/thunks/orderThunks';

const AdminOrdersContainer = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [query, setQuery] = useState('');

  const handleQuery = (event) => {
    setQuery(event.target.value);
  };

  const handleShip = (id) => {
    dispatch(markOrderShipped(id));
  };

  const handleDeliverToday = (id) => {
    dispatch(markOrderDeliverToday(id));
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return orders;

    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(needle) ||
        order.customer.toLowerCase().includes(needle) ||
        order.city.toLowerCase().includes(needle),
    );
  }, [orders, query]);

  return (
    <section className="px-6 py-10 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">Fulfillment</p>
      <h1 className="mt-2 font-display text-4xl">Orders</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        Place a bag order on the storefront — it appears here. Open a ticket for line items.
      </p>
      <input
        value={query}
        onChange={handleQuery}
        placeholder="Search name, city, or order id…"
        className="mt-8 w-full max-w-sm rounded-full border border-ink/10 bg-white/70 px-5 py-3 text-sm outline-none focus:border-clay"
      />
      <div className="mt-6">
        <OrdersTable orders={visible} onShip={handleShip} onDeliverToday={handleDeliverToday} />
      </div>
    </section>
  );
};

export default AdminOrdersContainer;
