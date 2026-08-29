import AdminNavLink from './AdminNavLink';

const AdminSettingsNav = ({
  open,
  businessOpen,
  onToggle,
  onToggleBusiness,
  onNavigate,
}) => (
  <div>
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left ${
        open ? 'bg-white/10 text-parchment' : 'text-sand hover:bg-white/5'
      }`}
    >
      Settings
      <span className="text-xs text-sand">{open ? '▾' : '▸'}</span>
    </button>
    {open ? (
      <div className="mt-1 flex flex-col gap-1">
        <AdminNavLink to="/studio/settings/company" onNavigate={onNavigate} nested end>
          Company
        </AdminNavLink>
        <button
          type="button"
          onClick={onToggleBusiness}
          aria-expanded={businessOpen}
          className={`flex items-center justify-between rounded-xl py-2 pl-8 pr-4 text-left text-[13px] ${
            businessOpen ? 'text-parchment' : 'text-sand hover:bg-white/5'
          }`}
        >
          Business
          <span className="text-xs text-sand">{businessOpen ? '▾' : '▸'}</span>
        </button>
        {businessOpen ? (
          <>
            <AdminNavLink to="/studio/settings/payments" onNavigate={onNavigate} nested deep end>
              Payments
            </AdminNavLink>
            <AdminNavLink to="/studio/settings/alerts" onNavigate={onNavigate} nested deep end>
              Email, SMS & WhatsApp
            </AdminNavLink>
            <AdminNavLink to="/studio/settings/keys" onNavigate={onNavigate} nested deep end>
              Dynamic keys
            </AdminNavLink>
          </>
        ) : null}
      </div>
    ) : null}
  </div>
);

export default AdminSettingsNav;
