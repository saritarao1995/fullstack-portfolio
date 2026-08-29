import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CartLine from '../components/cart/CartLine';
import Button from '../components/ui/Button';
import { formatMoney } from '../utils/format';
import { selectCartItems, selectCartTotal } from '../store/selectors/cartSelectors';
import { selectIsAuthenticated } from '../store/selectors/authSelectors';
import { itemRemoved, qtyChanged } from '../store/slices/cartSlice';

const CartPageContainer = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleIncrease = (id) => {
    const line = items.find((item) => item.id === id);
    if (line) dispatch(qtyChanged({ id, qty: line.qty + 1 }));
  };

  const handleDecrease = (id) => {
    const line = items.find((item) => item.id === id);
    if (line) dispatch(qtyChanged({ id, qty: line.qty - 1 }));
  };

  const handleRemove = (id) => {
    dispatch(itemRemoved(id));
  };

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-ink-soft">The collection is waiting.</p>
        <Link to="/shop" className="mt-8 inline-block">
          <Button>Browse pieces</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-5xl">Bag</h1>
      <div className="mt-8">
        {items.map((item) => (
          <CartLine
            key={item.id}
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <p className="text-ink-soft">Total</p>
        <p className="font-display text-3xl">{formatMoney(total)}</p>
      </div>
      {isAuthenticated ? (
        <Link to="/checkout" className="mt-8 block">
          <Button className="w-full">Checkout — delivery or showroom collect</Button>
        </Link>
      ) : (
        <Link to="/login" state={{ from: '/checkout' }} className="mt-8 block">
          <Button className="w-full">Sign in to checkout</Button>
        </Link>
      )}
      <p className="mt-3 text-center text-sm text-ink-soft">
        {isAuthenticated
          ? 'Online home delivery (white-glove) or collect from the Kota showroom. Fee is added at checkout.'
          : 'Sign in (or create an account) to place an order. You can still browse the collection.'}
      </p>
    </section>
  );
};

export default CartPageContainer;
