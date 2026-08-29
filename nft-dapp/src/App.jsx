import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Drop from './pages/Drop';
import Collection from './pages/Collection';
import { useWalletListeners } from './hooks/useWalletListeners';

const App = () => {
  useWalletListeners();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Drop />} />
          <Route path="collection" element={<Collection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
