import { TheGraphAPI } from '../utils/api.js';
import { APIRequestParams } from '../types/thegraph.js';

export async function handleTokenTool(
  api: TheGraphAPI,
  name: string,
  args: any
): Promise<any> {
  let endpoint: string;

  switch (name) {
    case 'thegraph_token_balances':
      endpoint = '/v1/evm/balances';
      break;
    case 'thegraph_token_transfers':
      endpoint = '/v1/evm/transfers';
      break;
    case 'thegraph_token_holders':
      endpoint = '/v1/evm/holders';
      break;
    default:
      throw new Error(`Unknown token tool: ${name}`);
  }

  const params: APIRequestParams = {
    ...args,
  };

  return await api.request(endpoint, params);
}
