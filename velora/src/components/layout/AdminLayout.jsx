import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebarContainer from '../../containers/AdminSidebarContainer';
import ToastContainer from '../../containers/ToastContainer';

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen((open) => !open);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-parchment">
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-ink/40 md:hidden"
          onClick={handleClose}
        />
      )}
      <AdminSidebarContainer open={menuOpen} onNavigate={handleClose} />
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 md:hidden">
          <p className="font-display text-xl">Studio</p>
          <button
            type="button"
            onClick={handleToggle}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm"
          >
            Menu
          </button>
        </div>
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
