import { TheGraphConfig } from '../types/index.js';
import { APIRequestParams } from '../types/thegraph.js';

export class TheGraphAPI {
  private config: TheGraphConfig;

  constructor(config: TheGraphConfig) {
    this.config = config;
  }

  async request<T = any>(
    endpoint: string,
    params: APIRequestParams = {}
  ): Promise<T> {
    // Build query string from params
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    }

    const url = `${this.config.baseUrl}${endpoint}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.config.apiToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json() as T;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Token API request failed: ${error.message}`);
      }
      throw error;
    }
  }
}
