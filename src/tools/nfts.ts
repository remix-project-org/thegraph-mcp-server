import { nftOwnershipsSchema, nftHoldersSchema } from '../utils/schemas.js';
import { zodToJsonSchema } from '../utils/zodToJsonSchema.js';

export const nftTools = [
  {
    name: 'thegraph_nft_ownerships',
    description: 'Get NFT tokens (ERC-721 and ERC-1155) owned by a wallet address',
    inputSchema: zodToJsonSchema(nftOwnershipsSchema),
  },
  {
    name: 'thegraph_nft_holders',
    description: 'Get wallet addresses holding NFT collection tokens',
    inputSchema: zodToJsonSchema(nftHoldersSchema),
  },
];
