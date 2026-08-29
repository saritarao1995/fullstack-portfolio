import addresses from '../contracts/addresses.json';
import certificateArtifact from '../contracts/CertificateVerification.json';

/** Chain the app reads from. 31337 = local Hardhat node. */
export const DEFAULT_CHAIN_ID = Number(import.meta.env.VITE_DEFAULT_CHAIN_ID ?? 31337);

/** JSON-RPC endpoint used for wallet-free reads. */
export const RPC_URL = import.meta.env.VITE_RPC_URL ?? 'http://127.0.0.1:8545';

/** Function schema the compiler generated. Tells ethers how to encode calls. */
export const CERTIFICATE_ABI = certificateArtifact.abi;

/**
 * Where the contract lives on the target chain. An explicit env value wins;
 * otherwise fall back to whatever the deploy script last wrote.
 */
export const getContractAddress = (chainId = DEFAULT_CHAIN_ID) =>
  import.meta.env.VITE_CONTRACT_ADDRESS || addresses[chainId]?.certificateVerification || null;
