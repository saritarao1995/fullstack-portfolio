import { NavLink } from 'react-router-dom';
import ConnectWalletContainer from '../../containers/ConnectWalletContainer';
import AuthStatusContainer from '../../containers/AuthStatusContainer';

const PUBLIC_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/verify', label: 'Verify' },
];

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/issue', label: 'Issue' },
  { to: '/admin/certificates', label: 'Certificates' },
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
  }`;

const Navbar = () => (
  <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-3">
      <NavLink to="/" className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30">
          ✓
        </span>
        <span className="text-sm font-semibold text-white">CertChain</span>
      </NavLink>

      <nav className="flex items-center gap-1">
        {PUBLIC_LINKS.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClass}>
            {label}
          </NavLink>
        ))}
        {ADMIN_LINKS.map(({ to, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <AuthStatusContainer />
        <ConnectWalletContainer />
      </div>
    </div>
  </header>
);

export default Navbar;
