import { Contract } from 'ethers';
import { CERTIFICATE_ABI, getContractAddress } from '../config/contract';
import { getReadProvider } from './provider';
import { getSigner } from './walletService';

export class ContractNotDeployedError extends Error {
  constructor() {
    super('No contract address configured for this network. Run the deploy script first.');
    this.name = 'ContractNotDeployedError';
  }
}

const requireAddress = () => {
  const address = getContractAddress();
  if (!address) throw new ContractNotDeployedError();

  return address;
};

/** Free, wallet-free reads served by a plain RPC node. */
const getReadContract = () => new Contract(requireAddress(), CERTIFICATE_ABI, getReadProvider());

/** Writes need a signer, because a transaction must be signed by a private key. */
const getWriteContract = async () =>
  new Contract(requireAddress(), CERTIFICATE_ABI, await getSigner());

/**
 * ethers returns uint64 values as BigInt, which Redux cannot serialise.
 * Timestamps comfortably fit in a JS number, so narrow them at the boundary.
 */
const toPlainCertificate = (result, certificateId) => ({
  certificateId,
  isValid: result.isValid,
  exists: result.exists,
  revoked: result.revoked,
  studentName: result.studentName,
  courseName: result.courseName,
  institutionName: result.institutionName,
  issueDate: Number(result.issueDate),
  issuedAt: Number(result.issuedAt),
  issuer: result.issuer,
});

/* -------------------------------------------------------------------------- */
/*                                    Reads                                    */
/* -------------------------------------------------------------------------- */

/**
 * `verifyCertificate` never reverts, so an unknown id comes back as a normal
 * result with `exists: false` rather than as a thrown error.
 */
export const fetchCertificate = async (certificateId) => {
  const contract = getReadContract();
  const result = await contract.verifyCertificate(certificateId);

  return toPlainCertificate(result, certificateId);
};

export const fetchIsIssuer = async (address) => getReadContract().isIssuer(address);

/**
 * Rebuilds the certificate list from the event log.
 *
 * The contract has no "list all" function on purpose: mappings cannot be
 * iterated, and an on-chain array would eventually exceed the block gas limit.
 * Events are the cheap, intended way to reconstruct history off-chain.
 */
export const fetchIssuedCertificates = async () => {
  const contract = getReadContract();

  const [issued, revoked] = await Promise.all([
    contract.queryFilter(contract.filters.CertificateIssued()),
    contract.queryFilter(contract.filters.CertificateRevoked()),
  ]);

  const revocations = new Map(
    revoked.map((event) => [
      event.args.certificateHash,
      { reason: event.args.reason, revokedBy: event.args.revokedBy, txHash: event.transactionHash },
    ]),
  );

  return issued
    .map((event) => {
      const revocation = revocations.get(event.args.certificateHash);

      return {
        certificateHash: event.args.certificateHash,
        certificateId: event.args.certificateId,
        studentName: event.args.studentName,
        courseName: event.args.courseName,
        institutionName: event.args.institutionName,
        issueDate: Number(event.args.issueDate),
        issuedAt: Number(event.args.issuedAt),
        issuer: event.args.issuer,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        revoked: Boolean(revocation),
        revocationReason: revocation?.reason ?? null,
        revocationTxHash: revocation?.txHash ?? null,
      };
    })
    .sort((a, b) => b.blockNumber - a.blockNumber);
};

/* -------------------------------------------------------------------------- */
/*                                   Writes                                    */
/* -------------------------------------------------------------------------- */

/**
 * Sends a transaction and reports each stage through `onStage`, because a write
 * takes seconds: the hash arrives immediately, the outcome much later.
 */
const sendTransaction = async (buildTx, onStage) => {
  const tx = await buildTx();
  onStage?.({ stage: 'pending', transactionHash: tx.hash });

  const receipt = await tx.wait();

  // A mined transaction can still have failed, and it consumed gas either way.
  if (receipt.status !== 1) throw new Error('The transaction was mined but reverted.');

  return {
    transactionHash: tx.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
  };
};

export const issueCertificate = async (input, onStage) => {
  const contract = await getWriteContract();
  const args = [
    input.certificateId,
    input.studentName,
    input.courseName,
    input.institutionName,
    input.issueDate,
  ];

  // Simulate first so a doomed transaction fails before MetaMask asks the user
  // to pay for it. staticCall runs the code on a node without sending anything.
  await contract.issueCertificate.staticCall(...args);

  return sendTransaction(() => contract.issueCertificate(...args), onStage);
};

export const revokeCertificate = async ({ certificateId, reason }, onStage) => {
  const contract = await getWriteContract();

  await contract.revokeCertificate.staticCall(certificateId, reason);

  return sendTransaction(() => contract.revokeCertificate(certificateId, reason), onStage);
};

export const getVerificationSource = () => ({ contractAddress: getContractAddress() });
