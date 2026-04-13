import type { ApiClient } from '../api-client.js';

export const getLandingTool = {
  name: 'get_landing',
  description: `Retrieve full details of a published micro-landing page by its ID. Returns the page title, public URL (via its associated short link), HTML content, publish status, version history, and the short link code used for QR code generation. Use this to verify a landing page was published correctly, retrieve its public URL to share or encode in a QR, or inspect its current content before calling update_landing. The landing_id is returned by publish_landing when the page is created.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      landing_id: { type: 'string', description: 'The landing page ID' },
    },
    required: ['landing_id'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.getLanding(args.landing_id);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
