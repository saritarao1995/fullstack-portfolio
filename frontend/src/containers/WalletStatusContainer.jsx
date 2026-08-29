import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WalletStatus from '../components/wallet/WalletStatus';
import { connectWallet, switchNetwork } from '../store/thunks/walletThunks';
import {
  selectIsConnected,
  selectIsIssuer,
  selectIsWrongNetwork,
  selectWalletInstalled,
} from '../store/selectors/walletSelectors';
import { DEFAULT_CHAIN_ID } from '../config/contract';
import { getNetworkName } from '../config/networks';

const resolveState = ({ isInstalled, isConnected, isWrongNetwork, isIssuer }) => {
  if (!isInstalled) return 'not-installed';
  if (!isConnected) return 'disconnected';
  if (isWrongNetwork) return 'wrong-network';
  if (!isIssuer) return 'not-issuer';

  return 'ready';
};

const WalletStatusContainer = () => {
  const dispatch = useDispatch();

  const isInstalled = useSelector(selectWalletInstalled);
  const isConnected = useSelector(selectIsConnected);
  const isWrongNetwork = useSelector(selectIsWrongNetwork);
  const isIssuer = useSelector(selectIsIssuer);

  const handleConnect = useCallback(() => dispatch(connectWallet()), [dispatch]);
  const handleSwitchNetwork = useCallback(() => dispatch(switchNetwork()), [dispatch]);

  return (
    <WalletStatus
      state={resolveState({ isInstalled, isConnected, isWrongNetwork, isIssuer })}
      expectedNetwork={getNetworkName(DEFAULT_CHAIN_ID)}
      onConnect={handleConnect}
      onSwitchNetwork={handleSwitchNetwork}
    />
  );
};

export default WalletStatusContainer;
