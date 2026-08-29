import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import StoreLayout from './components/layout/StoreLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import CustomerRoute from './components/layout/CustomerRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Story from './pages/Story';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Pay from './pages/Pay';
import Login from './pages/Login';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetail from './pages/AdminOrderDetail';
import AdminSettings from './pages/AdminSettings';
import { restoreSession } from './store/thunks/authThunks';
import { loadCatalog } from './store/thunks/catalogThunks';
import { loadOrders } from './store/thunks/orderThunks';
import { loadPublicSettings } from './store/thunks/settingsThunks';
import AdminProducts from './pages/AdminProducts';
import AdminProductEdit from './pages/AdminProductEdit';
import AccountOrders from './pages/AccountOrders';
import Legal from './pages/Legal';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const boot = async () => {
      const result = await dispatch(restoreSession());
      dispatch(loadPublicSettings());
      dispatch(loadCatalog());
      if (result.payload?.user) dispatch(loadOrders());
    };
    boot();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="story" element={<Story />} />
          <Route path="product/:productId" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<CustomerLogin />} />
          <Route path="register" element={<CustomerRegister />} />
          <Route path="forgot" element={<ForgotPassword />} />
          <Route path="reset" element={<ResetPassword />} />
          <Route path="contact" element={<Legal />} />
          <Route path="returns" element={<Legal />} />
          <Route path="privacy" element={<Legal />} />
          <Route path="terms" element={<Legal />} />
          <Route element={<CustomerRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="pay/:orderId" element={<Pay />} />
            <Route path="order/:orderId" element={<OrderSuccess />} />
            <Route path="orders" element={<AccountOrders />} />
          </Route>
          <Route path="studio" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="studio/dashboard" element={<AdminDashboard />} />
            <Route path="studio/orders" element={<AdminOrders />} />
            <Route path="studio/orders/:orderId" element={<AdminOrderDetail />} />
            <Route path="studio/products" element={<AdminProducts />} />
            <Route path="studio/products/new" element={<AdminProductEdit />} />
            <Route path="studio/products/:productId" element={<AdminProductEdit />} />
            <Route path="studio/settings" element={<Navigate to="/studio/settings/company" replace />} />
            <Route path="studio/settings/:section" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
