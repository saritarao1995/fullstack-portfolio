import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import OrderList from '../components/account/OrderList';
import { selectIsStudio } from '../store/selectors/authSelectors';
import { selectOrders, selectOrdersHydrated } from '../store/selectors/orderSelectors';
import { loadOrders } from '../store/thunks/orderThunks';

const AccountOrdersContainer = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const hydrated = useSelector(selectOrdersHydrated);
  const isStudio = useSelector(selectIsStudio);

  useEffect(() => {
    dispatch(loadOrders());
  }, [dispatch]);

  if (isStudio) {
    return <Navigate to="/studio/orders" replace />;
  }

  if (!hydrated) {
    return <p className="px-6 py-24 text-center text-sm text-ink-soft">Loading your orders…</p>;
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">Account</p>
      <h1 className="mt-2 font-display text-4xl">Your orders</h1>
      <p className="mt-2 text-sm text-ink-soft">Status updates also go to your email, SMS, and WhatsApp.</p>
      {orders.length ? (
        <OrderList orders={orders} />
      ) : (
        <p className="mt-10 text-ink-soft">
          No orders yet.{' '}
          <Link to="/shop" className="text-clay">
            Browse the collection
          </Link>
        </p>
      )}
    </section>
  );
};

export default AccountOrdersContainer;
