# The Graph Token API MCP Server

A Model Context Protocol (MCP) server providing access to The Graph's Token API for EVM-compatible blockchains. This server enables AI assistants to query token balances, transfers, holders, NFT ownership, and DEX liquidity pool data.

## Features

- **Token Operations**: Query token balances, transfers, and holder information
- **NFT Operations**: Get NFT ownership and holder data
- **DEX Operations**: Access liquidity pool information from Uniswap and other protocols
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
│   └── thegraph.ts       # The Graph API types
├── tools/                # Tool definitions
│   ├── tokens.ts         # Token tools
│   ├── nfts.ts           # NFT tools
│   └── dex.ts            # DEX tools
├── handlers/             # Tool execution logic
│   ├── tokens.ts         # Token handlers
│   ├── nfts.ts           # NFT handlers
│   └── dex.ts            # DEX handlers
└── utils/
    ├── api.ts            # The Graph API client
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
- [Etherscan MCP Server](https://github.com/remix-project-org/etherscan-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Sources

This implementation is based on:
- [The Graph Token API Quick Start](https://thegraph.com/docs/en/token-api/quick-start/)
- [Token Transfers Documentation](https://thegraph.com/docs/cs/token-api/evm-tokens/transfers/)
- [Token Holders Documentation](https://thegraph.com/docs/hi/token-api/evm-tokens/holders/)
- [NFT Ownerships Documentation](https://thegraph.com/docs/en/token-api/evm-nfts/ownerships/)
- [Liquidity Pools Documentation](https://thegraph.com/docs/zh/token-api/evm-dexs/pools/)
