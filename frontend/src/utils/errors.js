import { ContractNotDeployedError } from '../services/certificateService';
import { WalletNotInstalledError, WALLET_ERRORS } from '../services/walletService';

/** Contract errors are the user's fault more often than the app's — name them. */
const CONTRACT_ERRORS = {
  CertificateAlreadyExists: 'A certificate with this ID already exists on the blockchain.',
  CertificateNotFound: 'No certificate with this ID exists on the blockchain.',
  CertificateAlreadyRevoked: 'This certificate has already been revoked.',
  NotCertificateIssuer: 'Only the wallet that issued this certificate can revoke it.',
  AccessControlUnauthorizedAccount: 'This wallet is not authorised to issue certificates.',
  EmptyCertificateId: 'Certificate ID cannot be empty.',
  EmptyStudentName: 'Student name cannot be empty.',
  EmptyCourseName: 'Course name cannot be empty.',
  EmptyInstitutionName: 'Institution name cannot be empty.',
  FieldTooLong: 'One of the fields exceeds the 128 character limit.',
  InvalidIssueDate: 'The issue date must be in the past and cannot be empty.',
  ZeroAddress: 'A valid wallet address is required.',
};

/** Turns wallet, network and contract failures into something actionable. */
export const toReadableError = (error) => {
  if (error instanceof WalletNotInstalledError) return error.message;
  if (error instanceof ContractNotDeployedError) return error.message;

  // Decoded custom error from the contract.
  const revertName = error?.revert?.name;
  if (revertName && CONTRACT_ERRORS[revertName]) return CONTRACT_ERRORS[revertName];

  switch (error?.code) {
    case WALLET_ERRORS.USER_REJECTED:
    case 'ACTION_REJECTED':
      return 'You rejected the request in MetaMask.';

    case WALLET_ERRORS.REQUEST_PENDING:
      return 'MetaMask already has a pending request. Open the extension to finish it.';

    case 'INSUFFICIENT_FUNDS':
      return 'This wallet does not have enough ETH to cover the gas fee.';

    case 'NETWORK_ERROR':
    case 'SERVER_ERROR':
      return 'Cannot reach the blockchain node. Make sure your local node is running.';

    case 'UNSUPPORTED_OPERATION':
      return 'Connect a wallet before sending a transaction.';

    case 'BAD_DATA':
      return 'Unexpected response from the contract. The deployed ABI may be out of date.';

    case 'CALL_EXCEPTION':
      return 'The contract rejected this call. Check the certificate ID and your permissions.';

    default:
      break;
  }

  const message = error?.shortMessage || error?.message || 'Something went wrong.';

  // Local nodes wrap decoded errors in VM boilerplate; keep only the error name.
  const customError = message.match(/custom error '([A-Za-z]+)/)?.[1];

  return CONTRACT_ERRORS[customError] ?? message;
};
