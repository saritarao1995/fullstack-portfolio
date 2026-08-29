import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import { formatMoney } from '../utils/format';
import {
  selectOrderById,
  selectOrderError,
  selectOrderStatus,
  selectOrdersHydrated,
} from '../store/selectors/orderSelectors';
import { selectCompany, selectPaymentsConfigured } from '../store/selectors/settingsSelectors';
import { loadOrder, payOrder } from '../store/thunks/orderThunks';

const PayContainer = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((state) => selectOrderById(state, orderId));
  const status = useSelector(selectOrderStatus);
  const hydrated = useSelector(selectOrdersHydrated);
  const error = useSelector(selectOrderError);
  const company = useSelector(selectCompany);
  const configured = useSelector(selectPaymentsConfigured);

  useEffect(() => {
    if (!order) dispatch(loadOrder(orderId));
  }, [dispatch, order, orderId]);

  const handlePay = () => {
    dispatch(payOrder(orderId));
  };

  if (!order && !hydrated) {
    return <p className="px-6 py-24 text-center text-sm text-ink-soft">Loading your order…</p>;
  }

  if (!order) {
    return (
      <section className="px-6 py-24 text-center">
        <p>That order was not found.</p>
        <Link to="/orders" className="mt-4 inline-block text-clay">
          Your orders
        </Link>
      </section>
    );
  }

  if (order.status === 'Paid' || order.paymentId) {
    return <Navigate to={`/order/${order.id}`} replace />;
  }

  return (
    <section className="mx-auto max-w-lg px-6 py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">Payment</p>
      <h1 className="mt-2 font-display text-4xl">Pay for {order.id}</h1>
      <p className="mt-4 text-ink-soft">
        {order.deliveryLabel}. Amount {formatMoney(order.total)} via Razorpay.
      </p>
      <div className="mt-8 rounded-3xl bg-sand p-6 text-sm text-ink-soft">
        <p className="font-medium text-ink">{company.name} · Razorpay</p>
        {configured ? (
          <p className="mt-2">A Razorpay window will open to complete the card or UPI payment.</p>
        ) : (
          <p className="mt-2">
            Online payment is not open yet. Call {company.phone} to complete {order.id}. Your
            order is saved as awaiting payment.
          </p>
        )}
      </div>
      {status === 'error' ? (
        <p className="mt-4 text-sm text-clay-deep">{error || 'Payment was cancelled or failed. Try again.'}</p>
      ) : null}
      <div className="mt-8">
        {configured ? (
          <Button onClick={handlePay} disabled={status === 'paying'} className="w-full">
            {status === 'paying' ? 'Opening gateway…' : `Pay ${formatMoney(order.total)}`}
          </Button>
        ) : (
          <a href={`tel:${company.phone}`} className="block">
            <Button className="w-full">Call the showroom</Button>
          </a>
        )}
      </div>
      <Link to="/orders" className="mt-4 block text-center text-sm text-ink-soft">
        Your orders
      </Link>
    </section>
  );
};

export default PayContainer;
