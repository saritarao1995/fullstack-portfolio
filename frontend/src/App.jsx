import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import VerifyCertificate from './pages/VerifyCertificate';
import AdminDashboard from './pages/AdminDashboard';
import IssueCertificate from './pages/IssueCertificate';
import CertificateList from './pages/CertificateList';
import CertificateDetails from './pages/CertificateDetails';
import TransactionDetails from './pages/TransactionDetails';
import Profile from './pages/Profile';
import { useWalletListeners } from './hooks/useWalletListeners';
import { restoreSession } from './store/thunks/authThunks';

const App = () => {
  const dispatch = useDispatch();

  useWalletListeners();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="verify" element={<VerifyCertificate />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route element={<Layout withSidebar />}>
          <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/issue" element={<IssueCertificate />} />
            <Route path="admin/certificates" element={<CertificateList />} />
            <Route path="admin/certificates/:certificateId" element={<CertificateDetails />} />
            <Route path="admin/transactions/:hash" element={<TransactionDetails />} />
            <Route path="admin/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
