import { DEFAULT_CHAIN_ID, RPC_URL } from './contract';

export const NETWORKS = {
  31337: {
    chainId: '0x7a69',
    chainName: 'Hardhat Local',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: [RPC_URL],
    blockExplorerUrls: [],
  },
};

export const getNetwork = (chainId) => NETWORKS[chainId] ?? null;
export const getNetworkName = (chainId) => NETWORKS[chainId]?.chainName ?? `Chain ${chainId}`;
