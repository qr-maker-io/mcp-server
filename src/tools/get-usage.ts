import type { ApiClient } from '../api-client.js';

export const getUsageTool = {
  name: 'get_usage',
  description: 'Check current billing period usage, quota limits, and estimated cost. Shows QR codes generated, links created, and API calls for the current month.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
  },
  handler: async (client: ApiClient, _args: any) => {
    const result = await client.getUsage();
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
