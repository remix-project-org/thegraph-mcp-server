import { z } from 'zod';

// Network enum schema
export const networkSchema = z.enum([
  'mainnet',
  'arbitrum-one',
  'avalanche',
  'base',
  'bsc',
  'optimism',
  'polygon',
  'unichain',
]);

// Common schemas
export const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address');
export const limitSchema = z.number().int().min(1).max(1000).default(10);
export const pageSchema = z.number().int().min(1).default(1);

// Balances endpoint schema
export const balancesSchema = z.object({
  network: networkSchema,
  address: addressSchema,
  limit: limitSchema.optional(),
  page: pageSchema.optional(),
});

// Transfers endpoint schema
export const transfersSchema = z.object({
  network: networkSchema,
  transaction_id: z.string().optional(),
  contract: addressSchema.optional(),
  from_address: addressSchema.optional(),
  to_address: addressSchema.optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  start_block: z.number().int().min(0).optional(),
  end_block: z.number().int().min(0).optional(),
  limit: limitSchema.optional(),
  page: pageSchema.optional(),
});

// Holders endpoint schema
export const holdersSchema = z.object({
  network: networkSchema,
  contract: addressSchema,
  limit: limitSchema.optional(),
  page: pageSchema.optional(),
});

// NFT Ownerships endpoint schema
export const nftOwnershipsSchema = z.object({
  network: networkSchema,
  address: addressSchema,
  contract: addressSchema.optional(),
  token_id: z.string().optional(),
  token_standard: z.enum(['ERC721', 'ERC1155']).optional(),
  include_null_balances: z.boolean().optional(),
  limit: limitSchema.optional(),
  page: pageSchema.optional(),
});

// NFT Holders endpoint schema
export const nftHoldersSchema = z.object({
  network: networkSchema,
  contract: addressSchema,
  token_standard: z.enum(['ERC721', 'ERC1155']).optional(),
  limit: limitSchema.optional(),
  page: pageSchema.optional(),
});

// Liquidity Pools endpoint schema
export const poolsSchema = z.object({
  network: networkSchema,
  factory: addressSchema.optional(),
  pool: addressSchema.optional(),
  input_token: addressSchema.optional(),
  output_token: addressSchema.optional(),
  protocol: z.enum(['uniswap_v1', 'uniswap_v2', 'uniswap_v3', 'uniswap_v4', 'bancor', 'curvefi', 'balancer']).optional(),
  limit: limitSchema.optional(),
  page: pageSchema.optional(),
});
