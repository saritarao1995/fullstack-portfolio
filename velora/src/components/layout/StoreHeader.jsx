import { NavLink } from 'react-router-dom';
import StoreNavLinks from './StoreNavLinks';

const StoreHeader = ({
  menuOpen,
  onToggle,
  onClose,
  brandName,
  logo,
  showStudio,
  showOrders,
  signedIn,
  accountLabel,
  onLogout,
}) => (
  <header className="sticky top-0 z-40 border-b border-ink/8 bg-parchment/90 backdrop-blur-md">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <NavLink
        to="/"
        className="flex items-center gap-3 font-display text-2xl tracking-tight text-ink"
        onClick={onClose}
      >
        {logo ? <img src={logo} alt="" className="h-9 w-9 rounded-full object-cover" /> : null}
        {brandName}
      </NavLink>
      <nav className="hidden items-center gap-6 text-sm text-ink-soft md:flex">
        <StoreNavLinks
          showStudio={showStudio}
          showOrders={showOrders}
          signedIn={signedIn}
          accountLabel={accountLabel}
          onLogout={onLogout}
        />
      </nav>
      <button
        type="button"
        className="rounded-full border border-ink/15 px-4 py-2 text-sm md:hidden"
        onClick={onToggle}
        aria-expanded={menuOpen}
        aria-label="Menu"
      >
        {menuOpen ? 'Close' : 'Menu'}
      </button>
    </div>
    {menuOpen && (
      <nav className="flex flex-col gap-4 border-t border-ink/8 px-6 py-5 text-sm text-ink-soft md:hidden">
        <StoreNavLinks
          onNavigate={onClose}
          showStudio={showStudio}
          showOrders={showOrders}
          signedIn={signedIn}
          accountLabel={accountLabel}
          onLogout={onLogout}
        />
      </nav>
    )}
  </header>
);

export default StoreHeader;
