import { DEFAULT_CHAIN_ID, RPC_URL } from './contract';

/**
 * Chain metadata in the shape MetaMask expects for `wallet_addEthereumChain`.
 * Chain ids travel over the wallet API as hex strings.
 */
export const NETWORKS = {
  31337: {
    chainId: '0x7a69',
    chainName: 'Hardhat Local',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: [RPC_URL],
    blockExplorerUrls: [],
  },
  11155111: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
};

export const getNetwork = (chainId) => NETWORKS[chainId] ?? null;

export const getNetworkName = (chainId) => NETWORKS[chainId]?.chainName ?? `Chain ${chainId}`;

export const isSupportedChain = (chainId) => Number(chainId) === DEFAULT_CHAIN_ID;

/** Explorer link for a transaction, or null on chains without one. */
export const getExplorerTxUrl = (chainId, txHash) => {
  const [explorer] = NETWORKS[chainId]?.blockExplorerUrls ?? [];

  return explorer ? `${explorer}/tx/${txHash}` : null;
};
