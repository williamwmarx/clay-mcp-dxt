# Clay MCP Desktop Extension

This file provides guidance to coding agents when working with code in this repository.

## Project Overview

This is a Desktop Extension (.dxt) wrapper for Clay's MCP Server that enables one-click installation in Claude Desktop. The project wraps [@clayhq/clay-mcp](https://github.com/clay-inc/clay-mcp) to provide Clay CRM integration.

## Architecture

- **server/index.js**: ES module wrapper that validates the Clay API key and imports the actual Clay MCP server from node_modules
- **manifest.json**: Desktop Extension manifest defining the MCP server configuration, user settings, and available tools
- The actual Clay MCP functionality is provided by the `@clayhq/clay-mcp` npm package

## Common Commands

```bash
# Install dependencies (automatically installs latest @clayhq/clay-mcp)
npm install

# Build the Desktop Extension (.dxt file)
npm run build

# Test the server runs correctly
npm test

# Update to latest Clay MCP version
npm run update:clay
```

## Release Process

Releases are automated via GitHub Actions when the version in `package.json` and `manifest.json` changes:
1. Version bump triggers `.github/workflows/release.yml`
2. Workflow builds the `.dxt` file and creates a GitHub release
3. The `.github/workflows/sync-version.yml` keeps versions synchronized

## Environment Configuration

The extension requires a `CLAY_API_KEY` environment variable which is configured through the Desktop Extension user settings interface. The server wrapper validates this key before starting.