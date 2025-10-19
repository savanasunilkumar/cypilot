import { EventEmitter } from 'events';
import {
  MCPMessage,
  MCPRequest,
  MCPResponse,
  MCPNotification,
  MCPServerCapabilities,
  MCPTool,
  MCPResource,
  MCPPrompt,
  MCPConnection
} from './types/mcp';

export class MCPClient extends EventEmitter {
  private connections: Map<string, MCPConnection> = new Map();
  private messageId = 0;

  constructor() {
    super();
  }

  /**
   * Initialize connection to an MCP server
   */
  async connect(serverId: string, transport: 'stdio' | 'websocket' | 'http', config: any): Promise<MCPConnection> {
    const connection: MCPConnection = {
      id: serverId,
      name: config.name || serverId,
      capabilities: {},
      status: 'connecting'
    };

    this.connections.set(serverId, connection);
    this.emit('connection:connecting', connection);

    try {
      // Initialize the MCP session
      const initResponse = await this.sendRequest(serverId, 'initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {},
          prompts: {}
        },
        clientInfo: {
          name: '@cypilot/mcp-client',
          version: '1.0.0'
        }
      });

      if (initResponse.error) {
        throw new Error(`Failed to initialize MCP server: ${initResponse.error.message}`);
      }

      connection.capabilities = initResponse.result.capabilities || {};
      connection.status = 'connected';

      // Send initialized notification
      await this.sendNotification(serverId, 'notifications/initialized');

      this.connections.set(serverId, connection);
      this.emit('connection:connected', connection);

      return connection;
    } catch (error) {
      connection.status = 'error';
      connection.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.connections.set(serverId, connection);
      this.emit('connection:error', connection);
      throw error;
    }
  }

  /**
   * Disconnect from an MCP server
   */
  async disconnect(serverId: string): Promise<void> {
    const connection = this.connections.get(serverId);
    if (!connection) return;

    try {
      connection.status = 'disconnected';
      this.connections.set(serverId, connection);
      this.emit('connection:disconnected', connection);
    } finally {
      this.connections.delete(serverId);
    }
  }

  /**
   * Send a request to an MCP server
   */
  async sendRequest(serverId: string, method: string, params?: any): Promise<MCPResponse> {
    const connection = this.connections.get(serverId);
    if (!connection || connection.status !== 'connected') {
      throw new Error(`Server ${serverId} is not connected`);
    }

    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: ++this.messageId,
      method,
      params
    };

    this.emit('request:sent', { serverId, request });

    // In a real implementation, this would send the request over the transport
    // For now, we'll simulate the response
    return new Promise((resolve) => {
      setTimeout(() => {
        const response: MCPResponse = {
          jsonrpc: '2.0',
          id: request.id,
          result: { success: true }
        };
        this.emit('response:received', { serverId, response });
        resolve(response);
      }, 100);
    });
  }

  /**
   * Send a notification to an MCP server
   */
  async sendNotification(serverId: string, method: string, params?: any): Promise<void> {
    const connection = this.connections.get(serverId);
    if (!connection || connection.status !== 'connected') {
      throw new Error(`Server ${serverId} is not connected`);
    }

    const notification: MCPNotification = {
      jsonrpc: '2.0',
      method,
      params
    };

    this.emit('notification:sent', { serverId, notification });
  }

  /**
   * List available tools from an MCP server
   */
  async listTools(serverId: string): Promise<MCPTool[]> {
    const response = await this.sendRequest(serverId, 'tools/list');
    return response.result?.tools || [];
  }

  /**
   * Call a tool on an MCP server
   */
  async callTool(serverId: string, toolName: string, arguments_: any): Promise<any> {
    const response = await this.sendRequest(serverId, 'tools/call', {
      name: toolName,
      arguments: arguments_
    });
    return response.result;
  }

  /**
   * List available resources from an MCP server
   */
  async listResources(serverId: string): Promise<MCPResource[]> {
    const response = await this.sendRequest(serverId, 'resources/list');
    return response.result?.resources || [];
  }

  /**
   * Read a resource from an MCP server
   */
  async readResource(serverId: string, uri: string): Promise<any> {
    const response = await this.sendRequest(serverId, 'resources/read', { uri });
    return response.result;
  }

  /**
   * List available prompts from an MCP server
   */
  async listPrompts(serverId: string): Promise<MCPPrompt[]> {
    const response = await this.sendRequest(serverId, 'prompts/list');
    return response.result?.prompts || [];
  }

  /**
   * Get a prompt from an MCP server
   */
  async getPrompt(serverId: string, promptName: string, arguments_?: any): Promise<any> {
    const response = await this.sendRequest(serverId, 'prompts/get', {
      name: promptName,
      arguments: arguments_
    });
    return response.result;
  }

  /**
   * Get connection status
   */
  getConnection(serverId: string): MCPConnection | undefined {
    return this.connections.get(serverId);
  }

  /**
   * Get all connections
   */
  getAllConnections(): MCPConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * Check if a server is connected
   */
  isConnected(serverId: string): boolean {
    const connection = this.connections.get(serverId);
    return connection?.status === 'connected';
  }
}
