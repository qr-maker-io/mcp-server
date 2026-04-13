import type { ApiClient } from '../api-client.js';

export const getLandingTool = {
  name: 'get_landing',
  description: 'Get details of a published landing page — URL, title, versions, and associated short link.',
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
