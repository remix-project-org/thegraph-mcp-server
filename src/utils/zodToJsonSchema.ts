import { z } from 'zod';

/**
 * Convert Zod schema to JSON Schema format for MCP tools
 * Extracts descriptions, types, defaults, and validation rules
 */
export function zodToJsonSchema(schema: z.ZodType<any>): any {
  // Handle ZodEffects (schemas with .refine(), .transform(), etc.)
  // We need to unwrap to get to the underlying schema
  let actualSchema = schema;
  if (actualSchema instanceof z.ZodEffects) {
    actualSchema = (actualSchema as any)._def.schema;
  }

  const shape = (actualSchema as any)._def.shape?.();
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

    // Extract description from Zod schema
    const description = (innerType as any)._def?.description;

    // Extract type information
    if (innerType instanceof z.ZodString) {
      properties[key] = { type: 'string' };
      if (description) properties[key].description = description;

      if ((innerType as any)._def.checks) {
        for (const check of (innerType as any)._def.checks) {
          if (check.kind === 'regex') {
            properties[key].pattern = check.regex.source;
          }
        }
      }
    } else if (innerType instanceof z.ZodNumber) {
      properties[key] = { type: 'number' };
      if (description) properties[key].description = description;
    } else if (innerType instanceof z.ZodBoolean) {
      properties[key] = { type: 'boolean' };
      if (description) properties[key].description = description;
    } else if (innerType instanceof z.ZodRecord || innerType instanceof z.ZodObject) {
      properties[key] = { type: 'object' };
      if (description) properties[key].description = description;
    } else if (innerType instanceof z.ZodEnum) {
      const enumDescription = (innerType as any)._def?.description;
      properties[key] = {
        type: 'string',
        enum: innerType._def.values,
      };
      if (enumDescription) properties[key].description = enumDescription;
    } else if (innerType instanceof z.ZodDefault) {
      const defaultValue = innerType._def.defaultValue();
      const defaultInnerType = innerType._def.innerType;

      // Recursively process the inner type
      properties[key] = zodToJsonSchema(z.object({ temp: defaultInnerType })).properties.temp;
      properties[key].default = defaultValue;

      // Extract description from the default wrapper if present
      const defaultDescription = (innerType as any)._def?.description;
      if (defaultDescription) {
        properties[key].description = defaultDescription;
      }
    }
  }

  return {
    type: 'object',
    properties,
    required,
  };
}
