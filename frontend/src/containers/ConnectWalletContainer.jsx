import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConnectWallet from '../components/wallet/ConnectWallet';
import { connectWallet, switchNetwork } from '../store/thunks/walletThunks';
import {
  selectIsConnecting,
  selectIsWrongNetwork,
  selectWalletAddress,
  selectWalletInstalled,
} from '../store/selectors/walletSelectors';
import { DEFAULT_CHAIN_ID } from '../config/contract';
import { getNetworkName } from '../config/networks';

const ConnectWalletContainer = () => {
  const dispatch = useDispatch();

  const isInstalled = useSelector(selectWalletInstalled);
  const address = useSelector(selectWalletAddress);
  const isConnecting = useSelector(selectIsConnecting);
  const isWrongNetwork = useSelector(selectIsWrongNetwork);

  const handleConnect = useCallback(() => dispatch(connectWallet()), [dispatch]);
  const handleSwitchNetwork = useCallback(() => dispatch(switchNetwork()), [dispatch]);

  return (
    <ConnectWallet
      isInstalled={isInstalled}
      address={address}
      isConnecting={isConnecting}
      isWrongNetwork={isWrongNetwork}
      expectedNetwork={getNetworkName(DEFAULT_CHAIN_ID)}
      onConnect={handleConnect}
      onSwitchNetwork={handleSwitchNetwork}
    />
  );
};

export default ConnectWalletContainer;
