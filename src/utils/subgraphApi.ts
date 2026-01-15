import { TheGraphConfig } from '../types/index.js';
import { GraphQLQuery, GraphQLResponse } from '../types/subgraph.js';

export class SubgraphAPI {
  private config: TheGraphConfig;

  constructor(config: TheGraphConfig) {
    this.config = config;
  }

  /**
   * Build gateway URL with API key for production queries
   */
  buildGatewayUrl(subgraphId: string): string {
    if (!this.config.subgraphApiKey) {
      throw new Error(
        'THEGRAPH_SUBGRAPH_API_KEY is not configured. ' +
        'Either provide the API key in configuration or use a custom endpoint URL.'
      );
    }
    return `https://gateway.thegraph.com/api/${this.config.subgraphApiKey}/subgraphs/id/${subgraphId}`;
  }

  /**
   * Execute a GraphQL query against a subgraph endpoint
   */
  async query<T = any>(
    endpoint: string,
    graphqlQuery: GraphQLQuery
  ): Promise<GraphQLResponse<T>> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: graphqlQuery.query,
          variables: graphqlQuery.variables || {},
          operationName: graphqlQuery.operationName,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Subgraph request failed with status ${response.status}: ${errorText}`
        );
      }

      const result = await response.json() as GraphQLResponse<T>;

      // Check for GraphQL errors in the response
      if (result.errors && result.errors.length > 0) {
        const errorMessages = result.errors.map(e => e.message).join(', ');
        throw new Error(`GraphQL errors: ${errorMessages}`);
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Subgraph query failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Execute a query using subgraph ID (requires API key)
   */
  async queryBySubgraphId<T = any>(
    subgraphId: string,
    graphqlQuery: GraphQLQuery
  ): Promise<GraphQLResponse<T>> {
    const endpoint = this.buildGatewayUrl(subgraphId);
    return this.query<T>(endpoint, graphqlQuery);
  }

  /**
   * Get subgraph metadata via introspection query
   */
  async getMetadata(endpoint: string): Promise<any> {
    const introspectionQuery = {
      query: `
        query {
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
    };

    const result = await this.query(endpoint, introspectionQuery);
    return result.data;
  }
}
