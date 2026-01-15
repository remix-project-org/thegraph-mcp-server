import { QueryTemplate } from '../types/subgraph.js';

/**
 * Pre-built query templates for popular subgraphs
 * These serve as examples and starting points for common queries
 */
export const queryTemplates: Record<string, QueryTemplate[]> = {
  uniswap_v2: [
    {
      name: 'Get Pair Info',
      description: 'Get detailed information about a Uniswap V2 trading pair',
      subgraph: 'Uniswap V2',
      query: `
        query GetPair($pairAddress: ID!) {
          pair(id: $pairAddress) {
            id
            token0 {
              id
              symbol
              name
              decimals
            }
            token1 {
              id
              symbol
              name
              decimals
            }
            reserve0
            reserve1
            totalSupply
            reserveUSD
            volumeUSD
            txCount
          }
        }
      `,
      variables: {
        pairAddress: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc', // USDC-WETH pair
      },
    },
    {
      name: 'Get Top Pairs',
      description: 'Get top trading pairs by volume',
      subgraph: 'Uniswap V2',
      query: `
        query GetTopPairs($first: Int!) {
          pairs(first: $first, orderBy: volumeUSD, orderDirection: desc) {
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
            txCount
          }
        }
      `,
      variables: {
        first: 10,
      },
    },
  ],

  uniswap_v3: [
    {
      name: 'Get Pool Info',
      description: 'Get detailed information about a Uniswap V3 pool',
      subgraph: 'Uniswap V3',
      query: `
        query GetPool($poolAddress: ID!) {
          pool(id: $poolAddress) {
            id
            token0 {
              id
              symbol
              name
              decimals
            }
            token1 {
              id
              symbol
              name
              decimals
            }
            feeTier
            liquidity
            sqrtPrice
            tick
            token0Price
            token1Price
            volumeUSD
            txCount
            totalValueLockedUSD
          }
        }
      `,
      variables: {
        poolAddress: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8', // USDC-WETH 0.3%
      },
    },
    {
      name: 'Get Recent Swaps',
      description: 'Get recent swap transactions in a pool',
      subgraph: 'Uniswap V3',
      query: `
        query GetRecentSwaps($poolAddress: ID!, $first: Int!) {
          swaps(first: $first, orderBy: timestamp, orderDirection: desc, where: { pool: $poolAddress }) {
            id
            timestamp
            sender
            recipient
            amount0
            amount1
            amountUSD
            sqrtPriceX96
            tick
          }
        }
      `,
      variables: {
        poolAddress: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
        first: 20,
      },
    },
  ],

  aave_v3: [
    {
      name: 'Get Reserve Data',
      description: 'Get information about an Aave reserve (lending market)',
      subgraph: 'Aave V3',
      query: `
        query GetReserve($assetAddress: ID!) {
          reserve(id: $assetAddress) {
            id
            symbol
            name
            decimals
            liquidityRate
            variableBorrowRate
            stableBorrowRate
            totalLiquidity
            availableLiquidity
            totalDebt
            utilizationRate
            reserveFactor
          }
        }
      `,
      variables: {
        assetAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      },
    },
    {
      name: 'Get User Position',
      description: 'Get a user\'s positions across all Aave markets',
      subgraph: 'Aave V3',
      query: `
        query GetUserPosition($userAddress: ID!) {
          user(id: $userAddress) {
            id
            reserves {
              reserve {
                symbol
                name
              }
              currentATokenBalance
              currentVariableDebt
              currentStableDebt
            }
          }
        }
      `,
      variables: {
        userAddress: '0x0000000000000000000000000000000000000000',
      },
    },
  ],

  compound: [
    {
      name: 'Get Market Info',
      description: 'Get information about a Compound market',
      subgraph: 'Compound',
      query: `
        query GetMarket($marketId: ID!) {
          market(id: $marketId) {
            id
            symbol
            name
            underlyingAddress
            underlyingSymbol
            borrowRate
            supplyRate
            totalBorrows
            totalSupply
            cash
            reserves
            collateralFactor
            exchangeRate
          }
        }
      `,
      variables: {
        marketId: '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
      },
    },
  ],

  ens: [
    {
      name: 'Get Domain Info',
      description: 'Get information about an ENS domain',
      subgraph: 'ENS',
      query: `
        query GetDomain($domainName: String!) {
          domains(where: { name: $domainName }) {
            id
            name
            labelName
            owner {
              id
            }
            resolver {
              address
            }
            registrant {
              id
            }
            expiryDate
          }
        }
      `,
      variables: {
        domainName: 'vitalik.eth',
      },
    },
    {
      name: 'Get Domains by Owner',
      description: 'Get all ENS domains owned by an address',
      subgraph: 'ENS',
      query: `
        query GetDomainsByOwner($ownerAddress: ID!, $first: Int!) {
          account(id: $ownerAddress) {
            id
            domains(first: $first) {
              name
              labelName
              expiryDate
            }
          }
        }
      `,
      variables: {
        ownerAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        first: 50,
      },
    },
  ],

  generic: [
    {
      name: 'Get Subgraph Metadata',
      description: 'Get metadata about the subgraph (block height, indexing status)',
      subgraph: 'Any',
      query: `
        query GetMetadata {
          _meta {
            deployment
            hasIndexingErrors
            block {
              number
              hash
              timestamp
            }
          }
        }
      `,
      variables: {},
    },
  ],
};

/**
 * Get all available templates
 */
export function getAllTemplates(): QueryTemplate[] {
  return Object.values(queryTemplates).flat();
}

/**
 * Get templates for a specific subgraph
 */
export function getTemplatesForSubgraph(subgraph: string): QueryTemplate[] {
  return queryTemplates[subgraph.toLowerCase()] || [];
}

/**
 * Find a template by name
 */
export function findTemplate(name: string): QueryTemplate | undefined {
  return getAllTemplates().find(
    t => t.name.toLowerCase() === name.toLowerCase()
  );
}
