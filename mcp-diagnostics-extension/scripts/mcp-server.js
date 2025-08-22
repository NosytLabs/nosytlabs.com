#!/usr/bin/env node

/**
 * MCP Diagnostics Extension Server
 * Provides diagnostic capabilities for the MCP (Model Context Protocol) system
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class MCPDiagnosticsServer {
  constructor() {
    this.server = new Server(
      {
        name: 'mcp-diagnostics-extension',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // List available diagnostic tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'system_diagnostics',
            description: 'Run system diagnostics and health checks',
            inputSchema: {
              type: 'object',
              properties: {
                check_type: {
                  type: 'string',
                  enum: ['memory', 'disk', 'network', 'all'],
                  description: 'Type of diagnostic check to perform',
                },
              },
              required: ['check_type'],
            },
          },
          {
            name: 'log_analysis',
            description: 'Analyze application logs for issues',
            inputSchema: {
              type: 'object',
              properties: {
                log_path: {
                  type: 'string',
                  description: 'Path to log file to analyze',
                },
                severity: {
                  type: 'string',
                  enum: ['error', 'warning', 'info', 'all'],
                  description: 'Minimum severity level to analyze',
                },
              },
              required: ['log_path'],
            },
          },
        ],
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'system_diagnostics':
            return await this.runSystemDiagnostics(args.check_type);

          case 'log_analysis':
            return await this.analyzeLog(args.log_path, args.severity || 'error');

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async runSystemDiagnostics(checkType) {
    const os = require('os');
    const fs = require('fs').promises;

    const diagnostics = {};

    if (checkType === 'memory' || checkType === 'all') {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;

      diagnostics.memory = {
        total: `${Math.round((totalMem / 1024 / 1024 / 1024) * 100) / 100} GB`,
        used: `${Math.round((usedMem / 1024 / 1024 / 1024) * 100) / 100} GB`,
        free: `${Math.round((freeMem / 1024 / 1024 / 1024) * 100) / 100} GB`,
        usage_percent: `${Math.round((usedMem / totalMem) * 100)}%`,
      };
    }

    if (checkType === 'disk' || checkType === 'all') {
      try {
        const stats = await fs.stat(process.cwd());
        diagnostics.disk = {
          current_directory: process.cwd(),
          accessible: true,
          last_modified: stats.mtime,
        };
      } catch (error) {
        diagnostics.disk = {
          current_directory: process.cwd(),
          accessible: false,
          error: error.message,
        };
      }
    }

    if (checkType === 'network' || checkType === 'all') {
      const networkInterfaces = os.networkInterfaces();
      diagnostics.network = {
        interfaces: Object.keys(networkInterfaces).length,
        hostname: os.hostname(),
        platform: os.platform(),
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `System Diagnostics Results:\n${JSON.stringify(diagnostics, null, 2)}`,
        },
      ],
    };
  }

  async analyzeLog(logPath, severity) {
    const fs = require('fs').promises;
    const path = require('path');

    try {
      // Check if log file exists
      const fullPath = path.resolve(logPath);
      const logContent = await fs.readFile(fullPath, 'utf8');

      const lines = logContent.split('\n');
      const severityLevels = ['error', 'warning', 'info'];
      const targetLevel = severityLevels.indexOf(severity.toLowerCase());

      const filteredLines = lines.filter(line => {
        const lowerLine = line.toLowerCase();
        return severityLevels.some((level, index) => {
          return index <= targetLevel && lowerLine.includes(level);
        });
      });

      const analysis = {
        total_lines: lines.length,
        filtered_lines: filteredLines.length,
        severity_filter: severity,
        log_path: fullPath,
        sample_entries: filteredLines.slice(0, 10), // First 10 matching entries
      };

      return {
        content: [
          {
            type: 'text',
            text: `Log Analysis Results:\n${JSON.stringify(analysis, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing log file: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  setupErrorHandling() {
    this.server.onerror = error => {
      console.error('[MCP Diagnostics Server Error]:', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Diagnostics Extension Server running on stdio');
  }
}

// Start the server
if (require.main === module) {
  const server = new MCPDiagnosticsServer();
  server.run().catch(console.error);
}

module.exports = MCPDiagnosticsServer;
