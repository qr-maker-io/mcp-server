import type { ApiClient } from '../api-client.js';

export const getLinkAnalyticsTool = {
  name: 'get_link_analytics',
  description: 'Get click analytics for a short link — total clicks, unique visitors, breakdown by country and day. Covers the last 30 days.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      link_id: { type: 'string', description: 'The short link ID to get analytics for' },
    },
    required: ['link_id'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.getLinkAnalytics(args.link_id);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
