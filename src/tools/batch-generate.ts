import type { ApiClient } from '../api-client.js';

export const batchGenerateTool = {
  name: 'batch_generate',
  description: 'Generate multiple QR codes in bulk (up to 100). Requires Pro tier or above. Returns a batch ID to poll for status. Each item can have different content and style.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      items: {
        type: 'array',
        description: 'Array of QR generation requests (max 100)',
        items: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Data to encode' },
            format: { type: 'string', enum: ['png', 'svg'] },
            style: { type: 'object', description: 'QR styling options' },
          },
          required: ['content'],
        },
      },
      webhook_url: { type: 'string', description: 'Optional webhook URL to notify when batch is complete' },
    },
    required: ['items'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.batchGenerate({ items: args.items, webhook_url: args.webhook_url });
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ batch_id: result.id, status: result.status, total: result.total }, null, 2),
      }],
    };
  },
};
