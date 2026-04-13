import type { ApiClient } from '../api-client.js';

export const getLinkTool = {
  name: 'get_link',
  description: 'Get details of a specific short link by ID or code — target URL, status, click count, QR style, and creation date.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      link_id: { type: 'string', description: 'The short link ID or code' },
    },
    required: ['link_id'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.getLink(args.link_id);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
