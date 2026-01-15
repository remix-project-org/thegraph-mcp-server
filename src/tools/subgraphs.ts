import { z } from 'zod';
import {
  subgraphQuerySchema,
  subgraphQueryByIdSchema,
  subgraphMetadataSchema,
  queryTemplateSchema,
} from '../utils/schemas.js';

// Helper to convert Zod schema to JSON Schema format
function zodToJsonSchema(schema: z.ZodType<any>): any {
  const shape = (schema as any)._def.shape?.();
  if (!shape) return {};

  const properties: any = {};
  const required: string[] = [];

  for (const [key, value] of Object.entries(shape)) {
    const zodField = value as z.ZodType<any>;
    const isOptional = zodField instanceof z.ZodOptional;
    const innerType = isOptional ? (zodField as any)._def.innerType : zodField;

    if (!isOptional) {
      required.push(key);
    }

    // Extract type information
    if (innerType instanceof z.ZodString) {
      properties[key] = { type: 'string' };
      if ((innerType as any)._def.checks) {
        for (const check of (innerType as any)._def.checks) {
          if (check.kind === 'regex') {
            properties[key].pattern = check.regex.source;
          }
        }
      }
    } else if (innerType instanceof z.ZodNumber) {
      properties[key] = { type: 'number' };
    } else if (innerType instanceof z.ZodBoolean) {
      properties[key] = { type: 'boolean' };
    } else if (innerType instanceof z.ZodRecord || innerType instanceof z.ZodObject) {
      properties[key] = { type: 'object' };
    } else if (innerType instanceof z.ZodEnum) {
      properties[key] = {
        type: 'string',
        enum: innerType._def.values,
      };
    } else if (innerType instanceof z.ZodDefault) {
      const defaultValue = innerType._def.defaultValue();
      properties[key] = zodToJsonSchema(innerType._def.innerType);
      properties[key].default = defaultValue;
    }
  }

  return {
    type: 'object',
    properties,
    required,
  };
}

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
