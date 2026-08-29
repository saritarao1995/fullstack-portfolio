import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { subscribeToWallet } from '../services/walletService';
import { initialiseWallet, refreshWallet } from '../store/thunks/walletThunks';
import { walletDisconnected } from '../store/slices/walletSlice';
import { loadDrop, loadOwned } from '../store/thunks/dropThunks';

export const useWalletListeners = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialiseWallet()).then(() => {
      dispatch(loadDrop());
      dispatch(loadOwned());
    });

    return subscribeToWallet({
      onAccountsChanged: (accounts) => {
        if (accounts.length === 0) {
          dispatch(walletDisconnected());
          dispatch(loadDrop());
          return;
        }
        dispatch(refreshWallet()).then(() => {
          dispatch(loadDrop());
          dispatch(loadOwned());
        });
      },
      onChainChanged: () => {
        dispatch(refreshWallet()).then(() => {
          dispatch(loadDrop());
          dispatch(loadOwned());
        });
      },
    });
  }, [dispatch]);
};
