import { useDispatch, useSelector } from 'react-redux';
import StatCard, { formatStatValue } from '../components/admin/StatCard';
import RevenueChart from '../components/admin/RevenueChart';
import OrdersTable from '../components/admin/OrdersTable';
import { selectOrderStats, selectOrders } from '../store/selectors/orderSelectors';
import { markOrderDeliverToday, markOrderShipped } from '../store/thunks/orderThunks';

const STATS = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'orders', label: 'Orders' },
  { key: 'open', label: 'Open' },
  { key: 'aov', label: 'Avg. order' },
];

const AdminDashboardContainer = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectOrderStats);
  const orders = useSelector(selectOrders);

  const handleShip = (id) => {
    dispatch(markOrderShipped(id));
  };

  const handleDeliverToday = (id) => {
    dispatch(markOrderDeliverToday(id));
  };

  return (
    <section className="px-6 py-10 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">Overview</p>
      <h1 className="mt-2 font-display text-4xl">The floor is moving.</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((item) => (
          <StatCard key={item.key} label={item.label} value={formatStatValue(item.key, stats)} />
        ))}
      </div>
      <div className="mt-8">
        <RevenueChart />
      </div>
      <h2 className="mt-10 font-display text-2xl">Latest tickets</h2>
      <div className="mt-4">
        <OrdersTable
          orders={orders.slice(0, 5)}
          onShip={handleShip}
          onDeliverToday={handleDeliverToday}
        />
      </div>
    </section>
  );
};

export default AdminDashboardContainer;
