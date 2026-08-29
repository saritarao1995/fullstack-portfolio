import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CertificateTable from '../components/certificates/CertificateTable';
import TransactionStatus from '../components/certificates/TransactionStatus';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import { loadCertificates, withdrawCertificate } from '../store/thunks/certificateThunks';
import { transactionCleared } from '../store/slices/certificatesSlice';
import {
  selectCertificates,
  selectIsSubmitting,
  selectListError,
  selectListStatus,
  selectTransaction,
} from '../store/selectors/certificateSelectors';
import { selectCanIssue, selectWalletAddress, selectWalletChainId } from '../store/selectors/walletSelectors';
import { getExplorerTxUrl } from '../config/networks';

const CertificateListContainer = () => {
  const dispatch = useDispatch();
  const [pendingRevoke, setPendingRevoke] = useState(null);
  const [reason, setReason] = useState('');
  const [query, setQuery] = useState('');

  const certificates = useSelector(selectCertificates);
  const listStatus = useSelector(selectListStatus);
  const listError = useSelector(selectListError);
  const transaction = useSelector(selectTransaction);
  const isSubmitting = useSelector(selectIsSubmitting);
  const walletAddress = useSelector(selectWalletAddress);
  const canRevoke = useSelector(selectCanIssue);
  const chainId = useSelector(selectWalletChainId);

  useEffect(() => {
    dispatch(loadCertificates());
  }, [dispatch]);

  const visibleCertificates = certificates.filter((certificate) => {
    if (!query.trim()) return true;

    const haystack = `${certificate.certificateId} ${certificate.studentName} ${certificate.courseName} ${certificate.institutionName}`.toLowerCase();

    return haystack.includes(query.trim().toLowerCase());
  });

  const handleRefresh = useCallback(() => dispatch(loadCertificates()), [dispatch]);
  const handleDismissTx = useCallback(() => dispatch(transactionCleared()), [dispatch]);

  const handleOpenRevoke = useCallback((certificate) => {
    setPendingRevoke(certificate);
    setReason('');
  }, []);

  const handleCloseRevoke = useCallback(() => setPendingRevoke(null), []);

  const handleConfirmRevoke = useCallback(async () => {
    const certificate = pendingRevoke;
    setPendingRevoke(null);

    await dispatch(
      withdrawCertificate({
        certificateId: certificate.certificateId,
        reason: reason.trim() || 'Revoked by issuer',
      }),
    );
  }, [dispatch, pendingRevoke, reason]);

  return (
    <div className="flex flex-col gap-6">
      {transaction.status !== 'idle' && (
        <TransactionStatus
          transaction={transaction}
          explorerUrl={getExplorerTxUrl(chainId, transaction.transactionHash)}
          onDismiss={handleDismissTx}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          On-chain event log is the list. MongoDB supplies transaction hashes and document links.
        </p>
        <div className="flex gap-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ID, student, course…"
            className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <Button variant="ghost" onClick={handleRefresh} className="px-3 py-1.5 text-xs">
            Refresh
          </Button>
        </div>
      </div>

      {listStatus === 'loading' && certificates.length === 0 && (
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Spinner className="h-4 w-4" />
          Reading events from the chain…
        </div>
      )}

      {listError && (
        <Card className="border-rose-900/60 bg-rose-950/30">
          <p className="text-sm text-rose-300">{listError}</p>
        </Card>
      )}

      {listStatus === 'succeeded' && visibleCertificates.length === 0 && (
        <EmptyState
          title="No certificates issued yet"
          detail="Issue your first certificate and it will appear here once the transaction is confirmed."
        />
      )}

      {visibleCertificates.length > 0 && (
        <CertificateTable
          certificates={visibleCertificates}
          walletAddress={walletAddress}
          canRevoke={canRevoke && !isSubmitting}
          onRevoke={handleOpenRevoke}
        />
      )}

      <Modal
        open={Boolean(pendingRevoke)}
        title={`Revoke ${pendingRevoke?.certificateId ?? ''}`}
        onClose={handleCloseRevoke}
      >
        <p className="text-sm text-slate-400">
          This cannot be undone. The record stays on-chain permanently and is marked as revoked, so
          the history remains auditable.
        </p>

        <label htmlFor="revoke-reason" className="mt-4 block text-sm font-medium text-slate-300">
          Reason
        </label>
        <input
          id="revoke-reason"
          type="text"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Academic misconduct"
          maxLength={128}
          className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Stored in the event log rather than contract storage, which is far cheaper.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={handleCloseRevoke}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmRevoke}>
            Revoke certificate
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CertificateListContainer;
