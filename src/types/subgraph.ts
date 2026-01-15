export type SubgraphEndpointType = 'studio' | 'gateway' | 'custom';

export interface SubgraphEndpoint {
  url: string;
  type: SubgraphEndpointType;
  subgraphId?: string;
}

export interface GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
}

export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: Array<string | number>;
  extensions?: Record<string, any>;
}

export interface SubgraphQueryParams {
  endpoint?: string;
  subgraphId?: string;
  query: string;
  variables?: Record<string, any>;
}

export interface SubgraphMetadata {
  version?: string;
  deployment?: string;
  network?: string;
}

// Common query templates
export interface QueryTemplate {
  name: string;
  description: string;
  query: string;
  variables: Record<string, any>;
  subgraph: string;
}
