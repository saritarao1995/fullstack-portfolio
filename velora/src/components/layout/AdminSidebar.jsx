import AdminNavLink from './AdminNavLink';
import AdminSettingsNav from './AdminSettingsNav';

const AdminSidebar = ({
  user,
  brandName,
  onLogout,
  onNavigate,
  open,
  settingsOpen,
  businessOpen,
  onToggleSettings,
  onToggleBusiness,
}) => (
  <aside
    className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-white/10 bg-ink text-parchment md:static md:flex ${
      open ? 'flex' : 'hidden'
    }`}
  >
    <div className="px-6 py-8">
      <p className="font-display text-2xl">{brandName}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-sand">Studio</p>
    </div>
    <nav className="flex flex-1 flex-col gap-1 px-3 text-sm">
      <AdminNavLink to="/studio/dashboard" onNavigate={onNavigate}>
        Overview
      </AdminNavLink>
      <AdminNavLink to="/studio/orders" onNavigate={onNavigate}>
        Orders
      </AdminNavLink>
      <AdminNavLink to="/studio/products" onNavigate={onNavigate}>
        Pieces
      </AdminNavLink>
      <AdminSettingsNav
        open={settingsOpen}
        businessOpen={businessOpen}
        onToggle={onToggleSettings}
        onToggleBusiness={onToggleBusiness}
        onNavigate={onNavigate}
      />
    </nav>
    <div className="border-t border-white/10 px-6 py-6">
      <p className="text-sm">{user?.name}</p>
      <p className="text-xs text-sand">{user?.email}</p>
      <button
        type="button"
        onClick={onLogout}
        className="mt-4 text-xs uppercase tracking-[0.16em] text-sand underline"
      >
        Sign out
      </button>
    </div>
  </aside>
);

export default AdminSidebar;
