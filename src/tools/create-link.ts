import type { ApiClient } from '../api-client.js';

export const createLinkTool = {
  name: 'create_short_link',
  description: 'Create a tracked short link with click analytics. Use this to add tracking to QR codes — encode the short URL as the QR content. Supports custom codes and expiration dates.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      target_url: { type: 'string', description: 'The destination URL that the short link redirects to' },
      custom_code: { type: 'string', description: 'Optional custom short code (3-32 alphanumeric chars). Auto-generated if omitted.' },
      expires_at: { type: 'string', description: 'Optional expiration date in ISO 8601 format' },
    },
    required: ['target_url'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.createLink(args);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
