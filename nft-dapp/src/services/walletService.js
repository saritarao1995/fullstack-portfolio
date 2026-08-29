import { BrowserProvider } from 'ethers';
import { DEFAULT_CHAIN_ID } from '../config/contract';
import { getNetwork } from '../config/networks';

export const WALLET_ERRORS = {
  USER_REJECTED: 4001,
  UNRECOGNISED_CHAIN: 4902,
  REQUEST_PENDING: -32002,
};

export class WalletNotInstalledError extends Error {
  constructor() {
    super('MetaMask is not installed.');
    this.name = 'WalletNotInstalledError';
  }
}

export const isWalletInstalled = () =>
  typeof window !== 'undefined' && Boolean(window.ethereum);

const requireEthereum = () => {
  if (!isWalletInstalled()) throw new WalletNotInstalledError();
  return window.ethereum;
};

export const getBrowserProvider = () => new BrowserProvider(requireEthereum());
export const getSigner = async () => getBrowserProvider().getSigner();

export const getAuthorisedAccounts = async () => {
  if (!isWalletInstalled()) return [];
  return window.ethereum.request({ method: 'eth_accounts' });
};

export const requestAccounts = async () =>
  requireEthereum().request({ method: 'eth_requestAccounts' });

export const getChainId = async () =>
  Number.parseInt(await requireEthereum().request({ method: 'eth_chainId' }), 16);

export const switchToAppNetwork = async (chainId = DEFAULT_CHAIN_ID) => {
  const ethereum = requireEthereum();
  const network = getNetwork(chainId);
  if (!network) throw new Error(`No configuration for chain ${chainId}.`);

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }],
    });
  } catch (error) {
    if (error.code !== WALLET_ERRORS.UNRECOGNISED_CHAIN) throw error;
    await ethereum.request({ method: 'wallet_addEthereumChain', params: [network] });
  }
};

export const subscribeToWallet = ({ onAccountsChanged, onChainChanged }) => {
  if (!isWalletInstalled()) return () => {};
  const { ethereum } = window;
  ethereum.on('accountsChanged', onAccountsChanged);
  ethereum.on('chainChanged', onChainChanged);
  return () => {
    ethereum.removeListener('accountsChanged', onAccountsChanged);
    ethereum.removeListener('chainChanged', onChainChanged);
  };
};
