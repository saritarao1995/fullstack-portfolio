import { BrowserProvider } from 'ethers';
import { DEFAULT_CHAIN_ID } from '../config/contract';
import { getNetwork } from '../config/networks';

/** MetaMask error codes worth reacting to specifically. */
export const WALLET_ERRORS = {
  USER_REJECTED: 4001,
  UNRECOGNISED_CHAIN: 4902,
  REQUEST_PENDING: -32002,
};

export class WalletNotInstalledError extends Error {
  constructor() {
    super('MetaMask is not installed. Install the extension and reload the page.');
    this.name = 'WalletNotInstalledError';
  }
}

export const isWalletInstalled = () =>
  typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask ?? window.ethereum);

const requireEthereum = () => {
  if (!isWalletInstalled()) throw new WalletNotInstalledError();

  return window.ethereum;
};

/**
 * Wraps the injected provider. Unlike the read-only JsonRpcProvider, this one
 * can produce a signer, which is what turns a call into a transaction.
 */
export const getBrowserProvider = () => new BrowserProvider(requireEthereum());

export const getSigner = async () => getBrowserProvider().getSigner();

/** Accounts already authorised, without prompting. Used to restore a session. */
export const getAuthorisedAccounts = async () => {
  if (!isWalletInstalled()) return [];

  return window.ethereum.request({ method: 'eth_accounts' });
};

/** Opens the MetaMask popup asking the user to share an address. */
export const requestAccounts = async () =>
  requireEthereum().request({ method: 'eth_requestAccounts' });

export const getChainId = async () => {
  const hexChainId = await requireEthereum().request({ method: 'eth_chainId' });

  return Number.parseInt(hexChainId, 16);
};

/**
 * Asks the wallet to move to the app's chain, adding it first if MetaMask has
 * never heard of it — which is always the case for a local Hardhat node.
 */
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

/**
 * MetaMask pushes these instead of the app polling. Returns a cleanup function
 * so React effects can unsubscribe.
 */
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
