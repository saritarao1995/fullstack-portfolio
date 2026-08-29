import Button from '../ui/Button';

/**
 * Explains exactly which precondition is blocking a write, rather than leaving
 * the user with a disabled button and no reason.
 */
const WalletStatus = ({ state, expectedNetwork, onConnect, onSwitchNetwork }) => {
  if (state === 'ready') return null;

  const MESSAGES = {
    'not-installed': {
      tone: 'border-amber-800/60 bg-amber-950/30 text-amber-200',
      title: 'MetaMask is not installed',
      detail:
        'Writing to the blockchain requires a wallet to sign the transaction. Reading works without one.',
      action: (
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold underline"
        >
          Install MetaMask
        </a>
      ),
    },
    disconnected: {
      tone: 'border-indigo-800/60 bg-indigo-950/30 text-indigo-200',
      title: 'Wallet not connected',
      detail: 'Connect a wallet so the contract can verify who is issuing the certificate.',
      action: (
        <Button onClick={onConnect} className="px-4 py-2 text-xs">
          Connect Wallet
        </Button>
      ),
    },
    'wrong-network': {
      tone: 'border-rose-800/60 bg-rose-950/30 text-rose-200',
      title: 'Wrong network',
      detail: `The contract is deployed on ${expectedNetwork}. Transactions sent from another chain would go nowhere.`,
      action: (
        <Button variant="danger" onClick={onSwitchNetwork} className="px-4 py-2 text-xs">
          Switch to {expectedNetwork}
        </Button>
      ),
    },
    'not-issuer': {
      tone: 'border-amber-800/60 bg-amber-950/30 text-amber-200',
      title: 'This wallet is not an authorised issuer',
      detail:
        'The contract only accepts writes from an address holding ISSUER_ROLE. An admin must grant it first.',
      action: null,
    },
  };

  const message = MESSAGES[state];
  if (!message) return null;

  return (
    <div className={`rounded-2xl border px-5 py-4 ${message.tone}`}>
      <p className="text-sm font-semibold">{message.title}</p>
      <p className="mt-1.5 text-sm opacity-80">{message.detail}</p>
      {message.action && <div className="mt-4">{message.action}</div>}
    </div>
  );
};

export default WalletStatus;
