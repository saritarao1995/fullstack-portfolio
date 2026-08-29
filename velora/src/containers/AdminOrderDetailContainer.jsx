import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import OrderDetailCard from '../components/admin/OrderDetailCard';
import { selectOrderById } from '../store/selectors/orderSelectors';
import { markOrderDeliverToday, markOrderShipped } from '../store/thunks/orderThunks';

const AdminOrderDetailContainer = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((state) => selectOrderById(state, orderId));

  const handleShip = () => {
    dispatch(markOrderShipped(orderId));
  };

  const handleDeliverToday = () => {
    dispatch(markOrderDeliverToday(orderId));
  };

  if (!order) {
    return (
      <section className="px-6 py-10 sm:px-8">
        <p>That ticket is not on the board.</p>
        <Link to="/studio/orders" className="mt-4 inline-block text-clay">
          Back to orders
        </Link>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">Ticket</p>
      <div className="mt-6">
        <OrderDetailCard order={order} onShip={handleShip} onDeliverToday={handleDeliverToday} />
      </div>
    </section>
  );
};

export default AdminOrderDetailContainer;
