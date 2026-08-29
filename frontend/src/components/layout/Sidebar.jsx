import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/issue', label: 'Issue' },
  { to: '/admin/certificates', label: 'Certificates' },
  { to: '/admin/profile', label: 'Profile / Wallet' },
];

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
  }`;

const Sidebar = () => (
  <aside className="hidden w-56 shrink-0 lg:block">
    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Admin</p>
    <nav className="flex flex-col gap-1">
      {LINKS.map(({ to, label, end }) => (
        <NavLink key={to} to={to} end={end} className={linkClass}>
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
