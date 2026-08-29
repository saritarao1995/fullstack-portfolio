import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import { selectAuthUser } from '../store/selectors/authSelectors';
import { selectCompany } from '../store/selectors/settingsSelectors';
import { logout } from '../store/thunks/authThunks';

const isSettingsPath = (pathname) => pathname.startsWith('/studio/settings');

const isBusinessPath = (pathname) =>
  pathname === '/studio/settings/payments' ||
  pathname === '/studio/settings/alerts' ||
  pathname === '/studio/settings/keys';

const AdminSidebarContainer = ({ open, onNavigate }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const user = useSelector(selectAuthUser);
  const company = useSelector(selectCompany);
  const [settingsOpen, setSettingsOpen] = useState(isSettingsPath(pathname));
  const [businessOpen, setBusinessOpen] = useState(isBusinessPath(pathname));

  useEffect(() => {
    if (isSettingsPath(pathname)) setSettingsOpen(true);
    if (isBusinessPath(pathname)) setBusinessOpen(true);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleSettings = () => {
    setSettingsOpen((value) => !value);
  };

  const handleToggleBusiness = () => {
    setBusinessOpen((value) => !value);
  };

  return (
    <AdminSidebar
      user={user}
      brandName={company.shortName}
      onLogout={handleLogout}
      open={open}
      onNavigate={onNavigate}
      settingsOpen={settingsOpen}
      businessOpen={businessOpen}
      onToggleSettings={handleToggleSettings}
      onToggleBusiness={handleToggleBusiness}
    />
  );
};

export default AdminSidebarContainer;
