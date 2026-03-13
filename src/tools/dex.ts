import { poolsSchema } from '../utils/schemas.js';
import { zodToJsonSchema } from '../utils/zodToJsonSchema.js';

export const dexTools = [
  {
    name: 'thegraph_dex_pools',
    description: 'Get Uniswap liquidity pool metadata including token pairs, fees, and protocol versions',
    inputSchema: zodToJsonSchema(poolsSchema),
  },
];
