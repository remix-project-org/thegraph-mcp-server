import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'node:crypto';
import { getConfig, HOST, PORT } from './config.js';
import { TheGraphAPI } from './utils/api.js';
import { tokenTools } from './tools/tokens.js';
import { nftTools } from './tools/nfts.js';
import { dexTools } from './tools/dex.js';
import { handleTokenTool } from './handlers/tokens.js';
import { handleNFTTool } from './handlers/nfts.js';
import { handleDEXTool } from './handlers/dex.js';

export class TheGraphMCPServer {
  private app: express.Application;
  private config: ReturnType<typeof getConfig>;
  private api: TheGraphAPI;
  private transports: Map<string, StreamableHTTPServerTransport>;

  constructor() {
    this.app = express();
    this.config = getConfig();
    this.api = new TheGraphAPI(this.config);
    this.transports = new Map();

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Enable CORS for all routes
    this.app.use(cors({
      origin: '*', // Allow all origins - configure for production
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept', 'mcp-session-id'],
      exposedHeaders: ['mcp-session-id'], // Expose session ID header to clients
      credentials: false
    }));
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (_req: express.Request, res: express.Response) => {
      res.json({
        status: 'ok',
        sessions: this.transports.size,
      });
    });

    // MCP POST endpoint - handles initialization and messages
    this.app.post('/mcp', async (req: express.Request, res: express.Response) => {
      const sessionId = req.headers['mcp-session-id'] as string;

      try {
        let transport = sessionId ? this.transports.get(sessionId) : undefined;

        if (!transport) {
          const server = new Server(
            {
              name: 'thegraph-token-api-mcp',
              version: '1.0.0',
            },
            {
              capabilities: {
                tools: {},
              },
            }
          );

          this.setupHandlers(server);

          transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sid: string) => {
              console.log(`Session initialized: ${sid}`);
              if (transport) {
                this.transports.set(sid, transport);
              }
            },
          });

          transport.onclose = () => {
            const sid = transport?.sessionId;
            if (sid && this.transports.has(sid)) {
              console.log(`Session closed: ${sid}`);
              this.transports.delete(sid);
            }
          };

          await server.connect(transport);
        }

        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
          res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    });

    // MCP GET endpoint - handles SSE streams
    this.app.get('/mcp', async (req: express.Request, res: express.Response) => {
      const sessionId = req.headers['mcp-session-id'] as string;
      const transport = sessionId ? this.transports.get(sessionId) : undefined;

      if (!transport) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      try {
        await transport.handleRequest(req, res);
      } catch (error) {
        console.error('Error handling SSE stream:', error);
        if (!res.headersSent) {
          res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    });

    // MCP DELETE endpoint - terminates sessions
    this.app.delete('/mcp', async (req: express.Request, res: express.Response) => {
      const sessionId = req.headers['mcp-session-id'] as string;
      const transport = sessionId ? this.transports.get(sessionId) : undefined;

      if (transport) {
        try {
          await transport.handleRequest(req, res);
          this.transports.delete(sessionId);
          console.log(`Session deleted: ${sessionId}`);
        } catch (error) {
          console.error('Error deleting session:', error);
          if (!res.headersSent) {
            res.status(500).json({
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      } else {
        res.status(200).json({ message: 'Session not found or already terminated' });
      }
    });
  }

  private setupHandlers(server: Server): void {
    // List available tools
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [...tokenTools, ...nftTools, ...dexTools],
    }));

    // Handle tool execution
    server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;

      try {
        let result: any;

        // Route to appropriate handler based on tool name prefix
        if (name.startsWith('thegraph_token_')) {
          result = await handleTokenTool(this.api, name, args);
        } else if (name.startsWith('thegraph_nft_')) {
          result = await handleNFTTool(this.api, name, args);
        } else if (name.startsWith('thegraph_dex_')) {
          result = await handleDEXTool(this.api, name, args);
        } else {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    });
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(PORT, HOST, () => {
        console.log(`The Graph Token API MCP Server running on http://${HOST}:${PORT}`);
        console.log(`Health check: http://${HOST}:${PORT}/health`);
        resolve();
      });
    });
  }
}
