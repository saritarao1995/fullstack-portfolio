import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { subscribeToWallet } from '../services/walletService';
import { initialiseWallet, refreshWallet } from '../store/thunks/walletThunks';
import { walletDisconnected } from '../store/slices/walletSlice';
import { toastPushed } from '../store/slices/toastSlice';

/**
 * Keeps the store in step with MetaMask.
 *
 * The wallet is a separate application the user can change at any moment, so
 * the app cannot assume the address it read on load is still current.
 */
export const useWalletListeners = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialiseWallet());

    return subscribeToWallet({
      onAccountsChanged: (accounts) => {
        if (accounts.length === 0) {
          dispatch(walletDisconnected());
          dispatch(toastPushed({ variant: 'info', message: 'Wallet disconnected.' }));
          return;
        }

        dispatch(refreshWallet());
        dispatch(toastPushed({ variant: 'info', message: 'Wallet account changed.' }));
      },
      onChainChanged: () => {
        dispatch(refreshWallet());
        dispatch(toastPushed({ variant: 'info', message: 'Network changed.' }));
      },
    });
  }, [dispatch]);
};
