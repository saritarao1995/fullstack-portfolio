import { Outlet, useLocation } from 'react-router-dom';
import StoreHeaderContainer from '../../containers/StoreHeaderContainer';
import StoreFooterContainer from '../../containers/StoreFooterContainer';
import ToastContainer from '../../containers/ToastContainer';
import DocumentTitleContainer from '../../containers/DocumentTitleContainer';

const StoreLayout = () => {
  const { pathname } = useLocation();
  const showFooter = pathname !== '/studio' && !pathname.startsWith('/pay');

  return (
    <div className="min-h-dvh bg-parchment text-ink">
      <DocumentTitleContainer />
      <StoreHeaderContainer />
      <main>
        <Outlet />
      </main>
      {showFooter ? <StoreFooterContainer /> : null}
      <ToastContainer />
    </div>
  );
};

export default StoreLayout;
