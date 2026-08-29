import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import AddressFields from '../components/checkout/AddressFields';
import DeliveryOptions from '../components/checkout/DeliveryOptions';
import OrderSummary from '../components/checkout/OrderSummary';
import { DELIVERY_OPTIONS, SHOWROOM_ADDRESS, getDeliveryOption } from '../data/delivery';
import { formatMoney } from '../utils/format';
import { selectCartItems, selectCartTotal } from '../store/selectors/cartSelectors';
import { selectAuthUser } from '../store/selectors/authSelectors';
import { selectOrderError, selectOrderStatus } from '../store/selectors/orderSelectors';
import { placeOrder } from '../store/thunks/orderThunks';
import { isIndianPhone, isIndianPin } from '../utils/validate';

const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 outline-none focus:border-clay';

const CheckoutContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const status = useSelector(selectOrderStatus);
  const user = useSelector(selectAuthUser);
  const orderError = useSelector(selectOrderError);
  const [formError, setFormError] = useState('');
  const [customer, setCustomer] = useState(user?.name ?? '');
  const [city, setCity] = useState(user?.city || 'Kota');
  const [email, setEmail] = useState(user?.email ?? '');
  const [deliveryId, setDeliveryId] = useState('home');
  const [street, setStreet] = useState('');
  const [pincode, setPincode] = useState('324001');
  const [phone, setPhone] = useState(user?.phone || '');

  const delivery = getDeliveryOption(deliveryId);
  const isHome = deliveryId === 'home';
  const grandTotal = subtotal + delivery.fee;

  const handleCustomer = (event) => setCustomer(event.target.value);
  const handleCity = (event) => setCity(event.target.value);
  const handleEmail = (event) => setEmail(event.target.value);
  const handleStreet = (event) => setStreet(event.target.value);
  const handlePincode = (event) => setPincode(event.target.value);
  const handlePhone = (event) => setPhone(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isIndianPhone(phone)) {
      setFormError('Enter a phone number so we can call about delivery.');
      return;
    }
    if (isHome && !isIndianPin(pincode)) {
      setFormError('Enter a 6-digit PIN code.');
      return;
    }
    if (isHome && !street.trim()) {
      setFormError('Enter the delivery address.');
      return;
    }

    setFormError('');
    const result = await dispatch(
      placeOrder({
        customer,
        city,
        email,
        phone,
        street: isHome ? street : SHOWROOM_ADDRESS,
        pincode: isHome ? pincode : '324001',
        delivery,
      }),
    );

    if (placeOrder.fulfilled.match(result)) {
      navigate(`/pay/${result.payload.id}`);
    }
  };

  if (!items.length) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-xs uppercase tracking-[0.22em] text-clay">Checkout</p>
        <h1 className="font-display text-4xl">Place your showroom order</h1>
        <p className="text-sm text-ink-soft">
          Home delivery or collect from Kota, then pay with Razorpay. Signed in as {user?.email}.
        </p>
        <label className="block text-sm">
          Name
          <input required value={customer} onChange={handleCustomer} className={FIELD} />
        </label>
        <label className="block text-sm">
          City
          <input required value={city} onChange={handleCity} className={FIELD} />
        </label>
        <label className="block text-sm">
          Email
          <input required type="email" value={email} onChange={handleEmail} className={FIELD} />
        </label>
        <DeliveryOptions options={DELIVERY_OPTIONS} selectedId={deliveryId} onSelect={setDeliveryId} />
        {isHome ? (
          <AddressFields
            street={street}
            pincode={pincode}
            phone={phone}
            onStreet={handleStreet}
            onPincode={handlePincode}
            onPhone={handlePhone}
          />
        ) : (
          <div className="space-y-4">
            <p className="rounded-3xl bg-sand p-5 text-sm text-ink-soft">
              Collect from <span className="text-ink">{SHOWROOM_ADDRESS}</span>
            </p>
            <label className="block text-sm">
              Phone for the collection call
              <input required value={phone} onChange={handlePhone} className={FIELD} />
            </label>
          </div>
        )}
        {formError || (status === 'error' && orderError) ? (
          <p className="text-sm text-clay-deep">{formError || orderError}</p>
        ) : null}
        <Button type="submit" disabled={status === 'placing'} className="w-full">
          {status === 'placing' ? 'Saving order…' : `Continue to payment · ${formatMoney(grandTotal)}`}
        </Button>
      </form>
      <OrderSummary
        items={items}
        subtotal={subtotal}
        deliveryLabel={delivery.title}
        deliveryFee={delivery.fee}
        total={grandTotal}
      />
    </section>
  );
};

export default CheckoutContainer;
