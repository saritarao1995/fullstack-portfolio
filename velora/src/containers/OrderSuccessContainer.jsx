import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatMoney } from '../utils/format';
import { selectIsStudio } from '../store/selectors/authSelectors';
import { selectOrderById, selectOrdersHydrated } from '../store/selectors/orderSelectors';
import { loadOrder } from '../store/thunks/orderThunks';

const OrderSuccessContainer = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((state) => selectOrderById(state, orderId));
  const hydrated = useSelector(selectOrdersHydrated);
  const isStudio = useSelector(selectIsStudio);
  const isHome = order?.deliveryMethod === 'home';

  useEffect(() => {
    if (!order) dispatch(loadOrder(orderId));
  }, [dispatch, order, orderId]);

  if (!order && !hydrated) {
    return <p className="px-6 py-24 text-center text-sm text-ink-soft">Loading your order…</p>;
  }

  if (order?.status === 'Awaiting payment') {
    return <Navigate to={`/pay/${order.id}`} replace />;
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">Order</p>
      <h1 className="mt-3 font-display text-5xl">Thank you.</h1>
      {order ? (
        <div className="mt-6 space-y-2 text-ink-soft">
          <p>
            {order.id} · {formatMoney(order.total)}
          </p>
          <div className="flex justify-center pt-2">
            <Badge tone={order.status}>{order.status}</Badge>
          </div>
          {order.paymentId ? <p>Razorpay · {order.paymentId}</p> : null}
          <p>
            {order.deliveryLabel ?? 'Delivery'} — {order.eta ?? 'We will confirm timing.'}
          </p>
          <p>{order.street}</p>
          {isHome ? (
            <p>White-glove team will call before the van arrives.</p>
          ) : (
            <p>We will phone you when the piece is ready to collect.</p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-ink-soft">That order was not found on this account.</p>
      )}
      <div className="mt-10 flex justify-center gap-3">
        <Link to="/shop">
          <Button variant="ghost">Keep browsing</Button>
        </Link>
        {isStudio ? (
          <Link to="/studio/orders">
            <Button>Open studio</Button>
          </Link>
        ) : (
          <Link to="/orders">
            <Button>Your orders</Button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default OrderSuccessContainer;
