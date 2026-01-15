import { TheGraphAPI } from '../utils/api.js';
import { APIRequestParams } from '../types/thegraph.js';

export async function handleDEXTool(
  api: TheGraphAPI,
  name: string,
  args: any
): Promise<any> {
  let endpoint: string;

  switch (name) {
    case 'thegraph_dex_pools':
      endpoint = '/v1/evm/pools';
      break;
    default:
      throw new Error(`Unknown DEX tool: ${name}`);
  }

  const params: APIRequestParams = {
    ...args,
  };

  return await api.request(endpoint, params);
}
