import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { shortenAddress } from '../../utils/format';

const ConnectWallet = ({
  isInstalled,
  address,
  isConnecting,
  isWrongNetwork,
  expectedNetwork,
  onConnect,
  onSwitchNetwork,
}) => {
  if (!isInstalled) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-amber-700/60 bg-amber-950/40 px-4 py-2.5 text-sm font-semibold text-amber-200 transition hover:border-amber-600"
      >
        Install MetaMask
      </a>
    );
  }

  if (!address) {
    return (
      <Button onClick={onConnect} loading={isConnecting}>
        {isConnecting ? 'Connecting' : 'Connect Wallet'}
      </Button>
    );
  }

  if (isWrongNetwork) {
    return (
      <Button variant="danger" onClick={onSwitchNetwork}>
        Switch to {expectedNetwork}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      <span className="font-mono text-xs text-slate-200">{shortenAddress(address)}</span>
      <Badge variant="info">{expectedNetwork}</Badge>
    </div>
  );
};

export default ConnectWallet;
