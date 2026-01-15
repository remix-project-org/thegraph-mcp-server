import { TheGraphAPI } from '../utils/api.js';
import { APIRequestParams } from '../types/thegraph.js';

export async function handleNFTTool(
  api: TheGraphAPI,
  name: string,
  args: any
): Promise<any> {
  let endpoint: string;

  switch (name) {
    case 'thegraph_nft_ownerships':
      endpoint = '/v1/evm/nft/ownerships';
      break;
    case 'thegraph_nft_holders':
      endpoint = '/v1/evm/nft/holders';
      break;
    default:
      throw new Error(`Unknown NFT tool: ${name}`);
  }

  const params: APIRequestParams = {
    ...args,
  };

  return await api.request(endpoint, params);
}
