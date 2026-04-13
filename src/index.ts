#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

function parseArgs(argv: string[]): { apiKey: string; baseUrl: string } {
  let apiKey = process.env.QR_MAKER_API_KEY ?? '';
  let baseUrl = process.env.QR_MAKER_API_URL ?? 'https://api.qr-maker.io';

  for (const arg of argv) {
    if (arg.startsWith('--api-key=')) {
      apiKey = arg.slice('--api-key='.length);
    } else if (arg.startsWith('--api-url=')) {
      baseUrl = arg.slice('--api-url='.length);
    }
  }

  if (!apiKey) {
    console.error('[qr-maker-mcp] Warning: No API key provided. Tools will be listed but calls will fail. Pass --api-key=qk_live_... or set QR_MAKER_API_KEY.');
  }

  return { apiKey, baseUrl };
}

async function main() {
  const { apiKey, baseUrl } = parseArgs(process.argv.slice(2));

  const server = createServer(apiKey, baseUrl);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error(`[qr-maker-mcp] Connected via stdio (API: ${baseUrl})`);
}

main().catch((err) => {
  console.error('[qr-maker-mcp] Fatal error:', err);
  process.exit(1);
});
