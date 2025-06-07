# MCP Server Configuration Guide

## Overview

This document outlines the proper configuration for Model Context Protocol (MCP) servers in your VS Code environment.

## Current Server Setup

### 1. Sequential Thinking Server

- **Package**: `@smithery-ai/server-sequential-thinking`
- **Purpose**: Advanced reasoning and step-by-step problem solving
- **Command**: `npx @smithery/cli@latest run @smithery-ai/server-sequential-thinking`

### 2. Smithery Toolbox

- **URL**: Remote server via HTTPS
- **Purpose**: Collection of AI utilities and tools
- **Access**: Via API endpoint with profile-based authentication

### 3. Console Ninja

- **Purpose**: Console debugging and monitoring
- **Platform**: Windows PowerShell execution
- **Location**: User profile directory

### 4. Brave Search

- **Package**: `@smithery-ai/brave-search`
- **Purpose**: Web search integration
- **Features**: Privacy-focused search results

### 5. Playwright Server

- **Package**: `@showfive/playwright-mcp-server`
- **Purpose**: Browser automation and testing
- **Capabilities**: Web scraping, testing, screenshot generation

### 6. Context7 MCP

- **Package**: `@upstash/context7-mcp`
- **Purpose**: Context management and retrieval
- **Features**: Vector storage and semantic search

### 7. 21st Dev Magic

- **Package**: `@21st-dev/magic-mcp`
- **Purpose**: Modern development tools
- **Features**: File transport and advanced utilities

### 8. Desktop Commander

- **Package**: `@zhanyiwp/desktopcommandermcp-1`
- **Purpose**: Desktop command execution
- **Platform**: Windows desktop integration

## Configuration Standards

### Command Structure

All MCP servers follow this standardized pattern:

```json
{
  "command": "npx",
  "env": {},
  "args": [
    "-y",
    "@smithery/cli@latest",
    "run",
    "<package-name>",
    "--key",
    "<api-key>"
  ]
}
```

### Environment Variables

- All servers use empty `env` object for clean environment
- API keys are consistently applied via `--key` parameter
- Windows-specific commands use `powershell.exe` when needed

### Best Practices Applied

1. **Consistency**: All servers use the same command structure
2. **Automation**: `-y` flag prevents interactive prompts
3. **Latest Versions**: Always use `@latest` to ensure updates
4. **Clean Environment**: Empty env objects prevent conflicts
5. **Centralized Authentication**: Single API key for all Smithery services

## Troubleshooting

### Common Issues

1. **Server Not Found**: Ensure package names are correct
2. **Authentication Errors**: Verify API key validity
3. **Command Failures**: Check PowerShell execution policy
4. **Network Issues**: Verify internet connection for remote servers

### Validation

To validate your configuration:

1. Check JSON syntax in VS Code settings
2. Restart VS Code after changes
3. Monitor the MCP server status in the status bar
4. Check console output for error messages

## Security Notes

- API keys are visible in configuration files
- Consider using environment variables for production
- Regularly rotate API keys for security
- Monitor server access logs when available

## Future Enhancements

- Environment variable integration
- Server health monitoring
- Automatic fallback mechanisms
- Performance optimization settings
