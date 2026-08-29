import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet, switchNetwork } from '../store/thunks/walletThunks';
import {
  selectIsConnecting,
  selectIsWrongNetwork,
  selectWalletAddress,
  selectWalletInstalled,
} from '../store/selectors/walletSelectors';
import { shortenAddress } from '../utils/format';

const ConnectWalletContainer = () => {
  const dispatch = useDispatch();
  const installed = useSelector(selectWalletInstalled);
  const address = useSelector(selectWalletAddress);
  const connecting = useSelector(selectIsConnecting);
  const wrongNetwork = useSelector(selectIsWrongNetwork);

  const onConnect = useCallback(() => dispatch(connectWallet()), [dispatch]);
  const onSwitch = useCallback(() => dispatch(switchNetwork()), [dispatch]);

  if (!installed) {
    return (
      <a
        href="https://metamask.io/download/"
        className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950"
      >
        Install MetaMask
      </a>
    );
  }

  if (!address) {
    return (
      <button
        type="button"
        onClick={onConnect}
        disabled={connecting}
        className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-60"
      >
        {connecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
    );
  }

  if (wrongNetwork) {
    return (
      <button
        type="button"
        onClick={onSwitch}
        className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Switch to Hardhat Local
      </button>
    );
  }

  return (
    <div className="rounded-full border border-zinc-700 px-4 py-2 font-mono text-xs text-zinc-200">
      {shortenAddress(address)}
    </div>
  );
};

export default ConnectWalletContainer;
