import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VerifyForm from '../components/verify/VerifyForm';
import CertificateResult from '../components/verify/CertificateResult';
import Card from '../components/ui/Card';
import { verifyCertificate } from '../store/thunks/verificationThunks';
import { verificationCleared } from '../store/slices/verificationSlice';
import {
  selectCertificate,
  selectIsVerifying,
  selectVerificationError,
} from '../store/selectors/verificationSelectors';
import { getVerificationSource } from '../services/certificateService';

const VerifyContainer = () => {
  const dispatch = useDispatch();
  const [certificateId, setCertificateId] = useState('');

  const certificate = useSelector(selectCertificate);
  const isVerifying = useSelector(selectIsVerifying);
  const error = useSelector(selectVerificationError);

  const { contractAddress } = getVerificationSource();

  const handleChange = useCallback((event) => {
    setCertificateId(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(verifyCertificate(certificateId));
    },
    [dispatch, certificateId],
  );

  const handleReset = useCallback(() => {
    setCertificateId('');
    dispatch(verificationCleared());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="text-lg font-semibold text-white">Verify a certificate</h2>
        <p className="mt-1 text-sm text-slate-400">
          Details are read directly from the blockchain. No wallet or account required.
        </p>

        <div className="mt-5">
          <VerifyForm
            value={certificateId}
            isVerifying={isVerifying}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </div>
      </Card>

      {error && (
        <Card className="border-rose-900/60 bg-rose-950/30">
          <p className="text-sm font-medium text-rose-300">{error}</p>
        </Card>
      )}

      {certificate && (
        <CertificateResult certificate={certificate} contractAddress={contractAddress} />
      )}
    </div>
  );
};

export default VerifyContainer;
