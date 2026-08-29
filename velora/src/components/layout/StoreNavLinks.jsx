import { NavLink } from 'react-router-dom';
import CartBadgeContainer from '../../containers/CartBadgeContainer';

const StoreNavLinks = ({ onNavigate, showStudio, showOrders, signedIn, accountLabel, onLogout }) => {
  const handleLogout = () => {
    onLogout();
    onNavigate?.();
  };

  return (
    <>
      <NavLink to="/shop" className="hover:text-ink" onClick={onNavigate}>
        Collection
      </NavLink>
      <NavLink to="/story" className="hover:text-ink" onClick={onNavigate}>
        Atelier
      </NavLink>
      {showStudio ? (
        <NavLink to="/studio" className="hover:text-ink" onClick={onNavigate}>
          Studio
        </NavLink>
      ) : null}
      {showOrders ? (
        <NavLink to="/orders" className="hover:text-ink" onClick={onNavigate}>
          Orders
        </NavLink>
      ) : null}
      <NavLink to="/cart" className="relative hover:text-ink" onClick={onNavigate}>
        Bag
        <CartBadgeContainer />
      </NavLink>
      {signedIn ? (
        <>
          <span className="text-ink">{accountLabel}</span>
          <button type="button" onClick={handleLogout} className="hover:text-ink">
            Sign out
          </button>
        </>
      ) : (
        <NavLink to="/login" className="hover:text-ink" onClick={onNavigate}>
          Sign in
        </NavLink>
      )}
    </>
  );
};

export default StoreNavLinks;
