import Spinner from '../ui/Spinner';

const STAGES = {
  signing: {
    title: 'Waiting for your signature',
    detail: 'Approve the transaction in MetaMask. Nothing is sent until you confirm.',
    tone: 'border-indigo-800/60 bg-indigo-950/40 text-indigo-200',
  },
  pending: {
    title: 'Transaction submitted',
    detail: 'Waiting for the network to include it in a block.',
    tone: 'border-amber-800/60 bg-amber-950/40 text-amber-200',
  },
  confirmed: {
    title: 'Confirmed on-chain',
    detail: 'The certificate is now permanently recorded.',
    tone: 'border-emerald-800/60 bg-emerald-950/40 text-emerald-200',
  },
  failed: {
    title: 'Transaction failed',
    detail: null,
    tone: 'border-rose-800/60 bg-rose-950/40 text-rose-200',
  },
};

const TransactionStatus = ({ transaction, explorerUrl, onDismiss }) => {
  const stage = STAGES[transaction.status];
  if (!stage) return null;

  const isBusy = transaction.status === 'signing' || transaction.status === 'pending';

  return (
    <div className={`rounded-2xl border px-5 py-4 text-sm ${stage.tone}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {isBusy && <Spinner className="h-4 w-4" />}
          <p className="font-semibold">{stage.title}</p>
        </div>

        {!isBusy && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="opacity-60 transition hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>

      <p className="mt-1.5 opacity-80">{transaction.error ?? stage.detail}</p>

      {transaction.transactionHash && (
        <dl className="mt-4 space-y-1.5 border-t border-current/20 pt-3 font-mono text-xs opacity-90">
          <div className="flex flex-wrap gap-x-2">
            <dt className="opacity-70">tx</dt>
            <dd className="break-all">
              {explorerUrl ? (
                <a href={explorerUrl} target="_blank" rel="noreferrer" className="underline">
                  {transaction.transactionHash}
                </a>
              ) : (
                transaction.transactionHash
              )}
            </dd>
          </div>

          {transaction.blockNumber !== null && (
            <div className="flex gap-2">
              <dt className="opacity-70">block</dt>
              <dd>{transaction.blockNumber}</dd>
            </div>
          )}

          {transaction.gasUsed && (
            <div className="flex gap-2">
              <dt className="opacity-70">gas</dt>
              <dd>{Number(transaction.gasUsed).toLocaleString()}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
};

export default TransactionStatus;
