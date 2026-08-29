import addresses from '../contracts/addresses.json';
import artifact from '../contracts/AuroraNFT.json';

export const DEFAULT_CHAIN_ID = Number(import.meta.env.VITE_DEFAULT_CHAIN_ID ?? 31337);
export const RPC_URL = import.meta.env.VITE_RPC_URL ?? 'http://127.0.0.1:8545';
export const NFT_ABI = artifact.abi;

export const getNftAddress = (chainId = DEFAULT_CHAIN_ID) =>
  import.meta.env.VITE_NFT_ADDRESS || addresses[chainId]?.auroraNft || null;
