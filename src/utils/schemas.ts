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
]).describe('The blockchain network to query');

// Common schemas
export const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address').describe('Ethereum wallet or contract address (42 characters starting with 0x)');
export const limitSchema = z.number().int().min(1).max(1000).default(10).describe('Maximum number of results to return in a single request (1-1000, default: 10)');
export const pageSchema = z.number().int().min(1).default(1).describe('Page number for pagination (default: 1)');

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
  transaction_id: z.string().describe('Filter by specific transaction hash').optional(),
  contract: addressSchema.describe('Filter by token contract address').optional(),
  from_address: addressSchema.describe('Filter by sender address').optional(),
  to_address: addressSchema.describe('Filter by recipient address').optional(),
  start_time: z.string().describe('Filter transfers after this ISO 8601 timestamp').optional(),
  end_time: z.string().describe('Filter transfers before this ISO 8601 timestamp').optional(),
  start_block: z.number().int().min(0).describe('Filter transfers after this block number').optional(),
  end_block: z.number().int().min(0).describe('Filter transfers before this block number').optional(),
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
  contract: addressSchema.describe('Filter by specific NFT contract address').optional(),
  token_id: z.string().describe('Filter by specific token ID within a collection').optional(),
  token_standard: z.enum(['ERC721', 'ERC1155']).describe('Filter by NFT token standard').optional(),
  include_null_balances: z.boolean().describe('Include tokens with zero balance (default: false)').optional(),
  limit: limitSchema.optional(),
  page: pageSchema.optional(),
});

// NFT Holders endpoint schema
export const nftHoldersSchema = z.object({
  network: networkSchema,
  contract: addressSchema,
  token_standard: z.enum(['ERC721', 'ERC1155']).describe('Filter by NFT token standard').optional(),
  limit: limitSchema.optional(),
  page: pageSchema.optional(),
});

// Liquidity Pools endpoint schema
export const poolsSchema = z.object({
  network: networkSchema,
  factory: addressSchema.describe('Filter by DEX factory contract address').optional(),
  pool: addressSchema.describe('Filter by specific liquidity pool address').optional(),
  input_token: addressSchema.describe('Filter by input token contract address').optional(),
  output_token: addressSchema.describe('Filter by output token contract address').optional(),
  protocol: z.enum(['uniswap_v1', 'uniswap_v2', 'uniswap_v3', 'uniswap_v4', 'bancor', 'curvefi', 'balancer']).describe('Filter by DEX protocol type').optional(),
  limit: limitSchema.optional(),
  page: pageSchema.optional(),
});

// Subgraph schemas

// URL validation for subgraph endpoints
const urlSchema = z.string().url().describe('The GraphQL endpoint URL of the subgraph');

// Subgraph ID format (QmXxx... IPFS hash format)
const subgraphIdSchema = z.string().min(1).describe('The unique identifier for the subgraph (IPFS hash)');

// GraphQL query string (basic validation - must contain query/mutation keyword)
const graphqlQuerySchema = z.string().min(1).refine(
  (query) => {
    const normalizedQuery = query.trim().toLowerCase();
    return normalizedQuery.includes('query') ||
           normalizedQuery.includes('mutation') ||
           normalizedQuery.includes('{');
  },
  { message: 'Must be a valid GraphQL query (should contain query, mutation, or { }' }
).describe('The GraphQL query to execute against the subgraph');

// Subgraph query with custom endpoint
export const subgraphQuerySchema = z.object({
  endpoint: urlSchema,
  query: graphqlQuerySchema,
  variables: z.record(z.any()).describe('Optional variables to pass to the GraphQL query').optional(),
  operationName: z.string().describe('Optional name of the operation to execute (for queries with multiple operations)').optional(),
});

// Subgraph query by ID
export const subgraphQueryByIdSchema = z.object({
  subgraphId: subgraphIdSchema,
  query: graphqlQuerySchema,
  variables: z.record(z.any()).describe('Optional variables to pass to the GraphQL query').optional(),
  operationName: z.string().describe('Optional name of the operation to execute (for queries with multiple operations)').optional(),
});

// Subgraph metadata query
export const subgraphMetadataSchema = z.object({
  endpoint: urlSchema.describe('The GraphQL endpoint URL of the subgraph (provide either endpoint or subgraphId)').optional(),
  subgraphId: subgraphIdSchema.describe('The unique identifier for the subgraph (provide either endpoint or subgraphId)').optional(),
}).refine(
  (data) => data.endpoint || data.subgraphId,
  { message: 'Either endpoint or subgraphId must be provided' }
);

// Query template execution
export const queryTemplateSchema = z.object({
  templateName: z.string().describe('Name of the pre-built query template to execute'),
  endpoint: urlSchema.describe('The GraphQL endpoint URL of the subgraph (provide either endpoint or subgraphId)').optional(),
  subgraphId: subgraphIdSchema.describe('The unique identifier for the subgraph (provide either endpoint or subgraphId)').optional(),
  variables: z.record(z.any()).describe('Variables to pass to the template query').optional(),
}).refine(
  (data) => data.endpoint || data.subgraphId,
  { message: 'Either endpoint or subgraphId must be provided for template execution' }
);
