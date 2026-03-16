import { balancesSchema, transfersSchema, holdersSchema } from '../utils/schemas.js';
import { zodToJsonSchema } from '../utils/zodToJsonSchema.js';

export const tokenTools = [
  {
    name: 'thegraph_token_balances',
    description: 'Get ERC-20 and native token balances for a wallet address',
    inputSchema: zodToJsonSchema(balancesSchema),
  },
  {
    name: 'thegraph_token_transfers',
    description: 'Get ERC-20 and native token transfer events with transaction and block data',
    inputSchema: zodToJsonSchema(transfersSchema),
  },
  {
    name: 'thegraph_token_holders',
    description: 'Get top token holders ranked by balance for a specific contract',
    inputSchema: zodToJsonSchema(holdersSchema),
  },
];
