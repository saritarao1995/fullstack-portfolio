import { NavLink, Outlet } from 'react-router-dom';
import ConnectWalletContainer from '../../containers/ConnectWalletContainer';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`;

const Layout = () => (
  <div className="min-h-full bg-zinc-950">
    <header className="border-b border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
        <NavLink to="/" className="text-sm font-semibold tracking-wide text-white">
          AURORA
        </NavLink>
        <nav className="flex gap-1">
          <NavLink to="/" end className={linkClass}>
            Drop
          </NavLink>
          <NavLink to="/collection" className={linkClass}>
            My NFTs
          </NavLink>
        </nav>
        <div className="ml-auto">
          <ConnectWalletContainer />
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Outlet />
    </main>
  </div>
);

export default Layout;
