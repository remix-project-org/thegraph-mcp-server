export type EVMNetwork =
  | 'mainnet'
  | 'arbitrum-one'
  | 'avalanche'
  | 'base'
  | 'bsc'
  | 'optimism'
  | 'polygon'
  | 'unichain';

export interface TokenBalance {
  address: string;
  contract: string;
  amount: string;
  value: number;
  name: string;
  symbol: string;
  decimals: number;
  network: string;
  last_update?: string;
  last_update_block_num?: number;
  last_update_timestamp?: number;
}

export interface TokenTransfer {
  block_num: number;
  block_timestamp: number;
  transaction_id: string;
  contract: string;
  from_address: string;
  to_address: string;
  amount: string;
  value: number;
  name: string;
  symbol: string;
  decimals: number;
  network: string;
}

export interface TokenHolder {
  address: string;
  contract: string;
  amount: string;
  value: number;
  name: string;
  symbol: string;
  decimals: number;
  network: string;
  last_update: string;
  last_update_block_num: number;
  last_update_timestamp: number;
}

export interface NFTOwnership {
  address: string;
  contract: string;
  token_id: string;
  token_standard: 'ERC721' | 'ERC1155';
  name: string;
  symbol: string;
  network: string;
  amount?: string;
}

export interface NFTHolder {
  address: string;
  contract: string;
  token_standard: 'ERC721' | 'ERC1155';
  name: string;
  symbol: string;
  network: string;
  balance: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
}

export interface LiquidityPool {
  pool: string;
  factory: string;
  protocol: string;
  input_token: TokenInfo;
  output_token: TokenInfo;
  fee: number;
  network: string;
}

export interface APIRequestParams {
  network?: string;
  address?: string;
  contract?: string;
  token_id?: string;
  transaction_id?: string;
  from_address?: string;
  to_address?: string;
  start_time?: string;
  end_time?: string;
  start_block?: number;
  end_block?: number;
  token_standard?: string;
  include_null_balances?: boolean;
  factory?: string;
  pool?: string;
  input_token?: string;
  output_token?: string;
  protocol?: string;
  limit?: number;
  page?: number;
  [key: string]: any;
}
