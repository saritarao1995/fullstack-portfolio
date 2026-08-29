import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ToastContainer from '../../containers/ToastContainer';

const Layout = ({ withSidebar = false }) => (
  <div className="min-h-full bg-slate-950">
    <Navbar />

    <div className="mx-auto flex w-full max-w-6xl gap-8 px-6 py-10">
      {withSidebar && <Sidebar />}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>

    <ToastContainer />
  </div>
);

export default Layout;
