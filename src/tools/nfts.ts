import { z } from 'zod';
import { nftOwnershipsSchema, nftHoldersSchema } from '../utils/schemas.js';

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

export const nftTools = [
  {
    name: 'thegraph_nft_ownerships',
    description: 'Get NFT tokens (ERC-721 and ERC-1155) owned by a wallet address',
    inputSchema: zodToJsonSchema(nftOwnershipsSchema),
  },
  {
    name: 'thegraph_nft_holders',
    description: 'Get wallet addresses holding NFT collection tokens',
    inputSchema: zodToJsonSchema(nftHoldersSchema),
  },
];
