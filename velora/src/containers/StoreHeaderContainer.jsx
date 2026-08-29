import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreHeader from '../components/layout/StoreHeader';
import {
  selectAuthUser,
  selectIsAuthenticated,
  selectIsCustomer,
} from '../store/selectors/authSelectors';
import { selectCompany } from '../store/selectors/settingsSelectors';
import { logout } from '../store/thunks/authThunks';

const StoreHeaderContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const signedIn = useSelector(selectIsAuthenticated);
  const isCustomer = useSelector(selectIsCustomer);
  const company = useSelector(selectCompany);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen((open) => !open);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
  };

  return (
    <StoreHeader
      menuOpen={menuOpen}
      onToggle={handleToggle}
      onClose={handleClose}
      brandName={company.shortName}
      logo={company.logo}
      showStudio={!isCustomer}
      showOrders={isCustomer}
      signedIn={signedIn}
      accountLabel={user?.name?.split(' ')[0] ?? ''}
      onLogout={handleLogout}
    />
  );
};

export default StoreHeaderContainer;
