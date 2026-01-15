export interface TheGraphConfig {
  apiToken: string;
  baseUrl: string;
  defaultNetwork: string;
  subgraphApiKey?: string;
}

export interface TokenAPIResponse<T = any> {
  data: T[];
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
