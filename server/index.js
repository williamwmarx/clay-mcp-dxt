#!/usr/bin/env node

/**
 * Clay MCP Desktop Extension Server Wrapper
 * 
 * This minimal ES module wrapper ensures proper loading of the Clay MCP server
 * and provides basic validation and error handling.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Handle --version and --help flags before API key validation
const args = process.argv.slice(2);
if (args.includes('--version') || args.includes('-v')) {
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
  console.log(pkg.version);
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
  console.log('Clay MCP Desktop Extension Server');
  console.log('Usage: node server/index.js [options]');
  console.log('Options:');
  console.log('  --version, -v  Show version number');
  console.log('  --help, -h     Show help');
  process.exit(0);
}

// Validate API key is present
if (!process.env.CLAY_API_KEY) {
  console.error('Error: CLAY_API_KEY environment variable is required');
  console.error('Please configure your Clay API key in the extension settings');
  process.exit(1);
}

// Basic API key format validation
const apiKey = process.env.CLAY_API_KEY.trim();
if (apiKey.length < 10 || apiKey.length > 256) {
  console.error('Error: CLAY_API_KEY appears to be invalid');
  console.error('API key should be between 10 and 256 characters');
  process.exit(1);
}

// Check for placeholder values
if (apiKey === 'your-api-key-here' || apiKey === 'YOUR_API_KEY' || /^[x]+$/i.test(apiKey)) {
  console.error('Error: CLAY_API_KEY appears to be a placeholder value');
  console.error('Please set a valid API key from clay.earth');
  process.exit(1);
}

// Handle process signals for graceful shutdown
process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  process.exit(1);
});

// Import and run the Clay MCP server
try {
  await import('@clayhq/clay-mcp');
} catch (err) {
  console.error('Failed to start Clay MCP server:', err.message);
  process.exit(1);
}

