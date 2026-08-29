import { JsonRpcProvider } from 'ethers';
import { RPC_URL } from '../config/contract';

let readProvider = null;

/**
 * Read-only connection to a blockchain node.
 *
 * No wallet involved: view functions are executed by the node against its own
 * copy of the chain state, cost nothing, and change nothing. This is what lets
 * the public verification page work without MetaMask.
 */
export const getReadProvider = () => {
  readProvider ??= new JsonRpcProvider(RPC_URL);

  return readProvider;
};
