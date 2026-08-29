import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/selectors/cartSelectors';

const CartBadgeContainer = () => {
  const count = useSelector(selectCartCount);
  if (!count) return null;

  return (
    <span className="ml-1.5 rounded-full bg-clay px-2 py-0.5 text-[11px] text-parchment">{count}</span>
  );
};

export default CartBadgeContainer;
