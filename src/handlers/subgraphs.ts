import { SubgraphAPI } from '../utils/subgraphApi.js';
import { getAllTemplates, findTemplate } from '../utils/queryTemplates.js';
import { GraphQLQuery } from '../types/subgraph.js';
import {
  subgraphQuerySchema,
  subgraphQueryByIdSchema,
  subgraphMetadataSchema,
  queryTemplateSchema,
} from '../utils/schemas.js';

export async function handleSubgraphTool(
  api: SubgraphAPI,
  name: string,
  args: any
): Promise<any> {
  switch (name) {
    case 'thegraph_subgraph_query': {
      // Execute GraphQL query with custom endpoint
      const validatedArgs = subgraphQuerySchema.parse(args);
      const { endpoint, query, variables, operationName } = validatedArgs;

      const graphqlQuery: GraphQLQuery = {
        query,
        variables,
        operationName,
      };

      const result = await api.query(endpoint, graphqlQuery);
      return result;
    }

    case 'thegraph_subgraph_query_by_id': {
      // Execute GraphQL query using subgraph ID
      const validatedArgs = subgraphQueryByIdSchema.parse(args);
      const { subgraphId, query, variables, operationName } = validatedArgs;

      const graphqlQuery: GraphQLQuery = {
        query,
        variables,
        operationName,
      };

      const result = await api.queryBySubgraphId(subgraphId, graphqlQuery);
      return result;
    }

    case 'thegraph_subgraph_metadata': {
      // Get subgraph metadata
      const validatedArgs = subgraphMetadataSchema.parse(args);
      const { endpoint, subgraphId } = validatedArgs;

      if (endpoint) {
        return await api.getMetadata(endpoint);
      } else if (subgraphId) {
        const gatewayEndpoint = api.buildGatewayUrl(subgraphId);
        return await api.getMetadata(gatewayEndpoint);
      } else {
        throw new Error('Either endpoint or subgraphId must be provided');
      }
    }

    case 'thegraph_subgraph_query_template': {
      // Execute a pre-built query template
      const validatedArgs = queryTemplateSchema.parse(args);
      const { templateName, endpoint, subgraphId, variables } = validatedArgs;

      const template = findTemplate(templateName);
      if (!template) {
        throw new Error(
          `Template "${templateName}" not found. Use thegraph_subgraph_list_templates to see available templates.`
        );
      }

      // Merge provided variables with template defaults
      const mergedVariables = {
        ...template.variables,
        ...(variables || {}),
      };

      const graphqlQuery: GraphQLQuery = {
        query: template.query,
        variables: mergedVariables,
      };

      if (endpoint) {
        return await api.query(endpoint, graphqlQuery);
      } else if (subgraphId) {
        return await api.queryBySubgraphId(subgraphId, graphqlQuery);
      } else {
        throw new Error('Either endpoint or subgraphId must be provided');
      }
    }

    case 'thegraph_subgraph_list_templates': {
      // List all available templates
      const templates = getAllTemplates();
      return {
        templates: templates.map(t => ({
          name: t.name,
          description: t.description,
          subgraph: t.subgraph,
          exampleVariables: t.variables,
        })),
        total: templates.length,
      };
    }

    default:
      throw new Error(`Unknown subgraph tool: ${name}`);
  }
}
