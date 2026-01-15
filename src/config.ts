import dotenv from 'dotenv';
import { TheGraphConfig } from './types/index.js';

dotenv.config();

export function getConfig(): TheGraphConfig {
  const apiToken = process.env.THEGRAPH_API_TOKEN;

  if (!apiToken) {
    throw new Error('THEGRAPH_API_TOKEN environment variable is required');
  }

  return {
    apiToken,
    baseUrl: 'https://token-api.thegraph.com',
    defaultNetwork: process.env.DEFAULT_NETWORK || 'mainnet',
    subgraphApiKey: process.env.THEGRAPH_SUBGRAPH_API_KEY, // Optional system key for production subgraph queries
  };
}

export const PORT = parseInt(process.env.PORT || '3000', 10);
export const HOST = process.env.HOST || 'localhost';
