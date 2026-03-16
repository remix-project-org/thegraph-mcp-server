import {
  subgraphQuerySchema,
  subgraphQueryByIdSchema,
  subgraphMetadataSchema,
  queryTemplateSchema,
} from '../utils/schemas.js';
import { zodToJsonSchema } from '../utils/zodToJsonSchema.js';

export const subgraphTools = [
  {
    name: 'thegraph_subgraph_query',
    description: 'Execute a GraphQL query against any subgraph using a custom endpoint URL. This is the most flexible option for querying any subgraph.',
    inputSchema: zodToJsonSchema(subgraphQuerySchema),
  },
  {
    name: 'thegraph_subgraph_query_by_id',
    description: 'Execute a GraphQL query using a subgraph ID. Requires the system API key to be configured. The query will use The Graph\'s gateway endpoint.',
    inputSchema: zodToJsonSchema(subgraphQueryByIdSchema),
  },
  {
    name: 'thegraph_subgraph_metadata',
    description: 'Get metadata about a subgraph including deployment info, current block height, and indexing status',
    inputSchema: zodToJsonSchema(subgraphMetadataSchema),
  },
  {
    name: 'thegraph_subgraph_query_template',
    description: 'Execute a pre-built query template for popular subgraphs (Uniswap V2/V3, Aave V3, Compound, ENS). Templates provide ready-to-use queries with customizable variables.',
    inputSchema: zodToJsonSchema(queryTemplateSchema),
  },
  {
    name: 'thegraph_subgraph_list_templates',
    description: 'List all available query templates with their descriptions, supported subgraphs, and example variables',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];
