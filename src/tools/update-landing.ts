import type { ApiClient } from '../api-client.js';

export const updateLandingTool = {
  name: 'update_landing',
  description: 'Update a landing page HTML content and re-publish to CDN. The existing short link and QR code continue to work — only the page content changes.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      landing_id: { type: 'string', description: 'The landing page ID to update' },
      html: { type: 'string', description: 'New HTML content for the landing page' },
      title: { type: 'string', description: 'Optional new title' },
    },
    required: ['landing_id', 'html'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.updateLanding(args.landing_id, {
      html: args.html,
      title: args.title,
    });
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
