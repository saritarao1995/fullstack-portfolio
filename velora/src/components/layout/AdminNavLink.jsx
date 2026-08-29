import { NavLink } from 'react-router-dom';

const AdminNavLink = ({ to, children, onNavigate, nested = false, deep = false, end = false }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onNavigate}
    className={({ isActive }) =>
      `rounded-xl ${nested ? (deep ? 'py-2 pl-12 pr-4 text-[13px]' : 'py-2 pl-8 pr-4 text-[13px]') : 'px-4 py-3'} ${
        isActive ? 'bg-white/10 text-parchment' : 'text-sand hover:bg-white/5'
      }`
    }
  >
    {children}
  </NavLink>
);

export default AdminNavLink;
