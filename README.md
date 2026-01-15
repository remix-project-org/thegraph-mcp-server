# The Graph MCP Server

A comprehensive Model Context Protocol (MCP) server providing access to The Graph's Token API and Subgraph querying for EVM-compatible blockchains. This server enables AI assistants to query token data, NFT ownership, DEX liquidity pools, and custom GraphQL queries against any subgraph.

## Features

- **Token Operations**: Query token balances, transfers, and holder information
- **NFT Operations**: Get NFT ownership and holder data
- **DEX Operations**: Access liquidity pool information from Uniswap and other protocols
- **Subgraph Querying**: Execute custom GraphQL queries against any subgraph on The Graph
- **Query Templates**: Pre-built queries for popular subgraphs (Uniswap, Aave, Compound, ENS)
- **Multiple Networks**: Support for Ethereum mainnet, Arbitrum, Avalanche, Base, BSC, Optimism, Polygon, and Unichain
- **MCP Integration**: Full Model Context Protocol support with HTTP transport

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Set your configuration:

```env
# Required: Get your token from https://thegraph.com/market/
THEGRAPH_API_TOKEN=your_token_here

# Optional: Get your subgraph API key from https://thegraph.com/studio/apikeys/
# Only needed if querying subgraphs by ID via gateway
THEGRAPH_SUBGRAPH_API_KEY=your_subgraph_key_here

# Optional: Default network for API requests
DEFAULT_NETWORK=mainnet

# Optional: Server configuration
PORT=3000
HOST=localhost
```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Watch Mode

```bash
npm run watch
```

## Available Tools

### Token Tools

#### `thegraph_token_balances`
Get ERC-20 and native token balances for a wallet address.

**Parameters:**
- `network` (required): Network ID (mainnet, arbitrum-one, avalanche, base, bsc, optimism, polygon, unichain)
- `address` (required): Wallet address (0x...)
- `limit` (optional): Results per page (1-1000, default: 10)
- `page` (optional): Page number (default: 1)

#### `thegraph_token_transfers`
Get ERC-20 and native token transfer events.

**Parameters:**
- `network` (required): Network ID
- `transaction_id` (optional): Filter by transaction hash
- `contract` (optional): Filter by contract address
- `from_address` (optional): Filter by sender address
- `to_address` (optional): Filter by recipient address
- `start_time` (optional): Start time (UNIX timestamp or date string)
- `end_time` (optional): End time (UNIX timestamp or date string)
- `start_block` (optional): Minimum block number
- `end_block` (optional): Maximum block number
- `limit` (optional): Results per page (1-1000, default: 10)
- `page` (optional): Page number (default: 1)

#### `thegraph_token_holders`
Get top token holders ranked by balance for a specific contract.

**Parameters:**
- `network` (required): Network ID
- `contract` (required): Token contract address
- `limit` (optional): Results per page (1-1000, default: 10)
- `page` (optional): Page number (default: 1)

### NFT Tools

#### `thegraph_nft_ownerships`
Get NFT tokens (ERC-721 and ERC-1155) owned by a wallet address.

**Parameters:**
- `network` (required): Network ID
- `address` (required): Wallet address
- `contract` (optional): Filter by NFT contract address
- `token_id` (optional): Filter by token ID
- `token_standard` (optional): ERC721 or ERC1155
- `include_null_balances` (optional): Include zero balances (boolean)
- `limit` (optional): Results per page (1-1000, default: 10)
- `page` (optional): Page number (default: 1)

#### `thegraph_nft_holders`
Get wallet addresses holding NFT collection tokens.

**Parameters:**
- `network` (required): Network ID
- `contract` (required): NFT contract address
- `token_standard` (optional): ERC721 or ERC1155
- `limit` (optional): Results per page (1-1000, default: 10)
- `page` (optional): Page number (default: 1)

### DEX Tools

#### `thegraph_dex_pools`
Get Uniswap liquidity pool metadata including token pairs, fees, and protocol versions.

**Parameters:**
- `network` (required): Network ID
- `factory` (optional): Filter by factory address
- `pool` (optional): Filter by pool address
- `input_token` (optional): Filter by input token address
- `output_token` (optional): Filter by output token address
- `protocol` (optional): Protocol name (uniswap_v1, uniswap_v2, uniswap_v3, uniswap_v4, bancor, curvefi, balancer)
- `limit` (optional): Results per page (1-1000, default: 10)
- `page` (optional): Page number (default: 1)

### Subgraph Tools

The server provides flexible subgraph querying capabilities with both custom queries and pre-built templates.

#### `thegraph_subgraph_query`
Execute a custom GraphQL query against any subgraph using an endpoint URL. This is the most flexible option.

**Parameters:**
- `endpoint` (required): Full subgraph endpoint URL (e.g., `https://api.studio.thegraph.com/query/<ID>/<SUBGRAPH>/<VERSION>`)
- `query` (required): GraphQL query string
- `variables` (optional): Query variables object
- `operationName` (optional): GraphQL operation name

**Example:**
```json
{
  "endpoint": "https://api.studio.thegraph.com/query/12345/uniswap-v3/v0.0.1",
  "query": "query GetPool($poolId: ID!) { pool(id: $poolId) { id token0 { symbol } token1 { symbol } } }",
  "variables": { "poolId": "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8" }
}
```

#### `thegraph_subgraph_query_by_id`
Execute a GraphQL query using a subgraph ID. Requires `THEGRAPH_SUBGRAPH_API_KEY` to be configured.

**Parameters:**
- `subgraphId` (required): The Graph subgraph ID (deployment hash)
- `query` (required): GraphQL query string
- `variables` (optional): Query variables object
- `operationName` (optional): GraphQL operation name

**Example:**
```json
{
  "subgraphId": "5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV",
  "query": "query { pairs(first: 5) { id token0 { symbol } token1 { symbol } } }"
}
```

#### `thegraph_subgraph_metadata`
Get metadata about a subgraph including deployment info, current block, and indexing status.

**Parameters:**
- `endpoint` (optional): Subgraph endpoint URL
- `subgraphId` (optional): Subgraph ID (requires API key)

**Note:** Must provide either `endpoint` or `subgraphId`.

**Example Response:**
```json
{
  "_meta": {
    "deployment": "QmXxx...",
    "hasIndexingErrors": false,
    "block": {
      "number": 12345678,
      "hash": "0xabc...",
      "timestamp": 1234567890
    }
  }
}
```

#### `thegraph_subgraph_query_template`
Execute a pre-built query template for popular subgraphs. Templates include queries for Uniswap V2/V3, Aave V3, Compound, and ENS.

**Parameters:**
- `templateName` (required): Name of the template (e.g., "Get Pair Info", "Get Pool Info")
- `endpoint` (optional): Subgraph endpoint URL
- `subgraphId` (optional): Subgraph ID (requires API key)
- `variables` (optional): Override default template variables

**Note:** Must provide either `endpoint` or `subgraphId`.

**Available Templates:**
- **Uniswap V2**: "Get Pair Info", "Get Top Pairs"
- **Uniswap V3**: "Get Pool Info", "Get Recent Swaps"
- **Aave V3**: "Get Reserve Data", "Get User Position"
- **Compound**: "Get Market Info"
- **ENS**: "Get Domain Info", "Get Domains by Owner"
- **Generic**: "Get Subgraph Metadata"

**Example:**
```json
{
  "templateName": "Get Pool Info",
  "endpoint": "https://api.studio.thegraph.com/query/12345/uniswap-v3/v0.0.1",
  "variables": {
    "poolAddress": "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"
  }
}
```

#### `thegraph_subgraph_list_templates`
List all available query templates with descriptions and example variables.

**Parameters:** None

**Returns:** Array of templates with name, description, supported subgraph, and example variables.

### GraphQL Query Examples

#### Simple Query
```graphql
query {
  pairs(first: 10, orderBy: volumeUSD, orderDirection: desc) {
    id
    token0 {
      symbol
      name
    }
    token1 {
      symbol
      name
    }
    reserveUSD
    volumeUSD
  }
}
```

#### Query with Variables
```graphql
query GetUserTokens($userAddress: ID!, $first: Int!) {
  user(id: $userAddress) {
    id
    liquidityPositions(first: $first) {
      pair {
        token0 { symbol }
        token1 { symbol }
      }
      liquidityTokenBalance
    }
  }
}
```

Variables:
```json
{
  "userAddress": "0x1234...",
  "first": 20
}
```

#### Time-Travel Query
```graphql
query GetHistoricalData($blockNumber: Int!) {
  pairs(first: 10, block: { number: $blockNumber }) {
    id
    reserveUSD
    volumeUSD
  }
}
```

### Finding Subgraph Endpoints

1. **The Graph Explorer**: Browse subgraphs at https://thegraph.com/explorer
2. **Subgraph Studio**: Manage your own subgraphs at https://thegraph.com/studio
3. **Popular Subgraphs**:
   - Uniswap V2: Search "Uniswap V2" in The Graph Explorer
   - Uniswap V3: Search "Uniswap V3" in The Graph Explorer
   - Aave V3: Search "Aave V3" in The Graph Explorer
   - ENS: Search "ENS" in The Graph Explorer

## Supported Networks

- `mainnet` - Ethereum Mainnet
- `arbitrum-one` - Arbitrum One
- `avalanche` - Avalanche C-Chain
- `base` - Base
- `bsc` - BNB Smart Chain
- `optimism` - Optimism
- `polygon` - Polygon (Matic)
- `unichain` - Unichain

## API Endpoints

The server exposes the following HTTP endpoints:

- `GET /health` - Health check and session status
- `POST /mcp` - Initialize sessions and send MCP requests
- `GET /mcp` - Establish SSE streams for MCP communication
- `DELETE /mcp` - Terminate MCP sessions

## Architecture

Based on the Etherscan MCP server pattern with the following structure:

```
src/
├── index.ts              # Entry point
├── server.ts             # MCP server implementation
├── config.ts             # Configuration management
├── types/                # TypeScript definitions
│   ├── index.ts          # Main types
│   ├── thegraph.ts       # The Graph Token API types
│   └── subgraph.ts       # Subgraph and GraphQL types
├── tools/                # Tool definitions (11 total)
│   ├── tokens.ts         # Token tools (3 tools)
│   ├── nfts.ts           # NFT tools (2 tools)
│   ├── dex.ts            # DEX tools (1 tool)
│   └── subgraphs.ts      # Subgraph tools (5 tools)
├── handlers/             # Tool execution logic
│   ├── tokens.ts         # Token handlers
│   ├── nfts.ts           # NFT handlers
│   ├── dex.ts            # DEX handlers
│   └── subgraphs.ts      # Subgraph handlers
└── utils/
    ├── api.ts            # The Graph Token API client
    ├── subgraphApi.ts    # Subgraph GraphQL client
    ├── queryTemplates.ts # Pre-built query templates
    └── schemas.ts        # Zod validation schemas
```

## Error Handling

The server includes comprehensive error handling:
- API authentication errors (401)
- Invalid parameters (400)
- Rate limiting (429)
- Server errors (500)

## License

MIT

## References

- [The Graph Token API Documentation](https://thegraph.com/docs/en/token-api/quick-start/)
- [The Graph Subgraphs Documentation](https://thegraph.com/docs/en/subgraphs/quick-start/)
- [GraphQL API Reference](https://thegraph.com/docs/en/subgraphs/querying/graphql-api/)
- [The Graph Explorer](https://thegraph.com/explorer)
- [Etherscan MCP Server](https://github.com/remix-project-org/etherscan-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Sources

This implementation is based on:

**Token API:**
- [The Graph Token API Quick Start](https://thegraph.com/docs/en/token-api/quick-start/)
- [Token Transfers Documentation](https://thegraph.com/docs/cs/token-api/evm-tokens/transfers/)
- [Token Holders Documentation](https://thegraph.com/docs/hi/token-api/evm-tokens/holders/)
- [NFT Ownerships Documentation](https://thegraph.com/docs/en/token-api/evm-nfts/ownerships/)
- [Liquidity Pools Documentation](https://thegraph.com/docs/zh/token-api/evm-dexs/pools/)

**Subgraphs:**
- [Subgraph Quick Start](https://thegraph.com/docs/en/subgraphs/quick-start/)
- [GraphQL API Documentation](https://thegraph.com/docs/en/subgraphs/querying/graphql-api/)
- [Querying from an Application](https://thegraph.com/docs/en/subgraphs/querying/from-an-application/)
- [Managing API Keys](https://thegraph.com/docs/en/subgraphs/querying/managing-api-keys/)
