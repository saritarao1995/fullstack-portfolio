import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CertificateForm from '../components/certificates/CertificateForm';
import TransactionStatus from '../components/certificates/TransactionStatus';
import Card from '../components/ui/Card';
import { submitCertificate } from '../store/thunks/certificateThunks';
import { transactionCleared } from '../store/slices/certificatesSlice';
import {
  selectIsSubmitting,
  selectTransaction,
} from '../store/selectors/certificateSelectors';
import { selectCanIssue, selectWalletChainId } from '../store/selectors/walletSelectors';
import { getExplorerTxUrl } from '../config/networks';

const MAX_FIELD_LENGTH = 128;

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = {
  certificateId: '',
  studentName: '',
  courseName: '',
  institutionName: '',
  issueDate: today(),
  documentUrl: '',
};

const LABELS = {
  certificateId: 'Certificate ID',
  studentName: 'Student name',
  courseName: 'Course name',
  institutionName: 'Institution name',
};

/** Mirrors the contract's own checks so users fail fast, before paying gas. */
const validate = (values) => {
  const errors = {};

  Object.entries(LABELS).forEach(([field, label]) => {
    const value = values[field].trim();

    if (!value) errors[field] = `${label} is required.`;
    else if (value.length > MAX_FIELD_LENGTH) {
      errors[field] = `${label} must be ${MAX_FIELD_LENGTH} characters or fewer.`;
    }
  });

  if (!values.issueDate) errors.issueDate = 'Issue date is required.';
  else if (Date.parse(`${values.issueDate}T00:00:00Z`) > Date.now()) {
    errors.issueDate = 'Issue date cannot be in the future.';
  }

  return errors;
};

/** The contract stores Unix seconds and rejects anything later than the block. */
const toIssueTimestamp = (isoDate) => {
  const parsed = Math.floor(Date.parse(`${isoDate}T00:00:00Z`) / 1000);
  const oneMinuteAgo = Math.floor(Date.now() / 1000) - 60;

  return Math.min(parsed, oneMinuteAgo);
};

const IssueCertificateContainer = () => {
  const dispatch = useDispatch();
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const canIssue = useSelector(selectCanIssue);
  const isSubmitting = useSelector(selectIsSubmitting);
  const transaction = useSelector(selectTransaction);
  const chainId = useSelector(selectWalletChainId);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }, []);

  const handleDismiss = useCallback(() => dispatch(transactionCleared()), [dispatch]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) return;

      const result = await dispatch(
        submitCertificate({
          certificateId: values.certificateId.trim(),
          studentName: values.studentName.trim(),
          courseName: values.courseName.trim(),
          institutionName: values.institutionName.trim(),
          issueDate: toIssueTimestamp(values.issueDate),
          documentUrl: values.documentUrl.trim(),
        }),
      );

      if (submitCertificate.fulfilled.match(result)) setValues(emptyForm);
    },
    [dispatch, values],
  );

  return (
    <div className="flex flex-col gap-6">
      {transaction.status !== 'idle' && (
        <TransactionStatus
          transaction={transaction}
          explorerUrl={getExplorerTxUrl(chainId, transaction.transactionHash)}
          onDismiss={handleDismiss}
        />
      )}

      <Card>
        <CertificateForm
          values={values}
          errors={errors}
          disabled={!canIssue}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
};

export default IssueCertificateContainer;
