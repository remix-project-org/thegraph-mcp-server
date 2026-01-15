import { z } from 'zod';
import { balancesSchema, transfersSchema, holdersSchema } from '../utils/schemas.js';

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

export const tokenTools = [
  {
    name: 'thegraph_token_balances',
    description: 'Get ERC-20 and native token balances for a wallet address',
    inputSchema: zodToJsonSchema(balancesSchema),
  },
  {
    name: 'thegraph_token_transfers',
    description: 'Get ERC-20 and native token transfer events with transaction and block data',
    inputSchema: zodToJsonSchema(transfersSchema),
  },
  {
    name: 'thegraph_token_holders',
    description: 'Get top token holders ranked by balance for a specific contract',
    inputSchema: zodToJsonSchema(holdersSchema),
  },
];
